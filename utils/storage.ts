import * as SecureStore from "expo-secure-store";

/**
 * Securely saves a key-value pair, using SecureStore on native platforms
 * and localStorage on web
 */
export async function secureSave(key: string, value: string) {
  try {
    if (process.env.EXPO_PUBLIC_PLATFORM === "web") {
      localStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  } catch (error) {
    console.error("Error saving secure data:", error);
    throw new Error("Failed to save secure data");
  }
}

/**
 * Retrieves a value by key from SecureStore (native) or localStorage (web)
 */
export async function secureGet(key: string) {
  try {
    if (process.env.EXPO_PUBLIC_PLATFORM === "web") {
      return localStorage.getItem(key);
    } else {
      return await SecureStore.getItemAsync(key);
    }
  } catch (error) {
    console.error("Error retrieving secure data:", error);
    throw new Error("Failed to retrieve secure data");
  }
}

/**
 * Deletes a value by key from SecureStore (native) or localStorage (web)
 */
export async function secureDelete(key: string) {
  try {
    if (process.env.EXPO_PUBLIC_PLATFORM === "web") {
      localStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  } catch (error) {
    console.error("Error deleting secure data:", error);
    throw new Error("Failed to delete secure data");
  }
}

// Common storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: "token",
  USER_PREFERENCES: "userPrefs",
} as const;