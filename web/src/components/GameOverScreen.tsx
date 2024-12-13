import { ArrowCounterClockwise } from "@phosphor-icons/react";
import GameConfigurationComponent from "./GameConfigurationComponent";


type GameOverScreenProps = {
    finalScore: number
    onPlayAgain: () => void
  }
  
  function GameOverScreen({ finalScore, onPlayAgain }: GameOverScreenProps) {
    return (
      <div className="flex flex-col items-center gap-8">
        <div className="flex flex-col gap-1 items-center">
          <span className="text-5xl text-white">Game Over</span>
          <span className="text-3xl text-my-blue-100">{`Score ${finalScore}`}</span>
        </div>
        <GameConfigurationComponent />
        <div className="flex flex-col items-center hover:cursor-pointer" onClick={onPlayAgain}>
          <ArrowCounterClockwise size={32} weight="fill" className="text-white" />
          <span className="font-semibold text-white text-xl">Start Over</span>
        </div>
      </div>
    );
  }
  

  export default GameOverScreen;