import { useState, useRef } from 'react';
import nlp from 'compromise';
import nlpNumbers from 'compromise-numbers';

nlp.extend(nlpNumbers);

const useVoiceInput = () => {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRec) {
    console.error('SpeechRecognition API not supported');
    return {
      listening: false,
      startListening: (_, onError) => onError('SpeechRecognition not supported'),
    };
  }

  if (!recognitionRef.current) {
    const rec = new SpeechRec();
    rec.lang = 'en-US';
    rec.continuous = false;
    rec.interimResults = false;
    rec.maxAlternatives = 1;

    rec.onstart = () => setListening(true);
    rec.onend   = () => setListening(false);
    rec.onerror = (e) => {
      console.error('[useVoiceInput] error', e.error);
      setListening(false);
      // pass error to callback if provided
      if (rec.onError) rec.onError(e.error);
    };

    rec.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      // NLP parsing
      let doc = nlp(transcript).numbers().toNumber();
      let cleaned = doc
        .text()
        .replace(/rupees?/i, '')
        .replace(/(i\s+)?spent/gi, '')
        .trim();
      const amount = (() => {
        const m = cleaned.match(/\d+(?:\.\d+)?/);
        return m ? parseFloat(m[0]) : '';
      })();
      const name = (() => {
        const m = cleaned.match(/at\s+(.+)/i);
        return m ? m[1].trim() : '';
      })();
      if (rec.onResult) rec.onResult({ amount, name });
    };

    recognitionRef.current = rec;
  }

  const startListening = (onResult, onError) => {
    recognitionRef.current.onResult = onResult;
    recognitionRef.current.onError  = onError;
    try {
      recognitionRef.current.start();
    } catch (err) {
      console.error('[useVoiceInput] start error', err);
      onError?.(err.message || 'Failed to start recognition');
    }
  };

  return { listening, startListening };
};

export default useVoiceInput;
