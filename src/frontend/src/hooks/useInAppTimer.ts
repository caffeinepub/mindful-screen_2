import { useState, useEffect, useRef } from 'react';
import { useInternetIdentity } from './useInternetIdentity';
import { useActor } from './useActor';
import { getDayStartTimestamp } from '../lib/time';

export function useInAppTimer() {
  const { identity } = useInternetIdentity();
  const { actor } = useActor();
  const [todayElapsedSeconds, setTodayElapsedSeconds] = useState(0);
  const sessionStartRef = useRef<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!actor || !identity) return;

    const loadTodaysSessions = async () => {
      try {
        const dayStart = getDayStartTimestamp();
        const sessions = await actor.getTodaysSessionRecords(BigInt(dayStart));
        const totalSeconds = sessions.reduce((sum, [start, end]) => {
          return sum + Number(end - start) / 1000;
        }, 0);
        setTodayElapsedSeconds(Math.floor(totalSeconds));
      } catch (error) {
        console.error('Failed to load sessions:', error);
      }
    };

    loadTodaysSessions();
  }, [actor, identity]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (sessionStartRef.current !== null && actor && identity) {
          const sessionEnd = Date.now();
          actor.saveSessionRecord(BigInt(sessionStartRef.current), BigInt(sessionEnd)).catch(console.error);
          sessionStartRef.current = null;
        }
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      } else {
        sessionStartRef.current = Date.now();
        intervalRef.current = setInterval(() => {
          setTodayElapsedSeconds((prev) => prev + 1);
        }, 1000);
      }
    };

    if (!document.hidden) {
      sessionStartRef.current = Date.now();
      intervalRef.current = setInterval(() => {
        setTodayElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (sessionStartRef.current !== null && actor && identity) {
        const sessionEnd = Date.now();
        actor.saveSessionRecord(BigInt(sessionStartRef.current), BigInt(sessionEnd)).catch(console.error);
      }
    };
  }, [actor, identity]);

  return { todayElapsedSeconds };
}
