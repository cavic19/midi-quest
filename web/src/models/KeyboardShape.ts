import { Note } from "./Note";

interface KeyboardShape {
    includesNotes(notes: Note[]): boolean
    equalTo(notes: Note[]): boolean 

}

export default KeyboardShape;