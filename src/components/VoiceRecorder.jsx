import { useState, useRef, useEffect } from 'react';

export default function VoiceRecorder({ onTranscription }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Check if browser supports Web Speech API (completely free, no API keys needed)
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join(' ');
        onTranscription(transcript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'no-speech') {
          alert('No speech detected. Please try again.');
        } else if (event.error === 'not-allowed') {
          alert('Microphone permission denied. Please allow microphone access and try again.');
        } else {
          alert(`Speech recognition error: ${event.error}. Please try again.`);
        }
        setIsRecording(false);
        setIsProcessing(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
        setIsProcessing(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onTranscription]);

  const startRecording = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    try {
      recognitionRef.current.start();
      setIsRecording(true);
      setIsProcessing(false);
    } catch (error) {
      console.error('Error starting recognition:', error);
      alert('Could not start speech recognition. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      setIsProcessing(true);
    }
  };

  return (
    <div className="flex items-center gap-4">
      {!isRecording ? (
        <button
          onClick={startRecording}
          disabled={isProcessing}
          className="flex items-center gap-2 px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed font-poppins font-medium transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
          style={{
            backgroundColor: '#F5D9E4',
            color: '#E0007A',
            fontFamily: 'Poppins, sans-serif'
          }}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
          </svg>
          {isProcessing ? 'Processing...' : 'Start Recording'}
        </button>
      ) : (
        <button
          onClick={stopRecording}
          className="flex items-center gap-2 px-4 py-2 rounded-lg animate-pulse font-poppins font-medium transition-all duration-200"
          style={{
            backgroundColor: '#F5D9E4',
            color: '#E0007A',
            fontFamily: 'Poppins, sans-serif'
          }}
        >
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#E0007A' }}></div>
          Recording... Click to stop
        </button>
      )}
    </div>
  );
}

