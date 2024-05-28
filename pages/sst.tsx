import { useState, useRef } from 'react';
import OpusMediaRecorder from 'opus-media-recorder';

const Record = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      console.log('Requesting user media...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('User media obtained.');

      const options = { mimeType: 'audio/webm' };
      const workerOptions = {
        encoderWorkerPath: '/encoderWorker.umd.js', // 确保路径正确
        WebMOpusEncoderWasmPath: 'https://cdn.jsdelivr.net/npm/opus-media-recorder@latest/WebMOpusEncoder.wasm',
      };

      console.log('Creating OpusMediaRecorder...');
      const mediaRecorder = new OpusMediaRecorder(stream, options, workerOptions) as MediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          console.log('Data available:', event.data);
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        console.log('Recording stopped.');
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioUrl(audioUrl);
        audioChunksRef.current = [];
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      console.log('Recording started.');
    } catch (err) {
      console.error('Error starting recording:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      console.log('Recording stopped by user.');
    }
  };

  const saveRecording = () => {
    if (audioUrl) {
      const a = document.createElement('a');
      a.href = audioUrl;
      a.download = 'recording.webm';
      a.click();
      console.log('Recording saved.');
    }
  };

  return (
    <div>
      <h1>Audio Recorder</h1>
      <button onClick={startRecording} disabled={isRecording}>
        Start Recording
      </button>
      <button onClick={stopRecording} disabled={!isRecording}>
        Stop Recording
      </button>
      <button onClick={saveRecording} disabled={!audioUrl}>
        Save Recording
      </button>
      {audioUrl && (
        <div>
          <h2>Recorded Audio</h2>
          <audio controls src={audioUrl}></audio>
        </div>
      )}
    </div>
  );
};

export default Record;