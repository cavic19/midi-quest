import classNames from "classnames";
import useMidiPiano from "../hooks/useMidiPiano";
import { useCallback, useEffect, useState } from "react";
import { Note } from "../types/Note";
import HasClassname from "../types/HasClassname";

type PianoBoardProps = {
    onTilesChange?: (notes: Note[]) => void
} & HasClassname

function PianoBoard({ onTilesChange, className }: PianoBoardProps) {
    const whiteTileWidth = 90;
    const whiteTileHeight = 340;
    const blackTileWidth = 46;
    const blackTileHeight = 174;
    const gap = 16;

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

    useMidiPiano(
        handleNoteOn,
        handleNoteOff,
    );


    const blackTilePosition = useCallback((i: number) => {
        // i is the number of left white tile
        return i * whiteTileWidth + gap * (i - 2)
    }, []);


    return (
        <div className={classNames("flex relative w-fit h-fit", className)} style={{ gap: gap }}>
            <div className={classNames("bg-black rounded-xl absolute z-0 drop-shadow-md", { "bg-my-blue-400": pressedTiles.includes("C#") })} style={{ width: blackTileWidth, height: blackTileHeight, left: blackTilePosition(1) }} />
            <div className={classNames("bg-black rounded-xl absolute z-0 drop-shadow-md", { "bg-my-blue-400": pressedTiles.includes("D#") })} style={{ width: blackTileWidth, height: blackTileHeight, left: blackTilePosition(2) }} />
            <div className={classNames("bg-black rounded-xl absolute z-0 drop-shadow-md", { "bg-my-blue-400": pressedTiles.includes("F#") })} style={{ width: blackTileWidth, height: blackTileHeight, left: blackTilePosition(4) }} />
            <div className={classNames("bg-black rounded-xl absolute z-0 drop-shadow-md", { "bg-my-blue-400": pressedTiles.includes("G#") })} style={{ width: blackTileWidth, height: blackTileHeight, left: blackTilePosition(5) }} />
            <div className={classNames("bg-black rounded-xl absolute z-0 drop-shadow-md", { "bg-my-blue-400": pressedTiles.includes("A#") })} style={{ width: blackTileWidth, height: blackTileHeight, left: blackTilePosition(6) }} />

            <div className={classNames("rounded-xl", { "bg-my-blue-100": pressedTiles.includes("C"), "bg-white": !pressedTiles.includes("C") })} style={{ width: whiteTileWidth, height: whiteTileHeight }} />
            <div className={classNames("rounded-xl", { "bg-my-blue-100": pressedTiles.includes("D"), "bg-white": !pressedTiles.includes("D") })} style={{ width: whiteTileWidth, height: whiteTileHeight }} />
            <div className={classNames("rounded-xl", { "bg-my-blue-100": pressedTiles.includes("E"), "bg-white": !pressedTiles.includes("E") })} style={{ width: whiteTileWidth, height: whiteTileHeight }} />
            <div className={classNames("rounded-xl", { "bg-my-blue-100": pressedTiles.includes("F"), "bg-white": !pressedTiles.includes("F") })} style={{ width: whiteTileWidth, height: whiteTileHeight }} />
            <div className={classNames("rounded-xl", { "bg-my-blue-100": pressedTiles.includes("G"), "bg-white": !pressedTiles.includes("G") })} style={{ width: whiteTileWidth, height: whiteTileHeight }} />
            <div className={classNames("rounded-xl", { "bg-my-blue-100": pressedTiles.includes("A"), "bg-white": !pressedTiles.includes("A") })} style={{ width: whiteTileWidth, height: whiteTileHeight }} />
            <div className={classNames("rounded-xl", { "bg-my-blue-100": pressedTiles.includes("B"), "bg-white": !pressedTiles.includes("B") })} style={{ width: whiteTileWidth, height: whiteTileHeight }} />
        </div>
    )
}

export default PianoBoard;