import { useCallback } from "react";
import ChordDefinition from "../models/ChordDefinition";
import { Note } from "../models/Note";
import HasClassname from "../types/HasClassname";
import classNames from "classnames";

type ChordsSettingsProps = {
    enabledChordDefinitions?: ChordDefinition[]
    onEnabledChordDefinitionsChange?: (newDefs: ChordDefinition[]) => void
} & HasClassname

function ChordsSettings({ className, enabledChordDefinitions = [], onEnabledChordDefinitionsChange }: ChordsSettingsProps) {
    const midPoint = Math.ceil(ChordDefinition.list.length / 2);

    const handleSelectionChange = useCallback((chordDefinition: ChordDefinition, selected: boolean) => {
        onEnabledChordDefinitionsChange?.(
            selected ? Array.from(new Set([...enabledChordDefinitions, chordDefinition])) : enabledChordDefinitions.filter(it => it.key !== chordDefinition.key)
        )
    }, [enabledChordDefinitions, onEnabledChordDefinitionsChange])

    return (
        <div className={classNames("text-white flex gap-6 p-2 rounded-xl border border-my-cyan-600", className)}>
            <div className="flex flex-col">
                {ChordDefinition.list.filter((_, i) => i < midPoint).map(definition => (
                    <ChordOption
                        chordDefinition={definition}
                        key={definition.key}
                        selected={enabledChordDefinitions.some(def => def.key == definition.key)}
                        onSelectionChange={(selected) => handleSelectionChange(definition, selected)}
                    />
                ))}
            </div>
            <div className="flex flex-col">
                {ChordDefinition.list.filter((_, i) => i >= midPoint).map(definition => (
                    <ChordOption
                        chordDefinition={definition}
                        key={definition.key}
                        selected={enabledChordDefinitions.some(def => def.key == definition.key)}
                        onSelectionChange={(selected) => handleSelectionChange(definition, selected)}
                    />
                ))}
            </div>
        </div>
    )
}

type ChordOptionProps = {
    selected: boolean
    onSelectionChange?: (selected: boolean) => void
    chordDefinition: ChordDefinition
}

function ChordOption({ chordDefinition, selected, onSelectionChange }: ChordOptionProps) {
    return (
        <div className="flex items-center gap-1">
            <input onChange={e => onSelectionChange?.(e.target.checked)} checked={selected} id={chordDefinition.key} type="checkbox" className="bg-my-cyan-600" />
            <label htmlFor={chordDefinition.key}>{`${chordDefinition.displayName} (${chordDefinition.createChord(Note.C).name()})`}</label>
        </div>
    );
}




export default ChordsSettings;