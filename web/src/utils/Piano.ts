import { Note, NOTES } from "../models/Note";

type AudioSample = undefined | "loading" | AudioBuffer

type Octave = 2 | 3 | 4 | 5 | 6

class Piano {
    context: AudioContext;
    extension: string;

    samples: Record<Octave, AudioSample> = {
        2: undefined,
        3: undefined,
        4: undefined,
        5: undefined,
        6: undefined,
    }

    constructor() {
        // Support prefixed AudioContext used in Safari and old Chrome versions.
        let audioContext = window.AudioContext || (window as any).webkitAudioContext;
        this.context = new audioContext();
        // Polyfill for old callback-based syntax used in Safari.
        if (this.context.decodeAudioData.length !== 1) {
            const originalDecodeAudioData = this.context.decodeAudioData.bind(this.context);
            this.context.decodeAudioData = buffer =>
                new Promise((resolve, reject) =>
                    originalDecodeAudioData(buffer, resolve, reject)
                );
        }
        // determine supported extension
        let audioElm = document.createElement("audio");
        if (audioElm.canPlayType('audio/ogg')) {
            this.extension = 'ogg';
        } else if (audioElm.canPlayType('audio/mp3')) {
            this.extension = 'mp3';
        } else if (audioElm.canPlayType('audio/wav')) {
            this.extension = 'wav';
        } else {
            this.extension = 'wav';
        }
        // load samples in all octaves
        Promise.allSettled([
            this.loadSample(2),
            this.loadSample(3),
            this.loadSample(4),
            this.loadSample(5),
            this.loadSample(6),
        ])
    }

    private async loadSample(octave: Octave): Promise<AudioBuffer> {
        let sample = this.samples[octave]
        if (sample === undefined) {
            this.samples[octave] = 'loading'
            const response = await fetch(`/piano/samples_piano_F${octave}.${this.extension}`);
            const buffer = await response.arrayBuffer();
            const data = await this.context.decodeAudioData(buffer);
            this.samples[octave] = data;
            return data;
        } else if (sample === 'loading') {
            throw new Error("Duplicate playing action when sample is still loading.")
        } else {
            return sample
        }
    }

    private playSample(sample: AudioBuffer, note: Note) {
        const source = this.context.createBufferSource();
        source.buffer = sample;
        source.playbackRate.value = 2 ** ((NOTES.indexOf(note) - NOTES.indexOf(Note.F)) / 12);
        source.connect(this.context.destination);
        source.start(0, 0, 2);
    }

    async play(note: Note, octave: Octave = 3) {
        try {
            const sample = await this.loadSample(octave);
            this.playSample(sample, note);
        } catch (e) {
            console.error(e);
        }
    }
}

const piano = new Piano()
export default piano