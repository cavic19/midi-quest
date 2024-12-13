import Chord from "./Chord";
import Interval from "./Interval";
import { Note, NOTES } from "./Note";

export class ChordDefinition {
    static readonly major = new ChordDefinition("Major", "major", [Interval.ROOT, Interval.MAJOR_THIRD, Interval.PERFECT_FIFTH]);
    static readonly majorSeventh = new ChordDefinition("Major Seventh", "maj7", [Interval.ROOT, Interval.MAJOR_THIRD, Interval.PERFECT_FIFTH, Interval.MAJOR_SEVENTH]);
    static readonly minor = new ChordDefinition("Minor", "minor", [Interval.ROOT, Interval.MINOR_THIRD, Interval.PERFECT_FIFTH]);
    static readonly minorSeventh = new ChordDefinition("Minor Seventh", "min7", [Interval.ROOT, Interval.MINOR_THIRD, Interval.PERFECT_FIFTH, Interval.MINOR_SEVENTH]);
    static readonly dominantSeventh = new ChordDefinition("Dominant Seventh", "7", [Interval.ROOT, Interval.MAJOR_THIRD, Interval.PERFECT_FIFTH, Interval.MINOR_SEVENTH]);
    static list = Object.values(ChordDefinition).filter(it => it instanceof ChordDefinition);

    /**
     * 
     * @param namePattern how should the chord be called e.g. for minor 7 chords this should be just min7
     * @param intervals 
     */
    constructor(
        public displayName: string,
        public namePattern: string,
        public intervals: Interval[],
        public key: string = namePattern,
    ) {

    }

    createChord(root: Note): Chord {
        const rootIndex = NOTES.indexOf(root);
        return new Chord(
            `${root.name()} ${this.namePattern}`,
            this.intervals.map(i => NOTES[(rootIndex + i) % NOTES.length])
        )
    }
}

export default ChordDefinition;