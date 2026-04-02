import { useState, useEffect } from 'react';
import { isAudioCached, isAudioQuotaExceeded } from '../services/audioCache';

export const useAudioAvailability = (text: string | null | undefined) => {
  const [isAvailable, setIsAvailable] = useState(true);

  useEffect(() => {
    if (!text) {
      setIsAvailable(false);
      return;
    }
    
    const checkAvailability = async () => {
      if (isAudioQuotaExceeded) {
        const cached = await isAudioCached(text);
        setIsAvailable(cached);
      } else {
        setIsAvailable(true);
      }
    };

    checkAvailability();

    const handleQuotaExceeded = () => {
      checkAvailability();
    };

    window.addEventListener('audioQuotaExceeded', handleQuotaExceeded);
    return () => window.removeEventListener('audioQuotaExceeded', handleQuotaExceeded);
  }, [text]);

  return isAvailable;
};
