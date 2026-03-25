/**
 * Lightweight markdown-like renderer for article content.
 * Supports: **bold**, *italic*, [links](url), - lists, ## headings, paragraphs.
 * No dependencies.
 */

function escapeHtml(text: string) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function parseInline(text: string): string {
  let html = escapeHtml(text)
  // Bold **text**
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-slate-900">$1</strong>')
  // Italic *text*
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')
  // Links [label](url)
  html = html.replace(
    /\[(.+?)\]\((.+?)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-indigo-600 underline hover:text-indigo-800">$1</a>'
  )
  return html
}

export default function MarkdownContent({ content }: { content: string }) {
  const lines = content.split('\n')
  const elements: JSX.Element[] = []
  let listItems: string[] = []
  let key = 0

  function flushList() {
    if (listItems.length > 0) {
      elements.push(
        <ul key={key++} className="list-disc list-inside space-y-1 mb-4 text-slate-700">
          {listItems.map((item, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: parseInline(item) }} />
          ))}
        </ul>
      )
      listItems = []
    }
  }

  for (const line of lines) {
    const trimmed = line.trim()

    // Headings
    if (trimmed.startsWith('### ')) {
      flushList()
      elements.push(
        <h4 key={key++} className="font-display font-bold text-base text-slate-900 mt-6 mb-2"
          dangerouslySetInnerHTML={{ __html: parseInline(trimmed.slice(4)) }}
        />
      )
    } else if (trimmed.startsWith('## ')) {
      flushList()
      elements.push(
        <h3 key={key++} className="font-display font-bold text-lg text-slate-900 mt-8 mb-3"
          dangerouslySetInnerHTML={{ __html: parseInline(trimmed.slice(3)) }}
        />
      )
    } else if (trimmed.startsWith('# ')) {
      flushList()
      elements.push(
        <h2 key={key++} className="font-display font-bold text-xl text-slate-900 mt-8 mb-3"
          dangerouslySetInnerHTML={{ __html: parseInline(trimmed.slice(2)) }}
        />
      )
    }
    // List items
    else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      listItems.push(trimmed.slice(2))
    }
    // Empty line = paragraph break
    else if (trimmed === '') {
      flushList()
    }
    // Regular text
    else {
      flushList()
      elements.push(
        <p key={key++} className="text-slate-700 leading-relaxed mb-3"
          dangerouslySetInnerHTML={{ __html: parseInline(trimmed) }}
        />
      )
    }
  }
  flushList()

  return <div className="prose-custom">{elements}</div>
}
