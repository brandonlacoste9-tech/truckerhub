'use server';

import { db } from '@/db';
import { loads, hosLogs, fuelEntries } from '@/db/schema';
import { desc } from 'drizzle-orm';

export async function getLoads() {
  try {
    const data = await db.select().from(loads).orderBy(desc(loads.created_at));
    return { data, error: null };
  } catch (err: unknown) {
    return { data: [], error: err instanceof Error ? err.message : String(err) };
  }
}

export async function getHosLogs() {
  try {
    const data = await db.select().from(hosLogs).orderBy(desc(hosLogs.created_at));
    return { data, error: null };
  } catch (err: unknown) {
    return { data: [], error: err instanceof Error ? err.message : String(err) };
  }
}

export async function addHosLog(logData: {
  driver_id: string;
  status: string;
  start_time: string;
  location_name?: string | null;
}) {
  try {
    const data = await db.insert(hosLogs).values({
      driver_id: logData.driver_id,
      status: logData.status,
      start_time: new Date(logData.start_time),
      location_name: logData.location_name,
    }).returning();
    return { data, error: null };
  } catch (err: unknown) {
    return { data: null, error: err instanceof Error ? err.message : String(err) };
  }
}

export async function getFuelEntries() {
  try {
    const data = await db.select().from(fuelEntries).orderBy(desc(fuelEntries.date));
    return { data, error: null };
  } catch (err: unknown) {
    return { data: [], error: err instanceof Error ? err.message : String(err) };
  }
}

export async function addFuelEntry(entryData: {
  driver_id: string;
  amount: string;
  odometer: string;
  location_name: string;
}) {
  try {
    const data = await db.insert(fuelEntries).values({
      driver_id: entryData.driver_id,
      amount: entryData.amount,
      odometer: entryData.odometer,
      location_name: entryData.location_name,
      // Defaulting cost per unit for rough mock if not captured
      cost: String(parseFloat(entryData.amount) * 3.5), 
    }).returning();
    return { data, error: null };
  } catch (err: unknown) {
    return { data: null, error: err instanceof Error ? err.message : String(err) };
  }
}
