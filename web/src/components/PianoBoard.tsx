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
                        <BlackTile onTilePress={() => handleNoteOn(Note.C_SHARP)} onTileRelease={() => handleNoteOff(Note.C_SHARP)} pressed={pressedTilesState.notes.includes(Note.C_SHARP)} active={i + 1 == activeOctaceRange} style={{ left: blackTilePosition(i * 7 + 1) }} />
                        <BlackTile onTilePress={() => handleNoteOn(Note.D_SHARP)} onTileRelease={() => handleNoteOff(Note.D_SHARP)} pressed={pressedTilesState.notes.includes(Note.D_SHARP)} active={i + 1 == activeOctaceRange} style={{ left: blackTilePosition(i * 7 + 2) }} />
                        <BlackTile onTilePress={() => handleNoteOn(Note.F_SHARP)} onTileRelease={() => handleNoteOff(Note.F_SHARP)} pressed={pressedTilesState.notes.includes(Note.F_SHARP)} active={i + 1 == activeOctaceRange} style={{ left: blackTilePosition(i * 7 + 4) }} />
                        <BlackTile onTilePress={() => handleNoteOn(Note.G_SHARP)} onTileRelease={() => handleNoteOff(Note.G_SHARP)} pressed={pressedTilesState.notes.includes(Note.G_SHARP)} active={i + 1 == activeOctaceRange} style={{ left: blackTilePosition(i * 7 + 5) }} />
                        <BlackTile onTilePress={() => handleNoteOn(Note.A_SHARP)} onTileRelease={() => handleNoteOff(Note.A_SHARP)} pressed={pressedTilesState.notes.includes(Note.A_SHARP)} active={i + 1 == activeOctaceRange} style={{ left: blackTilePosition(i * 7 + 6) }} />

                        <WhiteTile onTilePress={() => handleNoteOn(Note.C)} onTileRelease={() => handleNoteOff(Note.C)} pressed={pressedTilesState.notes.includes(Note.C)} active={i + 1 == activeOctaceRange} />
                        <WhiteTile onTilePress={() => handleNoteOn(Note.D)} onTileRelease={() => handleNoteOff(Note.D)} pressed={pressedTilesState.notes.includes(Note.D)} active={i + 1 == activeOctaceRange} />
                        <WhiteTile onTilePress={() => handleNoteOn(Note.E)} onTileRelease={() => handleNoteOff(Note.E)} pressed={pressedTilesState.notes.includes(Note.E)} active={i + 1 == activeOctaceRange} />
                        <WhiteTile onTilePress={() => handleNoteOn(Note.F)} onTileRelease={() => handleNoteOff(Note.F)} pressed={pressedTilesState.notes.includes(Note.F)} active={i + 1 == activeOctaceRange} />
                        <WhiteTile onTilePress={() => handleNoteOn(Note.G)} onTileRelease={() => handleNoteOff(Note.G)} pressed={pressedTilesState.notes.includes(Note.G)} active={i + 1 == activeOctaceRange} />
                        <WhiteTile onTilePress={() => handleNoteOn(Note.A)} onTileRelease={() => handleNoteOff(Note.A)} pressed={pressedTilesState.notes.includes(Note.A)} active={i + 1 == activeOctaceRange} />
                        <WhiteTile onTilePress={() => handleNoteOn(Note.B)} onTileRelease={() => handleNoteOff(Note.B)} pressed={pressedTilesState.notes.includes(Note.B)} active={i + 1 == activeOctaceRange} />
                    </>
                ))}
            </div>
        </div>
    )
}

type TileProps = {
    active?: boolean
    pressed?: boolean
    onTilePress?: () => void
    onTileRelease?: () => void
} & HasStyle & HasClassname

function WhiteTile(props: TileProps) {
    if (props.active) {
        return (
            <Tile
                {...props}
                className={classNames("rounded-xl", { "bg-my-blue-100": props.pressed, "bg-white": !props.pressed })}
                style={{ ...props.style, width: WHITE_TILE_WIDTH, height: WHITE_TILE_HEIGHT }}
            />
        )
    } else {
        return (
            <Tile
                {...props}
                className={"rounded-xl bg-moonstone-300"} 
                style={{ ...props.style, width: WHITE_TILE_WIDTH, height: WHITE_TILE_HEIGHT }}
            />
        )
    }
}

function BlackTile(props: TileProps) {
    if (props.active) {
        return (
            <Tile
                {...props}
                style={{ ...props.style, width: BLACK_TILE_WIDTH, height: BLACK_TIME_HEIGHT }}
                className={classNames("bg-black absolute -top-2 drop-shadow-md", { "bg-my-blue-400": props.pressed })}
            />
        )
    } else {
        return (
            <Tile
                {...props}
                className={"rounded-xl absolute -top-2 drop-shadow-md bg-moonstone-600"}
                 style={{ ...props.style, width: BLACK_TILE_WIDTH, height: BLACK_TIME_HEIGHT }}
            />
        )
    }
}


function Tile(props: TileProps) {
    const [tileDown, setTileDown] = useState(false);
    return (
        <div
            className={classNames("rounded-xl", props.className)}
            style={props.style}
            onMouseDown={() => {
                if (props.active) {
                    setTileDown(true);
                    props.onTilePress?.();
                }
            }}
            onMouseUp={() => {
                if (props.active) {
                    setTileDown(false);
                    props.onTileRelease?.();
                }
            }}
            onMouseLeave={() => {
                if (props.active && tileDown) {
                    setTileDown(false);
                    props.onTileRelease?.();
                }
            }}
            onMouseEnter={e => {
                // If primary (left) button down
                if (props.active && e.buttons === 1 && !tileDown) {
                    setTileDown(true);
                    props.onTilePress?.();
                }
            }}
        />
    )
}







function blackTilePosition(i: number): number {
    return i * WHITE_TILE_WIDTH + TILE_GAP * (i - 2)
}

export default PianoBoard;