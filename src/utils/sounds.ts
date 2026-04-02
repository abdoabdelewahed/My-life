// Web Audio API for generating sounds without external assets
const getAudioContext = () => {
  if (typeof window === 'undefined') return null;
  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  return AudioContextClass ? new AudioContextClass() : null;
};

let audioCtx: AudioContext | null = null;

const initAudio = () => {
  if (!audioCtx) {
    audioCtx = getAudioContext();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

const isSoundEnabled = () => localStorage.getItem('soundEnabled') !== 'false';

export const playPop = () => {
  if (!isSoundEnabled()) return;
  const ctx = initAudio();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();
  
  osc.type = 'sine';
  osc.frequency.setValueAtTime(400, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.05);
  
  gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
  
  osc.connect(gainNode);
  gainNode.connect(ctx.destination);
  
  osc.start();
  osc.stop(ctx.currentTime + 0.1);
};

export const playSuccess = () => {
  if (!isSoundEnabled()) return;
  const ctx = initAudio();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();
  
  osc.type = 'sine';
  // Play a quick arpeggio (A4 -> C#5 -> E5)
  osc.frequency.setValueAtTime(440, ctx.currentTime); 
  osc.frequency.setValueAtTime(554.37, ctx.currentTime + 0.08); 
  osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.16); 
  
  gainNode.gain.setValueAtTime(0, ctx.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.02);
  gainNode.gain.setValueAtTime(0.2, ctx.currentTime + 0.2);
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
  
  osc.connect(gainNode);
  gainNode.connect(ctx.destination);
  
  osc.start();
  osc.stop(ctx.currentTime + 0.4);
};

export const playError = () => {
  if (!isSoundEnabled()) return;
  const ctx = initAudio();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();
  
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(150, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.2);
  
  gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
  
  osc.connect(gainNode);
  gainNode.connect(ctx.destination);
  
  osc.start();
  osc.stop(ctx.currentTime + 0.2);
};

export const playLevelUp = () => {
  if (!isSoundEnabled()) return;
  const ctx = initAudio();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();
  
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(329.63, ctx.currentTime); // E4
  osc.frequency.setValueAtTime(440, ctx.currentTime + 0.1); // A4
  osc.frequency.setValueAtTime(554.37, ctx.currentTime + 0.2); // C#5
  osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.3); // E5
  osc.frequency.setValueAtTime(880, ctx.currentTime + 0.4); // A5
  
  gainNode.gain.setValueAtTime(0, ctx.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05);
  gainNode.gain.setValueAtTime(0.3, ctx.currentTime + 0.4);
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
  
  osc.connect(gainNode);
  gainNode.connect(ctx.destination);
  
  osc.start();
  osc.stop(ctx.currentTime + 0.8);
};
