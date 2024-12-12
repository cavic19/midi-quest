import ChordDefinition from "../models/ChordDefinition"
import { Note } from "../models/Note"

describe("createChord", () => {
    it("should create correct B major chord", () => {
        const expectedChordNotes = [Note.B, Note.D_SHARP, Note.G_FLAT]

        const actual = ChordDefinition.major.createChord(Note.B);

        expect(actual.notes).toEqual(expectedChordNotes);
    })
})