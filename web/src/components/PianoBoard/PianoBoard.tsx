import classNames from "classnames";
import useMidiPiano from "../../hooks/useMidiPiano";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { Note } from "../../models/Note";
import HasClassname from "../../types/HasClassname";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import { floorToOdd } from "../../utils/math";
import piano from "../../utils/Piano";
import { BlackTile, TILE_GAP, WHITE_TILE_WIDTH, WhiteTile } from "./Tile";


const OCTAVE_WIDTH = 7 * WHITE_TILE_WIDTH + 6 * TILE_GAP

export type PressedTilesChangeEvent = "PRESSED" | "RELEASED"

type PianoBoardProps = {
    onTilesChange?: (notes: Note[], event: PressedTilesChangeEvent) => void
    // Component display right above the active area of the piano
    hud?: ReactNode
    mute?: boolean
} & HasClassname

type PressedTilesState = {
    notes: Note[],
    event: PressedTilesChangeEvent
}

function PianoBoard({ hud, onTilesChange, className, mute = false }: PianoBoardProps) {
    const [pressedTilesState, setPressedTilesState] = useState<PressedTilesState>({ notes: [], event: "RELEASED" });

    useEffect(() => {
        onTilesChange?.(pressedTilesState.notes, pressedTilesState.event)
    }, [pressedTilesState]);


    const handleNoteOn = useCallback((note: Note) => {
        if (!mute) {
            piano.play(note);
        }
        setPressedTilesState(({ notes }) => ({
            notes: [...notes, note],
            event: "PRESSED"
        }));
    }, [mute]);

    const handleNoteOff = useCallback((note: Note) => {
        setPressedTilesState(({ notes }) => ({
            notes: notes.filter(oldNote => oldNote !== note),
            event: "RELEASED"
        }))
    }, []);

    // We want to display dummy octaves on the siedes, when the screen is too wide
    const { width: windowWitdh } = useWindowDimensions();
    const displOctaves = useMemo(() => {
        return Math.max(floorToOdd(windowWitdh / OCTAVE_WIDTH), 1);
    }, [windowWitdh]);
    // If we have 3 octaves then the first one and the last one is dummy and the middle one is the active one
    const activeOctaceRange = Math.ceil(displOctaves / 2);

    useMidiPiano(
        handleNoteOn,
        handleNoteOff,
    );

    return (
        <div className={classNames("relative", className)}>
            {hud && (
                <div className="absolute -translate-y-full" style={{
                    left: (activeOctaceRange - 1) * (OCTAVE_WIDTH + TILE_GAP),
                    width: OCTAVE_WIDTH,
                }}>
                    {hud}
                </div>
            )}
            <div className="flex relative w-fit h-fit" style={{ gap: TILE_GAP }}>
                {new Array(displOctaves).fill(null).map((_, i) => (
                    <>
                        <BlackTile keys={["W"]} onTilePress={() => handleNoteOn(Note.C_SHARP)} onTileRelease={() => handleNoteOff(Note.C_SHARP)} pressed={pressedTilesState.notes.includes(Note.C_SHARP)} active={i + 1 == activeOctaceRange} style={{ left: blackTilePosition(i * 7 + 1) }} />
                        <BlackTile keys={["E"]} onTilePress={() => handleNoteOn(Note.D_SHARP)} onTileRelease={() => handleNoteOff(Note.D_SHARP)} pressed={pressedTilesState.notes.includes(Note.D_SHARP)} active={i + 1 == activeOctaceRange} style={{ left: blackTilePosition(i * 7 + 2) }} />
                        <BlackTile keys={["T"]} onTilePress={() => handleNoteOn(Note.F_SHARP)} onTileRelease={() => handleNoteOff(Note.F_SHARP)} pressed={pressedTilesState.notes.includes(Note.F_SHARP)} active={i + 1 == activeOctaceRange} style={{ left: blackTilePosition(i * 7 + 4) }} />
                        <BlackTile keys={["Y"]} onTilePress={() => handleNoteOn(Note.G_SHARP)} onTileRelease={() => handleNoteOff(Note.G_SHARP)} pressed={pressedTilesState.notes.includes(Note.G_SHARP)} active={i + 1 == activeOctaceRange} style={{ left: blackTilePosition(i * 7 + 5) }} />
                        <BlackTile keys={["U"]} onTilePress={() => handleNoteOn(Note.A_SHARP)} onTileRelease={() => handleNoteOff(Note.A_SHARP)} pressed={pressedTilesState.notes.includes(Note.A_SHARP)} active={i + 1 == activeOctaceRange} style={{ left: blackTilePosition(i * 7 + 6) }} />

                        <WhiteTile keys={["A"]} onTilePress={() => handleNoteOn(Note.C)} onTileRelease={() => handleNoteOff(Note.C)} pressed={pressedTilesState.notes.includes(Note.C)} active={i + 1 == activeOctaceRange} />
                        <WhiteTile keys={["S"]} onTilePress={() => handleNoteOn(Note.D)} onTileRelease={() => handleNoteOff(Note.D)} pressed={pressedTilesState.notes.includes(Note.D)} active={i + 1 == activeOctaceRange} />
                        <WhiteTile keys={["D"]} onTilePress={() => handleNoteOn(Note.E)} onTileRelease={() => handleNoteOff(Note.E)} pressed={pressedTilesState.notes.includes(Note.E)} active={i + 1 == activeOctaceRange} />
                        <WhiteTile keys={["F"]} onTilePress={() => handleNoteOn(Note.F)} onTileRelease={() => handleNoteOff(Note.F)} pressed={pressedTilesState.notes.includes(Note.F)} active={i + 1 == activeOctaceRange} />
                        <WhiteTile keys={["G"]} onTilePress={() => handleNoteOn(Note.G)} onTileRelease={() => handleNoteOff(Note.G)} pressed={pressedTilesState.notes.includes(Note.G)} active={i + 1 == activeOctaceRange} />
                        <WhiteTile keys={["H"]} onTilePress={() => handleNoteOn(Note.A)} onTileRelease={() => handleNoteOff(Note.A)} pressed={pressedTilesState.notes.includes(Note.A)} active={i + 1 == activeOctaceRange} />
                        <WhiteTile keys={["J"]} onTilePress={() => handleNoteOn(Note.B)} onTileRelease={() => handleNoteOff(Note.B)} pressed={pressedTilesState.notes.includes(Note.B)} active={i + 1 == activeOctaceRange} />
                    </>
                ))}
            </div>
        </div>
    )
}



function blackTilePosition(i: number): number {
    return i * WHITE_TILE_WIDTH + TILE_GAP * (i - 2)
}

export default PianoBoard;