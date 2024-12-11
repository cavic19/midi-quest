import { Note, NOTES } from "./Note";

export const Intervals = {
    ROOT: 0,
    PERFECT_UNISON: 0,
    MINOR_SECOND: 1,
    MAJOR_SECOND: 2,
    MINOR_THIRD: 3,
    MAJOR_THIRD: 4,
    PERFECT_FOURTH: 5,
    DIMINISHED_FIFTH: 6,
    AUGMENTED_FOURTH: 6,
    PERFECT_FIFTH: 7,
    MINOR_SIXTH: 8,
    MAJOR_SIXTH: 9,
    MINOR_SEVENTH: 10,
    MAJOR_SEVENTH: 11,
    PERFECT_OCTAVE: 12
}


export class Chord {
    constructor(
        public name: string,
        public readonly notes: ReadonlyArray<Note>
    ) {
       
    }
}


export class ChordPattern {
    static readonly major = new ChordPattern("major", [Intervals.ROOT, Intervals.MAJOR_THIRD, Intervals.PERFECT_FIFTH]);
    static readonly minor = new ChordPattern("minor", [Intervals.ROOT, Intervals.MINOR_THIRD, Intervals.PERFECT_FIFTH]);

    constructor(
        public namePattern: string,
        public intervals: number[]
    ) {

    }

    createChord(root: Note): Chord {
        const rootIndex = NOTES.indexOf(root);
        return new Chord(
            `${root} ${this.namePattern}`,
            this.intervals.map(i => NOTES[rootIndex + i % NOTES.length])
        )
    }
}