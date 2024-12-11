import randomItem from "../utils/randomItem";
import FixedStack from "./FixedStack";
import { Note, NOTES } from "./Note";

class NoteGenerator {
    private stack = new FixedStack<Note>(3);

    next(): Note {
        const newItem = randomItem(
            NOTES.filter((note) => !this.stack.includes(note))
        )
        this.stack.push(newItem);
        return newItem;
    }

    clear() {
        this.stack.clear();
    }
}

export default NoteGenerator;