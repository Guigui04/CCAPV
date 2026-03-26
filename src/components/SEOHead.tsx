import { Helmet } from 'react-helmet-async'

interface SEOHeadProps {
  title?: string
  description?: string
  image?: string
  url?: string
}

const DEFAULT_TITLE = 'Info Jeunes — Infos, aides et événements pour les jeunes'
const DEFAULT_DESC = 'Découvre les dispositifs, aides et événements pour les jeunes de 11 à 30 ans dans ta communauté de communes.'

export default function SEOHead({ title, description, image, url }: SEOHeadProps) {
  const fullTitle = title ? `${title} | Info Jeunes` : DEFAULT_TITLE
  const desc = description || DEFAULT_DESC

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:type" content="website" />
      {url && <meta property="og:url" content={url} />}
      {image && <meta property="og:image" content={image} />}
      <meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      {image && <meta name="twitter:image" content={image} />}
    </Helmet>
  )
}
