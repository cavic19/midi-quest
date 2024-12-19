import { useCallback, useMemo } from "react";
import GameConfiguration, { GameMode } from "../models/GameConfiguration";
import { arrayOfNotNull } from "../utils/array";
import ChordDefinition from "../models/ChordDefinition";

const CHORD_DEFINITIONS_KEY = "gameConfiguration.chordDefinitions";
const GAME_MODE_KEY = "gameConfiguration.gameMode";
const MUTE_PIANO_KEY = "gameConfiguration.mutePiano";

function useLocaStorageGameConfiguration(): [GameConfiguration | undefined, (newConfig: GameConfiguration | undefined) => void] {
    const chordDefinitionsKeys = localStorage.getItem(CHORD_DEFINITIONS_KEY);
    const gameMode = localStorage.getItem(GAME_MODE_KEY);
    const mutePiano = localStorage.getItem(MUTE_PIANO_KEY);

    const gameConfiguration = useMemo(() => {
        if (chordDefinitionsKeys !== null && gameMode !== null && mutePiano !== null) {
            const chordDefinitions = arrayOfNotNull((JSON.parse(chordDefinitionsKeys) as string[]).map(key => ChordDefinition.list.find(def => def.key === key)));
            return new GameConfiguration(
                chordDefinitions.length !== 0 ? chordDefinitions : GameConfiguration.DEFAULT.chordDefinitions,
                gameMode === "CHORDS" || gameMode === "NOTES" ? gameMode as GameMode : GameConfiguration.DEFAULT.mode,
                //Always return true. There is a problem with web audio starting playing on midi input
                // Before I fix it ist better to force it always to be true. User cna however switch it to false, as it is registered as user input
                // and web audio starts working
                true //mutePiano == "true"
            )
        }
    }, [chordDefinitionsKeys, gameMode])

    const setter = useCallback((newConfig: GameConfiguration | undefined) => {
        if (newConfig === undefined) {
            localStorage.removeItem(CHORD_DEFINITIONS_KEY);
            localStorage.removeItem(GAME_MODE_KEY);
            localStorage.removeItem(MUTE_PIANO_KEY);
        } else {
            localStorage.setItem(CHORD_DEFINITIONS_KEY, JSON.stringify(newConfig.chordDefinitions.map(it => it.key)));
            localStorage.setItem(GAME_MODE_KEY, newConfig.mode);
            localStorage.setItem(MUTE_PIANO_KEY, newConfig.mutePiano ? "true" : "false");
        }
    }, [])

    return [gameConfiguration, setter]
}

export default useLocaStorageGameConfiguration;