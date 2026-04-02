export const playChildVoice = (text: string) => {
  if (!window.speechSynthesis) return;
  
  // Cancel any ongoing speech
  window.speechSynthesis.cancel();
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ar-SA';
  utterance.pitch = 1.8; // High pitch for a childish voice
  utterance.rate = 1.1; // Slightly faster
  
  // Try to find a local Arabic voice to avoid downloading/delay
  const voices = window.speechSynthesis.getVoices();
  const arVoice = voices.find(v => v.lang.startsWith('ar') && v.localService);
  if (arVoice) {
    utterance.voice = arVoice;
  }
  
  window.speechSynthesis.speak(utterance);
};
