import Chord from "./Chord";
import Interval from "./Interval";
import { Note, NOTES } from "./Note";

export class ChordDefinition {
    static readonly major = new ChordDefinition("major", [Interval.ROOT, Interval.MAJOR_THIRD, Interval.PERFECT_FIFTH]);
    static readonly majorSeventh = new ChordDefinition("maj7", [Interval.ROOT, Interval.MAJOR_THIRD, Interval.PERFECT_FIFTH, Interval.MAJOR_SEVENTH]);
    static readonly minor = new ChordDefinition("minor", [Interval.ROOT, Interval.MINOR_THIRD, Interval.PERFECT_FIFTH]);
    static readonly minorSeventh = new ChordDefinition("min7", [Interval.ROOT, Interval.MINOR_THIRD, Interval.PERFECT_FIFTH, Interval.MINOR_SEVENTH]);
    static readonly dominamSeventh = new ChordDefinition("7", [Interval.ROOT, Interval.MAJOR_THIRD, Interval.PERFECT_FIFTH, Interval.MINOR_SEVENTH]);

    constructor(
        public namePattern: string,
        public intervals: Interval[]
    ) {

    }

    createChord(root: Note): Chord {
        const rootIndex = NOTES.indexOf(root);
        return new Chord(
            `${root.randomNotation()} ${this.namePattern}`,
            this.intervals.map(i => NOTES[(rootIndex + i) % NOTES.length])
        )
    }
}

export default ChordDefinition;