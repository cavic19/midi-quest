import { Play } from "@phosphor-icons/react";
import GameConfigurationComponent from "./GameConfigurationComponent";

type NewGameScreenProps = {
    onGameStart: () => void
}

function NewGameScreen({ onGameStart }: NewGameScreenProps) {
    return (
        <div className="flex flex-col items-center gap-6">
            <div className="flex flex-col gap-4 items-center">
                <span className="text-5xl text-white">MIDI Quest</span>
                <GameConfigurationComponent />
            </div>
            <div>
                <div className="flex gap-2 items-center hover:cursor-pointer" onClick={onGameStart}>
                    <Play size={32} className="text-white" />
                    <span className="font-semibold text-white text-xl">New Game</span>
                </div>

            </div>
        </div>
    );
}

export default NewGameScreen;