import { Note } from "./Note";
import KeyboardShape from "./KeyboardShape";

class Chord implements KeyboardShape {
    constructor(
        public notation: string,
        public readonly notes: ReadonlyArray<Note>
    ) {

    }

    includesNotes(notes: Note[]): boolean {
        return notes.every(note => this.notes.includes(note))
    }

    equalTo(shape: Note[] | KeyboardShape): boolean {
        if (Array.isArray(shape)) {
            const distinctNotes = new Set(shape)
            return distinctNotes.size == this.notes.length && this.includesNotes(Array.from(distinctNotes));
        } else if (shape instanceof Chord) {
            return this.equalTo([...shape.notes])
        } else {
            return false
        }
    }

    name(): string {
        return this.notation
    }
}


export default Chord;