class GameAudio {
  private audioContext: AudioContext;
  private gainNode: GainNode;

  constructor() {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.gainNode = this.audioContext.createGain();
    this.gainNode.connect(this.audioContext.destination);
  }

  playEatSound() {
    this.playTone(600, 0.1, 0.1);
  }

  playGameOverSound() {
    this.playTone(200, 0.3, 0.5);
    setTimeout(() => this.playTone(150, 0.3, 0.5), 300);
  }

  private playTone(frequency: number, duration: number, volume: number) {
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.type = 'square';
    oscillator.frequency.value = frequency;

    gainNode.gain.value = volume;
    gainNode.gain.exponentialRampToValueAtTime(
      0.01, this.audioContext.currentTime + duration
    );

    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + duration);
  }
}

export default new GameAudio();
