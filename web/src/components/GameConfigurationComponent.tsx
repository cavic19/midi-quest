import { ReactComponent as ThreeNotes } from '../assets/ThreeNotes.svg';
import { ReactComponent as SingleNote } from '../assets/SingleNote.svg';
import GameConfiguration, { GameMode } from '../models/GameConfiguration';
import { ReactNode, useCallback, useState } from 'react';
import classNames from 'classnames';
import useGameConfiguration from '../hooks/useGameConfiguration';
import { GearSix, SpeakerHigh, SpeakerSlash } from '@phosphor-icons/react/dist/ssr';
import ChordsSettings from './ChordsSettings';
import ChordDefinition from '../models/ChordDefinition';
import IconButton from './IconButton';


function GameConfigurationComponent() {
    const [configuration, setConfiguration] = useGameConfiguration();
    const { mode, chordDefinitions, mutePiano } = configuration!;
    const [showChordsSettings, setShowChordsSettings] = useState(false);

    // TODO: We should be able to use setter here from the useState or useStore!
    const handleModeChange = useCallback((newMode: GameMode) => {
        // TODO: Use the setter mthod fo the store so we dont' need to dpeend on all the other configs
        setConfiguration(new GameConfiguration(chordDefinitions, newMode, mutePiano))
    }, [chordDefinitions, mutePiano]);

    const handleChordDefinitionsChange = useCallback((newDefinitions: ChordDefinition[]) => {
        // TODO: Use the setter mthod fo the store so we dont' need to dpeend on all the other configs
        setConfiguration(new GameConfiguration(newDefinitions, mode, mutePiano))
    }, [mode, mutePiano]);

    const handleMutePianoChange = useCallback(() => {
        setConfiguration(new GameConfiguration(chordDefinitions, mode, !mutePiano))
    }, [mode, chordDefinitions, mutePiano]);

    return (
        <div className='flex flex-col gap-2 items-center'>
            <div className='flex items-center gap-2'>
                <div className="flex items-center gap-8 rounded-3xl p-1 border border-my-cyan-600" >
                    <GameModeComp name={"Notes"} svgNode={< SingleNote />} selected={mode === "NOTES"} onClick={() => handleModeChange("NOTES")} />
                    <GameModeComp name={"Chords"} svgNode={< ThreeNotes />} selected={mode === "CHORDS"} onClick={() => handleModeChange("CHORDS")} />
                </div>
                <IconButton
                    icon={(active) => active ? <SpeakerHigh size={24} /> : <SpeakerSlash size={24} />}
                    onClick={handleMutePianoChange}
                    active={!mutePiano}
                />
                <IconButton
                    icon={() => <GearSix size={24}/>}
                    onClick={() => setShowChordsSettings(old => !old)}
                    active={showChordsSettings}
                />
            </div>
            {showChordsSettings && <ChordsSettings enabledChordDefinitions={chordDefinitions} onEnabledChordDefinitionsChange={handleChordDefinitionsChange} />}
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