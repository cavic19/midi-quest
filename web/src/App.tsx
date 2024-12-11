import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Note } from "./models/Note";
import { MAX_HEALTH } from "./config";
import HealthBar from "./components/HealthBar";
import useTimer from "./hooks/useTimer";
import TimerBar from "./components/TimeBar";
import PianoBoard from "./components/PianoBoard";
import NewGameScreen from "./components/NewGameScreen";
import GameOverScreen from "./components/GameOverScreen";
import generateTime from "./generateTime";
import NoteGenerator from "./models/NoteGenerator";


function App() {
  const { current: noteGenerator } = useRef(new NoteGenerator());
  const [lives, setLives] = useState(MAX_HEALTH);
  const [score, setScore] = useState(0);
  const [note, setNote] = useState(() => noteGenerator.next());
  const noteNotation = useMemo(() => note.randomNotation(), [note]);
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
      setNote(noteGenerator.next())
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
        setNote(noteGenerator.next());
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
      <div className="h-screen flex flex-col w-fit maxx-w-[1200px] mx-auto">
        <div className="w-full h-full flex items-center justify-center">
          {iseGameOver ? (
            <GameOverScreen finalScore={score} onPlayAgain={() => {
              setIsGameOver(false);
              setLives(MAX_HEALTH);
              setScore(0);
              setGameStarted(true);
            }} />
          ) : gameStarted ? (
            <span className="text-white text-6xl">{noteNotation}</span>
          ) : (
            <NewGameScreen onGameStart={() => setGameStarted(true)} />
          )}
        </div>
        <PianoBoard hud={
            gameStarted && (
              <div className="mb-4 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <HealthBar maxHealth={MAX_HEALTH} health={lives} />
                  <span className="text-blue-100 font-bold uppercase text-lg">{`SCORE: ${score}`}</span>
                </div>
                <TimerBar maxTime={maxTime} time={timeLeft} className="w-full" />
              </div>
            )
          } onTilesChange={handleTilesChange} />
      </div>
    </div>
  );
}

export default App;