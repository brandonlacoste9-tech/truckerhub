-- Drivers Table
CREATE TABLE IF NOT EXISTS drivers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL, -- Ties to auth.users
    name TEXT NOT NULL,
    license_number TEXT,
    dot_number TEXT,
    mc_number TEXT,
    region TEXT DEFAULT 'US', -- 'US' or 'CAN'
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Loads Table
CREATE TABLE IF NOT EXISTS loads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    driver_id UUID REFERENCES drivers(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'available', -- available, booked, in-transit, delivered, paid
    origin_city TEXT,
    origin_state TEXT,
    destination_city TEXT,
    destination_state TEXT,
    pickup_time TIMESTAMPTZ,
    delivery_time TIMESTAMPTZ,
    weight NUMERIC,
    rate NUMERIC,
    documents JSONB DEFAULT '[]'::jsonb, -- Store list of document URLs/metadata
    created_at TIMESTAMPTZ DEFAULT now()
);

-- HOS Logs Table (Status Changes)
CREATE TABLE IF NOT EXISTS hos_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    driver_id UUID REFERENCES drivers(id) ON DELETE CASCADE,
    status TEXT NOT NULL, -- OFF, SLEEP, ON_DUTY, DRIVE
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ, -- If NULL, currently active
    location_lat NUMERIC,
    location_lng NUMERIC,
    location_name TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Fuel Entries Table
CREATE TABLE IF NOT EXISTS fuel_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    driver_id UUID REFERENCES drivers(id) ON DELETE CASCADE,
    date TIMESTAMPTZ DEFAULT now(),
    amount NUMERIC, -- Gallons/Litres
    cost NUMERIC,
    odometer NUMERIC,
    location_name TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);
