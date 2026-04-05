import { pgTable, uuid, text, numeric, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const drivers = pgTable('drivers', {
  id: uuid('id').defaultRandom().primaryKey(),
  user_id: uuid('user_id').notNull().unique(), // Ties to auth.users if needed
  name: text('name').notNull(),
  license_number: text('license_number'),
  dot_number: text('dot_number'),
  mc_number: text('mc_number'),
  region: text('region').default('US'),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow()
});

export const loads = pgTable('loads', {
  id: uuid('id').defaultRandom().primaryKey(),
  driver_id: uuid('driver_id').references(() => drivers.id, { onDelete: 'cascade' }),
  status: text('status').default('available'),
  origin_city: text('origin_city'),
  origin_state: text('origin_state'),
  destination_city: text('destination_city'),
  destination_state: text('destination_state'),
  pickup_time: timestamp('pickup_time', { withTimezone: true }),
  delivery_time: timestamp('delivery_time', { withTimezone: true }),
  weight: numeric('weight'),
  rate: numeric('rate'),
  documents: jsonb('documents').default(sql`'[]'::jsonb`),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow()
});

export const hosLogs = pgTable('hos_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  driver_id: uuid('driver_id').references(() => drivers.id, { onDelete: 'cascade' }),
  status: text('status').notNull(),
  start_time: timestamp('start_time', { withTimezone: true }).notNull(),
  end_time: timestamp('end_time', { withTimezone: true }),
  location_lat: numeric('location_lat'),
  location_lng: numeric('location_lng'),
  location_name: text('location_name'),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow()
});

export const fuelEntries = pgTable('fuel_entries', {
  id: uuid('id').defaultRandom().primaryKey(),
  driver_id: uuid('driver_id').references(() => drivers.id, { onDelete: 'cascade' }),
  date: timestamp('date', { withTimezone: true }).defaultNow(),
  amount: numeric('amount'),
  cost: numeric('cost'),
  odometer: numeric('odometer'),
  location_name: text('location_name'),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow()
});
