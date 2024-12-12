import randomItem from "../utils/randomItem";
import KeyboardShape from "./KeyboardShape";

export class Note implements KeyboardShape {
    static readonly C = new Note(["C"]);
    static readonly D = new Note(["D"]);
    static readonly E = new Note(["E"]);
    static readonly F = new Note(["F"]);
    static readonly G = new Note(["G"]);
    static readonly A = new Note(["A"]);
    static readonly B = new Note(["B"]);
    static readonly C_SHARP = new Note(["C#", "Db"]);
    static readonly D_FLAT = Note.C_SHARP;
    static readonly D_SHARP = new Note(["D#", "Eb"]);
    static readonly E_FLAT = Note.D_SHARP;
    static readonly F_SHARP = new Note(["F#", "Gb"]);
    static readonly G_FLAT = Note.F_SHARP;
    static readonly G_SHARP = new Note(["G#", "Ab"]);
    static readonly A_FLAT = Note.G_SHARP;
    static readonly A_SHARP = new Note(["A#", "Bb"]);
    static readonly B_FLAT = Note.A_SHARP;

    private constructor(
        public notations: string[]
    ) {
    }
    includesNotes(notes: Note[]): boolean {
        return this.equalTo(notes);
    }
    equalTo(shape: Note[] | KeyboardShape): boolean {
        if (Array.isArray(shape)) {
            return shape.length == 1 && shape[0] == this
        } else if (shape instanceof Note) {
            return shape == this
        } else {
            return false
        }
    }

    randomNotation(): string {
        return randomItem(this.notations);
    }
}

export const NOTES: ReadonlyArray<Note> = [Note.C, Note.C_SHARP, Note.D, Note.D_SHARP, Note.E, Note.F, Note.F_SHARP, Note.G, Note.G_SHARP, Note.A, Note.A_SHARP, Note.B];