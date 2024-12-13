import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Note } from "./models/Note";
import HealthBar from "./components/HealthBar";
import useTimer from "./hooks/useTimer";
import TimerBar from "./components/TimeBar";
import PianoBoard, { PressedTilesChangeEvent } from "./components/PianoBoard";
import NewGameScreen from "./components/NewGameScreen";
import GameOverScreen from "./components/GameOverScreen";
import generateTime from "./generateTime";
import KeyboardShapeGenerator from "./models/KeyboardShapeGenerator";
import KeyboardShape from "./models/KeyboardShape";
import NoteGenerator from "./models/NoteGenerator";
import classNames from "classnames";
import GameConfiguration from "./models/GameConfiguration";
import useGameConfiguration from "./hooks/useGameConfiguration";
import ChordDefinition from "./models/ChordDefinition";


// Should be lower than human reaction time < 150ms
const SCORE_FLASH_DURATION = 100

function App() {
  const shapeGeneratorRef = useRef<KeyboardShapeGenerator>(new NoteGenerator());
  const [lives, setLives] = useState(GameConfiguration.MAX_HEALTH);
  const [score, setScore] = useState(0);
  const [shape, setShape] = useState<KeyboardShape>(() => shapeGeneratorRef.current.next());
  const noteNotation = useMemo(() => shape.name(), [shape]);
  // Max time that user has to correctly guess the shape given the current level (score)
  const currentMaxTime = generateTime(score);
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [iseGameOver, setIsGameOver] = useState(false);
  const { timeLeft, restart: restartTimer, stop: stopTimer } = useTimer(currentMaxTime);
  // Used to control flash status of the score.
  const [flashSuccess, setFlashSuccess] = useState(false);
  const [flashFailure, setFlashFailure] = useState(false);

  useGameConfiguration((config) => {
    shapeGeneratorRef.current = config.shapeGenerator();
    // We need to drop the old shape
    setShape(shapeGeneratorRef.current.next());
  });

  useEffect(() => {
    if (isGameRunning) {
      setScore(0);
      restartTimer();
    } else {
      stopTimer();
    }
  }, [isGameRunning])

  useEffect(() => {
    if (timeLeft == 0) {
      setFlashFailure(true);
      // We have to set timeout otherwise, the next shape would get colored
      setTimeout(() => {
        setFlashFailure(false)
        restartTimer();
        setLives(ls => ls - 1);
        setShape(shapeGeneratorRef.current.next())
      }, SCORE_FLASH_DURATION)
    }
  }, [timeLeft]);

  useEffect(() => {
    if (lives <= 0) {
      setIsGameOver(true);
      setIsGameRunning(false);
    }
  }, [lives]);


  const handleTilesChange = useCallback((tiles: Note[], event: PressedTilesChangeEvent) => {
    if (isGameRunning && event === "PRESSED") {
      if (!shape.includesNotes(tiles)) {
        // Player pressed extra notes => fail
        setFlashFailure(true);
        setTimeout(() => {
          setFlashFailure(false)
          setLives(lives => lives - 1)
        }, SCORE_FLASH_DURATION)

      } else if (shape.equalTo(tiles)) {
        setFlashSuccess(true);
        setTimeout(() => {
          setFlashSuccess(false);
          setShape(shapeGeneratorRef.current.next());
          setScore(sc => sc + 1);
          restartTimer();
        }, SCORE_FLASH_DURATION)
      } else {
        // This means that user pressed onlu some of the notes making up the shape
        // E.g. C - E but hasn't pressed yet G to create C major chord, so he still has a chance
      }
    }

  }, [shape, isGameRunning]);

  return (
    <div className='w-screen h-screen bg-gradient-to-b from-midnight-green to-my-cyan-600'>
      <div className="h-screen flex flex-col w-fit maxx-w-[1200px] mx-auto">
        <div className="w-full h-full flex items-center justify-center">
          {iseGameOver ? (
            <GameOverScreen finalScore={score} onPlayAgain={() => {
              setIsGameOver(false);
              setLives(GameConfiguration.MAX_HEALTH);
              setScore(0);
              setIsGameRunning(true);
            }} />
          ) : isGameRunning ? (
            <span className={classNames("text-6xl", { "text-[#FF3737]": flashFailure, "text-[#6EF2B0]": flashSuccess, "text-white": !flashSuccess && !flashFailure })}>{noteNotation}</span>
          ) : (
            <NewGameScreen onGameStart={() => setIsGameRunning(true)} />
          )}
        </div>
        <PianoBoard hud={
          isGameRunning && (
            <div className="mb-4 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <HealthBar maxHealth={GameConfiguration.MAX_HEALTH} health={lives} />
                <span className="text-blue-100 font-bold uppercase text-lg">{`SCORE: ${score}`}</span>
              </div>
              <TimerBar maxTime={currentMaxTime} time={timeLeft} className="w-full" />
            </div>
          )
        } onTilesChange={handleTilesChange} />
      </div>
    </div>
  );
}

export default App;