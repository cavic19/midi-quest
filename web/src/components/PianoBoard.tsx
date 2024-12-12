import classNames from "classnames";
import useMidiPiano from "../hooks/useMidiPiano";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { Note } from "../models/Note";
import HasClassname from "../types/HasClassname";
import HasStyle from "../types/HasStyle";
import useWindowDimensions from "../hooks/useWindowDimensions";
import { floorToOdd } from "../utils/math";

const WHITE_TILE_WIDTH = 100;
const WHITE_TILE_HEIGHT = 400;
const BLACK_TILE_WIDTH = 50;
const BLACK_TIME_HEIGHT = 200;
const TILE_GAP = 16;
const OCTAVE_WIDTH = 7 * WHITE_TILE_WIDTH + 6 * TILE_GAP

export type PressedTilesChangeEvent = "PRESSED" | "RELEASED"

type PianoBoardProps = {
    onTilesChange?: (notes: Note[], event: PressedTilesChangeEvent) => void
    // Component display right above the active area of the piano
    hud?: ReactNode
} & HasClassname

type PressedTilesState = {
    notes: Note[], 
    event: PressedTilesChangeEvent
}

function PianoBoard({ hud, onTilesChange, className }: PianoBoardProps) {
    const [pressedTilesState, setPressedTilesState] = useState<PressedTilesState>({ notes: [], event: "RELEASED" });

    useEffect(() => {
        onTilesChange?.(pressedTilesState.notes, pressedTilesState.event)
    }, [pressedTilesState]);


    const handleNoteOn = useCallback((note: Note) => {
        setPressedTilesState(({ notes }) => ({
            notes: [...notes, note],
            event: "PRESSED"
        }));
    }, []);

    const handleNoteOff = useCallback((note: Note) => {
        setPressedTilesState(({ notes }) => ({
            notes:  notes.filter(oldNote => oldNote !== note),
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
                        <BlackTile pressed={pressedTilesState.notes.includes(Note.C_SHARP)} active={i + 1 == activeOctaceRange} style={{ left: blackTilePosition(i * 7 + 1) }} />
                        <BlackTile pressed={pressedTilesState.notes.includes(Note.D_SHARP)} active={i + 1 == activeOctaceRange} style={{ left: blackTilePosition(i * 7 + 2) }} />
                        <BlackTile pressed={pressedTilesState.notes.includes(Note.F_SHARP)} active={i + 1 == activeOctaceRange} style={{ left: blackTilePosition(i * 7 + 4) }} />
                        <BlackTile pressed={pressedTilesState.notes.includes(Note.G_SHARP)} active={i + 1 == activeOctaceRange} style={{ left: blackTilePosition(i * 7 + 5) }} />
                        <BlackTile pressed={pressedTilesState.notes.includes(Note.A_SHARP)} active={i + 1 == activeOctaceRange} style={{ left: blackTilePosition(i * 7 + 6) }} />

                        <WhiteTile pressed={pressedTilesState.notes.includes(Note.C)} active={i + 1 == activeOctaceRange} />
                        <WhiteTile pressed={pressedTilesState.notes.includes(Note.D)} active={i + 1 == activeOctaceRange} />
                        <WhiteTile pressed={pressedTilesState.notes.includes(Note.E)} active={i + 1 == activeOctaceRange} />
                        <WhiteTile pressed={pressedTilesState.notes.includes(Note.F)} active={i + 1 == activeOctaceRange} />
                        <WhiteTile pressed={pressedTilesState.notes.includes(Note.G)} active={i + 1 == activeOctaceRange} />
                        <WhiteTile pressed={pressedTilesState.notes.includes(Note.A)} active={i + 1 == activeOctaceRange} />
                        <WhiteTile pressed={pressedTilesState.notes.includes(Note.B)} active={i + 1 == activeOctaceRange} />
                    </>
                ))}
            </div>
        </div>
    )
}

type TileProps = {
    active?: boolean
    pressed?: boolean
} & HasStyle

function WhiteTile({ active, pressed, style }: TileProps) {
    if (active) {
        return (
            <div className={classNames("rounded-xl", { "bg-my-blue-100": pressed, "bg-white": !pressed })} style={{ ...style, width: WHITE_TILE_WIDTH, height: WHITE_TILE_HEIGHT }} />
        )
    } else {
        return (
            <div className={"rounded-xl bg-moonstone-300"} style={{ ...style, width: WHITE_TILE_WIDTH, height: WHITE_TILE_HEIGHT }} />
        )
    }
}

function BlackTile({ active, pressed, style }: TileProps) {
    if (active) {
        return (
            <div className={classNames("bg-black rounded-xl absolute -top-2 drop-shadow-md", { "bg-my-blue-400": pressed })} style={{ ...style, width: BLACK_TILE_WIDTH, height: BLACK_TIME_HEIGHT }} />
        )
    } else {
        return (
            <div className={"rounded-xl absolute -top-2 drop-shadow-md bg-moonstone-600"} style={{ ...style, width: BLACK_TILE_WIDTH, height: BLACK_TIME_HEIGHT }} />
        )
    }
}

function blackTilePosition(i: number): number {
    return i * WHITE_TILE_WIDTH + TILE_GAP * (i - 2)
}

export default PianoBoard;