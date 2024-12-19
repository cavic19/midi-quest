import ChordDefinition from "./ChordDefinition";
import ChordGenerator from "./ChordGenerator";
import KeyboardShapeGenerator from "./KeyboardShapeGenerator";
import NoteGenerator from "./NoteGenerator";

export type GameMode = "NOTES" | "CHORDS"

class GameConfiguration {
    static DEFAULT = new GameConfiguration(
        [
            ChordDefinition.major,
            ChordDefinition.minor,
        ],
        "NOTES",
        false
    );

    static MAX_HEALTH = 10
    // in ms
    static MAX_TIME = 10_000

    constructor(
        public chordDefinitions: ChordDefinition[],
        public mode: GameMode,
        public mutePiano: boolean
    ) {

    }

    shapeGenerator(): KeyboardShapeGenerator {
        if (this.mode == "CHORDS" && this.chordDefinitions.length !== 0) {
            return new ChordGenerator(this.chordDefinitions);
        } else {
            return new NoteGenerator();
        }
    }
}


export default GameConfiguration