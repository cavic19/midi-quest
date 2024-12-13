import { ReactComponent as ThreeNotes } from '../assets/ThreeNotes.svg';
import { ReactComponent as SingleNote } from '../assets/SingleNote.svg';
import GameConfiguration, { GameMode } from '../models/GameConfiguration';
import { ReactNode, useCallback } from 'react';
import classNames from 'classnames';
import useGameConfiguration from '../hooks/useGameConfiguration';


function GameConfigurationComponent() {
    const [configuration, setConfiguration] = useGameConfiguration();
    const { mode, chordDefinitions } = configuration!;

    const handleModeChange = useCallback((newMode: GameMode) => {
        setConfiguration(new GameConfiguration(chordDefinitions, newMode))
    }, [chordDefinitions]);

    return (
        <div className="flex items-center gap-8 rounded-3xl p-1 border border-my-cyan-600" >
            <GameModeComp name={"Notes"} svgNode={< SingleNote />} selected={mode === "NOTES"} onClick={() => handleModeChange("NOTES")} />
            <GameModeComp name={"Chords"} svgNode={< ThreeNotes />} selected={mode === "CHORDS"} onClick={() => handleModeChange("CHORDS")} />
        </div>
    );
}

type GameModeCompProps = {
    name: string,
    svgNode: ReactNode
    selected: boolean
    onClick?: () => void
}

function GameModeComp({ name, svgNode, selected, onClick }: GameModeCompProps) {
    return (
        <div onClick={onClick} className={classNames("flex items-center gap-1 py-2 px-4 rounded-3xl", { "[&_*]:fill-white text-white bg-my-cyan-600": selected, "[&_*]:fill-my-blue-100 text-my-blue-100 hover:cursor-pointer": !selected })
        }>
            {svgNode}
            < span > {name} </span>
        </div>
    );
}

export default GameConfigurationComponent;