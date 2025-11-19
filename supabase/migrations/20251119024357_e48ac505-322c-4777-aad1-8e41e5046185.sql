-- Add additional fields to clients table for complete registration
ALTER TABLE public.clients 
  ADD COLUMN IF NOT EXISTS address_number TEXT,
  ADD COLUMN IF NOT EXISTS address_complement TEXT,
  ADD COLUMN IF NOT EXISTS neighborhood TEXT,
  ADD COLUMN IF NOT EXISTS notes TEXT;

-- Add comment to document the new fields
COMMENT ON COLUMN public.clients.address_number IS 'Street number of the client address';
COMMENT ON COLUMN public.clients.address_complement IS 'Additional address information (apartment, suite, etc)';
COMMENT ON COLUMN public.clients.neighborhood IS 'Neighborhood or district';
COMMENT ON COLUMN public.clients.notes IS 'Internal notes about the client';