import classNames from "classnames"
import { useEffect, useState } from "react"
import HasClassname from "../../types/HasClassname";
import HasStyle from "../../types/HasStyle";

export const WHITE_TILE_WIDTH = 100;
export const WHITE_TILE_HEIGHT = 400;
export const BLACK_TILE_WIDTH = 50;
export const BLACK_TIME_HEIGHT = 200;
export const TILE_GAP = 16;

type TileProps = {
    active?: boolean
    pressed?: boolean
    onTilePress?: () => void
    onTileRelease?: () => void,
    // Desktop keyboard keys that also trigger this note
    keys?: string[]
} & HasStyle & HasClassname

export function WhiteTile(props: TileProps) {
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

export function BlackTile(props: TileProps) {
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


export function Tile(props: TileProps) {
    const [tileDown, setTileDown] = useState(false);
    useEffect(() => {
        if (props.active) {
            const handleKeyDown = (e: KeyboardEvent) => {
                if (!tileDown && props.keys?.map(k => k.toLowerCase())?.includes(e.key.toLocaleLowerCase())) {
                    setTileDown(true);
                    props.onTilePress?.();
                }
            }
            const handleKeyUp = (e: KeyboardEvent) => {
                if (tileDown && props.keys?.map(k => k.toLowerCase()).includes(e.key.toLowerCase())) {
                    setTileDown(false);
                    props.onTileRelease?.();
                }
            }
    
            window.addEventListener("keydown", handleKeyDown);
            window.addEventListener("keyup", handleKeyUp);
            return () => {
                window.removeEventListener("keydown", handleKeyDown);
                window.removeEventListener("keyup", handleKeyUp);
            }
        }
    }, [tileDown]);

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

export default Tile;