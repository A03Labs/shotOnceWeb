/**
 * ShotOnce Studio Web Audio Engine
 * Handles dual-track mixing (Microphone + System Audio),
 * dynamics compressor, noise gating, and real-time stereo VU meter analysis.
 */

export interface VuLevels {
  leftDb: number;
  rightDb: number;
  peakDb: number;
  isClipping: boolean;
}

export class AudioStudioEngine {
  private ctx: AudioContext | null = null;
  private micSource: MediaStreamAudioSourceNode | null = null;
  private sysSource: MediaStreamAudioSourceNode | null = null;
  private micGain: GainNode | null = null;
  private sysGain: GainNode | null = null;
  private compressorNode: DynamicsCompressorNode | null = null;
  private noiseGateNode: BiquadFilterNode | null = null;
  private analyserLeft: AnalyserNode | null = null;
  private analyserRight: AnalyserNode | null = null;
  private splitter: ChannelSplitterNode | null = null;
  private destination: MediaStreamAudioDestinationNode | null = null;
  private pcmDataLeft: Float32Array = new Float32Array(512);
  private pcmDataRight: Float32Array = new Float32Array(512);

  public isInitialized = false;

  public init() {
    if (this.ctx) return;
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new AudioCtx();

    this.destination = this.ctx.createMediaStreamDestination();
    this.micGain = this.ctx.createGain();
    this.sysGain = this.ctx.createGain();

    // Studio compressor: smooth vocal punch without distortion
    this.compressorNode = this.ctx.createDynamicsCompressor();
    this.compressorNode.threshold.setValueAtTime(-24, this.ctx.currentTime);
    this.compressorNode.knee.setValueAtTime(30, this.ctx.currentTime);
    this.compressorNode.ratio.setValueAtTime(4, this.ctx.currentTime);
    this.compressorNode.attack.setValueAtTime(0.003, this.ctx.currentTime);
    this.compressorNode.release.setValueAtTime(0.25, this.ctx.currentTime);

    // Subtle high-pass filter for mic rumble reduction (noise gate baseline)
    this.noiseGateNode = this.ctx.createBiquadFilter();
    this.noiseGateNode.type = 'highpass';
    this.noiseGateNode.frequency.setValueAtTime(80, this.ctx.currentTime);

    // Stereo Splitter & Analysers for VU metering
    this.splitter = this.ctx.createChannelSplitter(2);
    this.analyserLeft = this.ctx.createAnalyser();
    this.analyserRight = this.ctx.createAnalyser();
    this.analyserLeft.fftSize = 512;
    this.analyserRight.fftSize = 512;

    this.splitter.connect(this.analyserLeft, 0);
    this.splitter.connect(this.analyserRight, 1);

    // Connect to destination and splitters
    this.compressorNode.connect(this.destination);
    this.compressorNode.connect(this.splitter);

    this.isInitialized = true;
  }

  public setMicrophoneStream(stream: MediaStream | null) {
    if (!this.ctx || !this.micGain || !this.noiseGateNode) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    if (this.micSource) {
      this.micSource.disconnect();
      this.micSource = null;
    }

    if (stream && stream.getAudioTracks().length > 0) {
      try {
        this.micSource = this.ctx.createMediaStreamSource(stream);
        this.micSource.connect(this.noiseGateNode);
        this.noiseGateNode.connect(this.micGain);
        if (this.compressorNode) {
          this.micGain.connect(this.compressorNode);
        }
      } catch (err) {
        console.warn('Failed to bind microphone stream:', err);
      }
    }
  }

  public setSystemStream(stream: MediaStream | null) {
    if (!this.ctx || !this.sysGain || !this.compressorNode) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    if (this.sysSource) {
      this.sysSource.disconnect();
      this.sysSource = null;
    }

    if (stream && stream.getAudioTracks().length > 0) {
      try {
        this.sysSource = this.ctx.createMediaStreamSource(stream);
        this.sysSource.connect(this.sysGain);
        this.sysGain.connect(this.compressorNode);
      } catch (err) {
        console.warn('Failed to bind system stream audio:', err);
      }
    }
  }

  public setMicVolume(val: number) {
    if (this.micGain && this.ctx) {
      this.micGain.gain.setValueAtTime(Math.max(0, Math.min(val, 1.5)), this.ctx.currentTime);
    }
  }

  public setSystemVolume(val: number) {
    if (this.sysGain && this.ctx) {
      this.sysGain.gain.setValueAtTime(Math.max(0, Math.min(val, 1.5)), this.ctx.currentTime);
    }
  }

  public setCompressorEnabled(enabled: boolean) {
    if (this.compressorNode && this.ctx) {
      this.compressorNode.ratio.setValueAtTime(enabled ? 4 : 1, this.ctx.currentTime);
    }
  }

  public setNoiseGateEnabled(enabled: boolean) {
    if (this.noiseGateNode && this.ctx) {
      this.noiseGateNode.frequency.setValueAtTime(enabled ? 120 : 20, this.ctx.currentTime);
    }
  }

  public getMixedTrack(): MediaStreamTrack | null {
    if (this.destination && this.destination.stream) {
      const tracks = this.destination.stream.getAudioTracks();
      return tracks[0] || null;
    }
    return null;
  }

  public getVuLevels(): VuLevels {
    if (!this.analyserLeft || !this.analyserRight) {
      return { leftDb: -60, rightDb: -60, peakDb: -60, isClipping: false };
    }

    this.analyserLeft.getFloatTimeDomainData(this.pcmDataLeft as unknown as Float32Array<ArrayBuffer>);
    this.analyserRight.getFloatTimeDomainData(this.pcmDataRight as unknown as Float32Array<ArrayBuffer>);

    let sumL = 0;
    let sumR = 0;
    let peak = 0;

    for (let i = 0; i < this.pcmDataLeft.length; i++) {
      const vL = this.pcmDataLeft[i];
      const vR = this.pcmDataRight[i];
      sumL += vL * vL;
      sumR += vR * vR;
      const absL = Math.abs(vL);
      const absR = Math.abs(vR);
      if (absL > peak) peak = absL;
      if (absR > peak) peak = absR;
    }

    const rmsL = Math.sqrt(sumL / this.pcmDataLeft.length);
    const rmsR = Math.sqrt(sumR / this.pcmDataRight.length);

    // Convert to dB (-60 to 0)
    const leftDb = rmsL > 0.0001 ? Math.max(-60, 20 * Math.log10(rmsL)) : -60;
    const rightDb = rmsR > 0.0001 ? Math.max(-60, 20 * Math.log10(rmsR)) : -60;
    const peakDb = peak > 0.0001 ? Math.max(-60, 20 * Math.log10(peak)) : -60;

    return {
      leftDb,
      rightDb,
      peakDb,
      isClipping: peakDb >= -0.5,
    };
  }

  public cleanup() {
    if (this.ctx) {
      this.ctx.close().catch(() => {});
      this.ctx = null;
    }
    this.isInitialized = false;
  }
}

export const audioStudioEngine = new AudioStudioEngine();
