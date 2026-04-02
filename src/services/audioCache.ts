import { generateSpeech } from './tts';

// Simple in-memory cache for the session
const audioCache: Record<string, string> = {};

export let isAudioQuotaExceeded = false;

export const setAudioQuotaExceeded = (value: boolean) => {
  isAudioQuotaExceeded = value;
  window.dispatchEvent(new Event('audioQuotaExceeded'));
};

// Use IndexedDB for persistent storage across refreshes
const DB_NAME = 'AudioCacheDB';
const STORE_NAME = 'audio_clips';

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const getCachedAudio = async (text: string): Promise<string | null> => {
  // Check memory cache first
  if (audioCache[text]) return audioCache[text];

  // Check IndexedDB
  try {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(text);
    
    return new Promise((resolve) => {
      request.onsuccess = () => {
        const result = request.result;
        if (result) {
          audioCache[text] = result; // Update memory cache
          resolve(result);
        } else {
          resolve(null);
        }
      };
      request.onerror = () => resolve(null);
    });
  } catch (e) {
    console.error('Cache read error', e);
    return null;
  }
};

export const saveAudioToCache = async (text: string, base64Data: string) => {
  audioCache[text] = base64Data;
  try {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    store.put(base64Data, text);
  } catch (e) {
    console.error('Cache write error', e);
  }
};

export const getOrGenerateAudio = async (text: string): Promise<string> => {
  const cached = await getCachedAudio(text);
  if (cached) return cached;

  if (isAudioQuotaExceeded) {
    throw new Error("Audio quota exceeded and audio not cached.");
  }

  try {
    const generated = await generateSpeech(text);
    await saveAudioToCache(text, generated);
    return generated;
  } catch (error: any) {
    const errorMsg = error?.message || String(error);
    if (errorMsg.toLowerCase().includes('quota') || errorMsg.includes('429')) {
      setAudioQuotaExceeded(true);
    }
    throw error;
  }
};

export const isAudioCached = async (text: string): Promise<boolean> => {
  const cached = await getCachedAudio(text);
  return !!cached;
};
