-- Sample User info (Auth mapping simulation for now)
-- Let's use a dummy user_id
DO $$
DECLARE
  v_driver_id UUID;
BEGIN
  -- Insert a driver record
  INSERT INTO drivers (user_id, name, license_number, dot_number, mc_number, region)
  VALUES ('00000000-0000-0000-0000-000000000001', 'John Doe', 'CDL-12345678', 'DOT-987654', 'MC-123456', 'US')
  ON CONFLICT (user_id) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO v_driver_id;

  -- Insert sample loads
  INSERT INTO loads (driver_id, status, origin_city, origin_state, destination_city, destination_state, pickup_time, delivery_time, weight, rate)
  VALUES
    (v_driver_id, 'in-transit', 'Chicago', 'IL', 'Phoenix', 'AZ', now() - interval '1 day', now() + interval '2 days', 42000, 4200),
    (v_driver_id, 'completed', 'Gary', 'IN', 'Lincoln', 'NE', now() - interval '5 days', now() - interval '3 days', 38000, 2150),
    (v_driver_id, 'booked', 'Phoenix', 'AZ', 'Dallas', 'TX', now() + interval '3 days', now() + interval '5 days', 40000, 3100);

  -- Insert HOS logs for today (simulate a typical drive day)
  INSERT INTO hos_logs (driver_id, status, start_time, end_time, location_name)
  VALUES
    (v_driver_id, 'OFF', date_trunc('day', now()) - interval '10 hours', date_trunc('day', now()), 'Chicago, IL'),
    (v_driver_id, 'ON_DUTY', date_trunc('day', now()), date_trunc('day', now()) + interval '1 hour', 'Chicago, IL'),
    (v_driver_id, 'DRIVE', date_trunc('day', now()) + interval '1 hour', date_trunc('day', now()) + interval '6 hours', 'Route 66'),
    (v_driver_id, 'OFF', date_trunc('day', now()) + interval '6 hours', date_trunc('day', now()) + interval '6.5 hours', 'Rest Stop'),
    (v_driver_id, 'DRIVE', date_trunc('day', now()) + interval '6.5 hours', date_trunc('day', now()) + interval '10 hours', 'I-40 W'),
    (v_driver_id, 'SLEEP', date_trunc('day', now()) + interval '10 hours', NULL, 'Amarillo, TX');

  -- Insert Fuel entries
  INSERT INTO fuel_entries (driver_id, date, amount, cost, odometer, location_name)
  VALUES
    (v_driver_id, now() - interval '2 days', 150.5, 600.00, 124500, 'Pilot Travel Center, Gary IN'),
    (v_driver_id, now() - interval '1 day', 120.0, 475.50, 125200, 'Loves Travel Stop, St Louis MO');

END $$;
