import { useState, useEffect, useRef } from 'react';
import { createAmbientAudio } from '../lib/audio/ambientAudio';

const STORAGE_KEY = 'mindful-audio-prefs';

interface AudioPreferences {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
}

export function useAudioPreferences() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(50);
  const audioRef = useRef<ReturnType<typeof createAmbientAudio> | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const prefs: AudioPreferences = JSON.parse(stored);
        setIsMuted(prefs.isMuted ?? true);
        setVolume(prefs.volume ?? 50);
      } catch (e) {
        console.error('Failed to parse audio preferences:', e);
      }
    }

    audioRef.current = createAmbientAudio();

    return () => {
      if (audioRef.current) {
        audioRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    const prefs: AudioPreferences = { isPlaying, isMuted, volume };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  }, [isPlaying, isMuted, volume]);

  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying && !isMuted) {
      audioRef.current.play();
      audioRef.current.setVolume(volume / 100);
    } else {
      audioRef.current.stop();
    }
  }, [isPlaying, isMuted, volume]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleSetVolume = (newVolume: number) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.setVolume(newVolume / 100);
    }
  };

  return {
    isPlaying,
    isMuted,
    volume,
    togglePlay,
    toggleMute,
    setVolume: handleSetVolume,
  };
}
