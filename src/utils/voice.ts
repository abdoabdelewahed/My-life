export const playWomanVoice = (text: string) => {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  
  const isSoundEnabled = localStorage.getItem('soundEnabled') !== 'false';
  if (!isSoundEnabled) return;

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ar-SA';
  utterance.pitch = 1.0; // Normal pitch for a woman's voice
  utterance.rate = 0.95; // Normal rate
  
  // Try to find a local Arabic female voice
  const voices = window.speechSynthesis.getVoices();
  const arVoices = voices.filter(v => v.lang.startsWith('ar'));
  
  // Try to find a female voice specifically, otherwise fallback to any Arabic voice
  const femaleVoice = arVoices.find(v => v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('woman') || v.name.includes('Zariyah') || v.name.includes('Laila'));
  
  if (femaleVoice) {
    utterance.voice = femaleVoice;
  } else if (arVoices.length > 0) {
    utterance.voice = arVoices[0];
  }
  
  window.speechSynthesis.speak(utterance);
};
