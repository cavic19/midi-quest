import { useEffect, useState } from "react";
import { Note, NOTES } from "../types/Note";

const MIDI_NOTE_ON = 144
const MIDI_NOTE_OFF = 128

// TODO: This should return error if there is no midi
function useMidiPiano(onNoteOn?: (note: Note) => void, onNoteOf?: (note: Note) => void) {
    const [midiAccess, setMidiAccess] = useState<WebMidi.MIDIAccess>()

    useEffect(() => {
        if (!midiAccess) {
            navigator
                .requestMIDIAccess()
                .catch(console.error)
                .then(access => {
                    if (access) {
                        setMidiAccess(access)
                    }
                })
        }
    }, []);

    if (midiAccess) {
        Array.from(midiAccess.inputs.values()).forEach(input => {
            input.onmidimessage = ({ data }) => {
                const [command, note] = Array.from(data)
                console.log(command, note)
                if (command == MIDI_NOTE_ON) {
                    onNoteOn?.(NOTES[note % NOTES.length])

                } else if (command == MIDI_NOTE_OFF) {
                    onNoteOf?.(NOTES[note % NOTES.length])
                }
            };
        })
    }
}

export default useMidiPiano;