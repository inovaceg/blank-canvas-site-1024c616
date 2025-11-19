-- Create addresses table for multiple delivery addresses
CREATE TABLE IF NOT EXISTS public.addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL,
  label TEXT NOT NULL, -- Ex: "Casa", "Trabalho", "Depósito"
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  neighborhood TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  cep TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_client FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;

-- RLS Policies for addresses
CREATE POLICY "Clients can view their own addresses"
  ON public.addresses
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.clients 
      WHERE clients.id = addresses.client_id 
      AND clients.user_id = auth.uid()
    )
  );

CREATE POLICY "Clients can insert their own addresses"
  ON public.addresses
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.clients 
      WHERE clients.id = addresses.client_id 
      AND clients.user_id = auth.uid()
    )
  );

CREATE POLICY "Clients can update their own addresses"
  ON public.addresses
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.clients 
      WHERE clients.id = addresses.client_id 
      AND clients.user_id = auth.uid()
    )
  );

CREATE POLICY "Clients can delete their own addresses"
  ON public.addresses
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.clients 
      WHERE clients.id = addresses.client_id 
      AND clients.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all addresses"
  ON public.addresses
  FOR ALL
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

-- Create trigger for updated_at
CREATE TRIGGER update_addresses_updated_at
  BEFORE UPDATE ON public.addresses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add tracking_status to orders table
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS tracking_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS tracking_code TEXT,
ADD COLUMN IF NOT EXISTS estimated_delivery DATE,
ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMP WITH TIME ZONE;

-- Add comments for clarity
COMMENT ON COLUMN public.orders.tracking_status IS 'Status: pending, processing, shipped, delivered, cancelled';
COMMENT ON COLUMN public.orders.tracking_code IS 'Código de rastreamento dos Correios ou transportadora';

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_addresses_client_id ON public.addresses(client_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);