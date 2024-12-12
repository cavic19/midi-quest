import randomItem from "../utils/randomItem";
import Chord from "./Chord";
import ChordDefinition from "./ChordDefinition";
import KeyboardShapeGenerator from "./KeyboardShapeGenerator";
import NoteGenerator from "./NoteGenerator";

class ChordGenerator extends KeyboardShapeGenerator<Chord> {
    private noteGenerator = new NoteGenerator();
    constructor(
        private definitions: ChordDefinition[]
    ) {
        super();
    }

    generateRandom(): Chord {
        const definition = randomItem(this.definitions);
        const randomRoot = this.noteGenerator.next()
        return definition.createChord(randomRoot)
    }

}

export default ChordGenerator;