import { useEffect, useState } from "react";
import { Note, NOTES } from "../models/Note";

const MIDI_NOTE_ON = 144
const MIDI_NOTE_OFF = 128


function useMidiPiano(onNoteOn?: (note: Note) => void, onNoteOff?: (note: Note) => void) {
    const [midiAccess, setMidiAccess] = useState<WebMidi.MIDIAccess>()

    useEffect(() => {
        if (!midiAccess) {
            try {
                navigator
                    .requestMIDIAccess()
                    .catch(console.error)
                    .then(access => {
                        if (access) {
                            setMidiAccess(access)
                        }
                    })
            } catch (exception) {
                console.error(`Cannot request midi access because of error=${exception}`)
            }
        }
    }, []);

    useEffect(() => {
        if (midiAccess) {
            const handleMidiMessage = ({ data }: WebMidi.MIDIMessageEvent) => {
                if (data) {
                    const [command, note] = Array.from(data)
                    if (command == MIDI_NOTE_ON) {
                        onNoteOn?.(NOTES[note % NOTES.length])

                    } else if (command == MIDI_NOTE_OFF) {
                        onNoteOff?.(NOTES[note % NOTES.length])
                    }
                }
            };

            Array.from(midiAccess.inputs.values()).forEach(input => {
                input.addEventListener("midimessage", handleMidiMessage);
            });
            return () => {
                Array.from(midiAccess.inputs.values()).forEach(input => {
                    input.removeEventListener("midimessage", handleMidiMessage);
                });
            }
        }
    }, [midiAccess, onNoteOn, onNoteOff]);
}

export default useMidiPiano;