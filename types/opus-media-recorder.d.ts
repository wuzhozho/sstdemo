declare module 'opus-media-recorder' {
  interface WorkerOptions {
    encoderWorkerPath: string;
    WebMOpusEncoderWasmPath: string;
  }

  interface MediaRecorderOptions {
    mimeType?: string;
  }

  export default class OpusMediaRecorder {
    constructor(stream: MediaStream, options?: MediaRecorderOptions, workerOptions?: WorkerOptions);
    start(timeslice?: number): void;
    stop(): void;
    pause(): void;
    resume(): void;
    ondataavailable: (event: BlobEvent) => void;
    onerror: (event: Event) => void;
  }
}