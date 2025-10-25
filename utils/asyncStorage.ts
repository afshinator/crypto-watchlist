import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Stores a key-value pair in AsyncStorage.
 * The value is stored as a string. Objects/Arrays must be stringified before calling this function.
 *
 * @param key - The key under which to store the value.
 * @param value - The string value to store.
 * @returns A Promise that resolves when the operation is complete.
 */
export const setItem = async (key: string, value: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, value);
    console.log(`AsyncStorage: Successfully set item for key: ${key}`);
  } catch (error) {
    console.error(`AsyncStorage Error: Could not set item for key ${key}`, error);
    // You might want to throw the error or handle it more gracefully
    throw error;
  }
};

/**
 * Retrieves a string value for a given key from AsyncStorage.
 *
 * @param key - The key to retrieve the value for.
 * @returns A Promise that resolves to the string value, or null if the key doesn't exist.
 */
export const getItem = async (key: string): Promise<string | null> => {
  try {
    const value = await AsyncStorage.getItem(key);
    console.log(`AsyncStorage: Retrieved value for key: ${key}`);
    return value;
  } catch (error) {
    console.error(`AsyncStorage Error: Could not get item for key ${key}`, error);
    // You might want to return null or throw the error
    throw error;
  }
};

/**
 * Retrieves all keys currently stored in AsyncStorage.
 *
 * @returns A Promise that resolves to an array of strings representing all keys.
 */
export const getAllKeys = async (): Promise<readonly string[]> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    console.log('AsyncStorage: Retrieved all keys:', keys);
    return keys;
  } catch (error) {
    console.error('AsyncStorage Error: Could not get all keys', error);
    // You might want to return an empty array or throw the error
    throw error;
  }
};


/**
 * Stores a JavaScript object by stringifying it first.
 * @param key - The key under which to store the object.
 * @param value - The object to store.
 * @returns A Promise that resolves when the operation is complete.
 */
export const setJSONObject = async <T extends object>(key: string, value: T): Promise<void> => {
  try {
    const stringifiedValue = JSON.stringify(value);
    await setItem(key, stringifiedValue);
  } catch (error) {
    console.error(`AsyncStorage Error: Could not stringify or set object for key ${key}`, error);
    throw error;
  }
};

/**
 * Retrieves and parses a JSON object from AsyncStorage.
 * @param key - The key to retrieve the object for.
 * @returns A Promise that resolves to the parsed object, or null if not found/invalid.
 */
export const getJSONObject = async <T extends object>(key: string): Promise<T | null> => {
  try {
    const stringValue = await getItem(key);
    if (stringValue) {
      return JSON.parse(stringValue) as T;
    }
    return null;
  } catch (error) {
    console.error(`AsyncStorage Error: Could not get or parse object for key ${key}`, error);
    return null; // Return null on parsing error
  }
};