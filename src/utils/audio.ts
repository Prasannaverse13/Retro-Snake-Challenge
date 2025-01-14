import * as Tone from 'tone';

class GameAudio {
  private synth: Tone.Synth;
  private isInitialized: boolean = false;

  constructor() {
    this.synth = new Tone.Synth({
      oscillator: {
        type: 'square'
      },
      envelope: {
        attack: 0.01,
        decay: 0.1,
        sustain: 0,
        release: 0.1
      }
    }).toDestination();
  }

  async init() {
    if (!this.isInitialized) {
      await Tone.start();
      this.isInitialized = true;
    }
  }

  playEatSound() {
    this.synth.triggerAttackRelease('C5', '0.1');
  }

  playGameOverSound() {
    const now = Tone.now();
    this.synth.triggerAttackRelease('A3', '0.1', now);
    this.synth.triggerAttackRelease('F3', '0.1', now + 0.1);
    this.synth.triggerAttackRelease('D3', '0.2', now + 0.2);
  }
}

export const gameAudio = new GameAudio();
