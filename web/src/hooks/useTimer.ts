import { useCallback, useEffect, useState } from "react";

type Timer = {
  resume: () => void,
  stop: () => void,
  restart: () => void,
  timeLeft: number
  timeElapsed: number
}


function useTimer(timeMs: number): Timer {
  const [isRunning, setIsRunning] = useState(false);
  const updateMs = 50
  const [timeLeft, setTimeLeft] = useState(timeMs);

  const resume = useCallback(() => setIsRunning(true), []);
  const stop = useCallback(() => setIsRunning(false), []);
  const restart = useCallback(() => {
    setTimeLeft(timeMs);
    setIsRunning(true);
  }, [timeMs]);

  // Main loop
  useEffect(() => {
    if (isRunning) {
      const intervalid = setInterval(() => {
        setTimeLeft(oldTime => {
          const newTime = oldTime - updateMs;
          return newTime > 0 ? newTime : 0
        });
      }, updateMs);
      return () => clearInterval(intervalid);
    }
  }, [isRunning]);


  useEffect(() => {
    if (timeLeft <= 0) {
      stop()
    }
  }, [timeLeft, stop])

  return {
    resume: resume,
    stop: stop,
    restart: restart,
    timeLeft: timeLeft,
    timeElapsed: timeMs - timeLeft
  }
}

export default useTimer;