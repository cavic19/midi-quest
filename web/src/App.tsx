import { useCallback, useEffect, useState } from "react";
import { Note, NOTES } from "./types/Note";
import { MAX_HEALTH } from "./config";
import HealthBar from "./components/HealthBar";
import useTimer from "./hooks/useTimer";
import TimerBar from "./components/TimeBar";
import PianoBoard from "./components/PianoBoard";
import NewGameScreen from "./components/NewGameScreen";
import GameOverScreen from "./components/GameOverScreen";
import generateTime from "./generateTime";
import randomItem from "./utils/randomItem";


function App() {
  const [lives, setLives] = useState(MAX_HEALTH);
  const [score, setScore] = useState(0);
  const [note, setNote] = useState(randomItem([...NOTES]));
  const maxTime = generateTime(score);
  const [gameStarted, setGameStarted] = useState(false);
  const [iseGameOver, setIsGameOver] = useState(false);
  const { timeLeft, restart: restartTimer, stop: stopTimer } = useTimer(maxTime);

  useEffect(() => {
    if (gameStarted) {
      setScore(0);
      restartTimer();
    } else {
      stopTimer();
    }
  }, [gameStarted])

  useEffect(() => {
    if (timeLeft == 0) {
      restartTimer();
      setLives(ls => ls - 1);
      setNote(randomItem([...NOTES]))
    }
  }, [timeLeft]);

  useEffect(() => {
    if (lives <= 0) {
      setIsGameOver(true);
      setGameStarted(false);
    }
  }, [lives]);


  const handleTilesChange = useCallback((tiles: Note[]) => {
    if (gameStarted) {
      if (tiles.length == 1 && tiles[0] == note) {
        setNote(randomItem([...NOTES]));
        setScore(sc => sc + 1);
        restartTimer();
      } else if (tiles.length == 0) {
        // DO nothing
      } else {
        // TODO: If lives is lower than 0 or equal GAME OVER
        setLives(lives => lives - 1)
      }
    }

  }, [note, gameStarted]);


  return (
    // This should be in body...
    <div className='w-screen h-screen bg-gradient-to-b from-midnight-green to-my-cyan-600'>
      <div className="h-screen flex flex-col w-fit max-w-[1200px] mx-auto">
        <div className="w-full h-full flex items-center justify-center">
          {iseGameOver ? (
            <GameOverScreen finalScore={score} onPlayAgain={() => {
              setIsGameOver(false);
              setLives(MAX_HEALTH);
              setScore(0);
              setGameStarted(true);
            }} />
          ) : gameStarted ? (
            <span className="text-white text-6xl">{note}</span>
          ) : (
            <NewGameScreen onGameStart={() => setGameStarted(true)} />
          )}
        </div>
        <div className="mt-auto flex flex-col gap-4">
          {gameStarted && (
            <>
              <div className="flex items-center justify-between">
                <HealthBar maxHealth={MAX_HEALTH} health={lives} />
                <span className="text-blue-100 font-bold uppercase">{`SCORE: ${score}`}</span>
              </div>
              <TimerBar maxTime={maxTime} time={timeLeft} className="w-full" />
            </>
          )}
          <PianoBoard onTilesChange={handleTilesChange} />
        </div>
      </div>
    </div>
  );
}


export default App;