import { Note } from "./Note";

interface KeyboardShape {
    includesNotes(notes: Note[]): boolean
    equalTo(shape: Note[] | KeyboardShape): boolean 
}

export default KeyboardShape;