-- Migration: Add EPCI fields to communes table
-- Adds siren, type_epci, department_code, department_name, region, population
-- to support all French intercommunalités

ALTER TABLE public.communes
  ADD COLUMN IF NOT EXISTS siren VARCHAR(9) UNIQUE,
  ADD COLUMN IF NOT EXISTS type_epci VARCHAR(3) CHECK (type_epci IN ('CC', 'CA', 'CU', 'M', 'EPT')),
  ADD COLUMN IF NOT EXISTS department_code VARCHAR(3),
  ADD COLUMN IF NOT EXISTS department_name TEXT,
  ADD COLUMN IF NOT EXISTS region TEXT,
  ADD COLUMN IF NOT EXISTS population INTEGER DEFAULT 0;

-- Indexes for filtering
CREATE INDEX IF NOT EXISTS idx_communes_type_epci ON public.communes(type_epci);
CREATE INDEX IF NOT EXISTS idx_communes_department ON public.communes(department_code);
CREATE INDEX IF NOT EXISTS idx_communes_region ON public.communes(region);
CREATE INDEX IF NOT EXISTS idx_communes_is_active ON public.communes(is_active);
CREATE INDEX IF NOT EXISTS idx_communes_siren ON public.communes(siren);
