import randomItem from "../utils/randomItem";
import KeyboardShapeGenerator from "./KeyboardShapeGenerator";
import { Note, NOTES } from "./Note";

class NoteGenerator extends KeyboardShapeGenerator<Note> {
    generateRandom(): Note {
        return randomItem([...NOTES]);
    }
}

export default NoteGenerator;