-- Create waitlist table for storing lead capture form submissions
CREATE TABLE IF NOT EXISTS public.waitlist (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT,
    product_id TEXT NOT NULL,
    product_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Add RLS (Row Level Security) policies
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Allow INSERT for authenticated users (service role)
CREATE POLICY "Allow insert for service role" ON public.waitlist
    FOR INSERT
    WITH CHECK (true);

-- Allow SELECT for authenticated users (service role)
CREATE POLICY "Allow select for service role" ON public.waitlist
    FOR SELECT
    USING (true);

-- Create index on email for performance
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON public.waitlist(email);

-- Create index on product_id for performance
CREATE INDEX IF NOT EXISTS idx_waitlist_product_id ON public.waitlist(product_id);

-- Create index on created_at for performance
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON public.waitlist(created_at);

-- Add trigger to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_waitlist_updated_at
    BEFORE UPDATE ON public.waitlist
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();