export function createAmbientAudio() {
  let audioContext: AudioContext | null = null;
  let oscillator: OscillatorNode | null = null;
  let gainNode: GainNode | null = null;
  let isPlaying = false;

  const play = () => {
    if (isPlaying) return;

    audioContext = new AudioContext();
    gainNode = audioContext.createGain();
    gainNode.gain.value = 0.1;

    oscillator = audioContext.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.value = 220;

    const lfo = audioContext.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.5;

    const lfoGain = audioContext.createGain();
    lfoGain.gain.value = 10;

    lfo.connect(lfoGain);
    lfoGain.connect(oscillator.frequency);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();
    lfo.start();
    isPlaying = true;
  };

  const stop = () => {
    if (!isPlaying) return;

    if (oscillator) {
      oscillator.stop();
      oscillator.disconnect();
      oscillator = null;
    }

    if (audioContext) {
      audioContext.close();
      audioContext = null;
    }

    gainNode = null;
    isPlaying = false;
  };

  const setVolume = (volume: number) => {
    if (gainNode) {
      gainNode.gain.value = volume * 0.2;
    }
  };

  return { play, stop, setVolume };
}
