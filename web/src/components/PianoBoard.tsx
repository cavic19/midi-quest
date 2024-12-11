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

type PianoBoardProps = {
    onTilesChange?: (notes: Note[]) => void
    // Component display right above the active area of the piano
    hud?: ReactNode
} & HasClassname

function PianoBoard({ hud, onTilesChange, className }: PianoBoardProps) {
    const [pressedTiles, setPressedTiles] = useState<Note[]>([]);
    
    useEffect(() => {
        onTilesChange?.(pressedTiles)
    }, [pressedTiles]);


    const handleNoteOn = useCallback((note: Note) => {
        setPressedTiles(oldTiles => [...oldTiles, note])
    }, []);

    const handleNoteOff = useCallback((note: Note) => {
        setPressedTiles(oldTiles => oldTiles.filter(oldNote => oldNote !== note))
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
                        <BlackTile pressed={pressedTiles.includes("C#")} active={i + 1 == activeOctaceRange} style={{ left: blackTilePosition(i * 7 + 1) }} />
                        <BlackTile pressed={pressedTiles.includes("D#")} active={i + 1 == activeOctaceRange} style={{ left: blackTilePosition(i * 7 + 2) }} />
                        <BlackTile pressed={pressedTiles.includes("F#")} active={i + 1 == activeOctaceRange} style={{ left: blackTilePosition(i * 7 + 4) }} />
                        <BlackTile pressed={pressedTiles.includes("G#")} active={i + 1 == activeOctaceRange} style={{ left: blackTilePosition(i * 7 + 5) }} />
                        <BlackTile pressed={pressedTiles.includes("A#")} active={i + 1 == activeOctaceRange} style={{ left: blackTilePosition(i * 7 + 6) }} />

                        <WhiteTile pressed={pressedTiles.includes("C")} active={i + 1 == activeOctaceRange} />
                        <WhiteTile pressed={pressedTiles.includes("D")} active={i + 1 == activeOctaceRange} />
                        <WhiteTile pressed={pressedTiles.includes("E")} active={i + 1 == activeOctaceRange} />
                        <WhiteTile pressed={pressedTiles.includes("F")} active={i + 1 == activeOctaceRange} />
                        <WhiteTile pressed={pressedTiles.includes("G")} active={i + 1 == activeOctaceRange} />
                        <WhiteTile pressed={pressedTiles.includes("A")} active={i + 1 == activeOctaceRange} />
                        <WhiteTile pressed={pressedTiles.includes("B")} active={i + 1 == activeOctaceRange} />
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