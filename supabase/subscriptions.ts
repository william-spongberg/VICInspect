import { v4 as uuidv4 } from "uuid";

import { supabase } from "@/supabase/client";

export interface DbSubscription {
  device_id: string;
  user_id: string;
  endpoint: string;
  keys: {
    auth: string;
    p256dh: string;
  };
  created_at: string;
  updated_at?: string;
}

const SUBSCRIPTION_TABLE = "subscriptions";

export async function subscribeUser(sub: DbSubscription) {
  try {
    // check if subscription already exists by device_id
    const { data: existing } = await supabase
      .from(SUBSCRIPTION_TABLE)
      .select()
      .eq("device_id", sub.device_id);

    let result;

    // if already exists, update existing subscription with new endpoint + keys
    if (existing && existing.length > 0) {
      const updateData = {
        endpoint: sub.endpoint,
        keys: sub.keys,
        user_id: sub.user_id,
        updated_at: new Date().toISOString(),
      };

      result = await supabase
        .from(SUBSCRIPTION_TABLE)
        .update(updateData)
        .eq("device_id", sub.device_id)
        .select();
    } else {
      // else just create new subscription
      const insertData = {
        endpoint: sub.endpoint,
        user_id: sub.user_id,
        device_id: sub.device_id,
        keys: sub.keys,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      result = await supabase
        .from(SUBSCRIPTION_TABLE)
        .insert(insertData)
        .select();
    }

    return { success: true, data: result.data };
  } catch (error) {
    return {
      success: false,
      error: `Failed to subscribe:`,
      details: error,
    };
  }
}

// unsubscribe by device_id instead of endpoint
export async function unsubscribeUser(deviceId: string) {
  try {
    // try to delete subscription by device_id
    const { error } = await supabase
      .from(SUBSCRIPTION_TABLE)
      .delete()
      .eq("device_id", deviceId);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to unsubscribe", details: error };
  }
}

// set device id in local storage
export function getDeviceId(): string {
  if (typeof window === "undefined") {
    return "";
  }

  const storageKey = "ptv-inspector-device-id";
  let deviceId = localStorage.getItem(storageKey);

  if (!deviceId) {
    deviceId = uuidv4();
    localStorage.setItem(storageKey, deviceId);
  }

  return deviceId;
}
