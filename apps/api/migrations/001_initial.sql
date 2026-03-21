-- Phase 5: Initial schema for Smart Waste Intelligence Platform
-- Execute in Supabase SQL Editor or via MCP
-- DB-03: Also create a public storage bucket named "sort-images" in Supabase Dashboard

-- sort_events table (DB-01)
CREATE TABLE IF NOT EXISTS sort_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
    label TEXT NOT NULL,
    routed_bin TEXT NOT NULL,
    confidence NUMERIC NOT NULL,
    image_url TEXT,
    waste_diverted_kg NUMERIC DEFAULT 0,
    co2_saved_kg NUMERIC DEFAULT 0,
    fallback_used BOOLEAN DEFAULT false,
    source_device_id UUID,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- devices table (DB-02)
CREATE TABLE IF NOT EXISTS devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    location_name TEXT,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS policies for hackathon (permissive, service_role key bypasses anyway)
ALTER TABLE sort_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to sort_events" ON sort_events
    FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE devices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to devices" ON devices
    FOR ALL USING (true) WITH CHECK (true);
