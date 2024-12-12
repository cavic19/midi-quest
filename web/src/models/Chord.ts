import { Note } from "./Note";
import KeyboardShape from "./KeyboardShape";

class Chord implements KeyboardShape {
    constructor(
        public name: string,
        public readonly notes: ReadonlyArray<Note>
    ) {

    }

    includesNotes(notes: Note[]): boolean {
        return notes.every(note => this.notes.includes(note))
    }

    equalTo(notes: Note[]): boolean {
        const distinctNotes = new Set(notes)
        return distinctNotes.size == this.notes.length && this.includesNotes(Array.from(distinctNotes));
    }
}


export default Chord;