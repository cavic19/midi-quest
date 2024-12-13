import { useCallback, useEffect, useMemo } from "react";
import { create } from "zustand";
import GameConfiguration from "../models/GameConfiguration";
import useLocaStorageGameConfiguration from "./useLocalStorageGameConfiguration";

function useGameConfiguration(onConfigChange?: (newConfig: GameConfiguration) => void): [GameConfiguration, (newConfig: GameConfiguration) => void] {
    /*
    1. If the configurtaiton in store is undefined use local storage one
    2. If local storage one is undefined use default one 
    3. Otherwise use always store

    On store update update also local storage
    */
    
    const { configuration: storedConfiguration, setConfiguration: setStoredConfiguration } = useGameConfigurationStore();
    const [localStorageGameConfiguration, setLocalStorageGameConfiguration] = useLocaStorageGameConfiguration()
    const configuration = useMemo(() => storedConfiguration ?? localStorageGameConfiguration ?? GameConfiguration.DEFAULT, [storedConfiguration, localStorageGameConfiguration]);

    useEffect(() => {
        onConfigChange?.(configuration)
    }, [configuration])

    const setConfiguration = useCallback((newConfig: GameConfiguration) => {
        setLocalStorageGameConfiguration(newConfig);
        setStoredConfiguration(newConfig)
    }, [setStoredConfiguration, setLocalStorageGameConfiguration])
    
    return [configuration, setConfiguration]
}


type GameConfigurationStoreState = {
    configuration?: GameConfiguration
    setConfiguration: (newConfiguration: GameConfiguration) => void
}

const useGameConfigurationStore = create<GameConfigurationStoreState>(set => ({
    setConfiguration: (newConfig) => set(() => ({configuration: newConfig}))
}))


export default useGameConfiguration;