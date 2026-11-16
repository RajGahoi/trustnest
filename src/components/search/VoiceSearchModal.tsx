import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  Mic,
  MicOff,
  X,
  Volume2,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Globe,
  AlertCircle,
  RefreshCw,
  Search,
  Radio
} from 'lucide-react';
import { useLanguage } from '../../domain/i18n/LanguageContext';

interface VoiceSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTranscriptComplete: (transcript: string) => void;
}

export const VoiceSearchModal: React.FC<VoiceSearchModalProps> = ({
  isOpen,
  onClose,
  onTranscriptComplete
}) => {
  const { language } = useLanguage();
  const [speechLang, setSpeechLang] = useState<'en-IN' | 'hi-IN'>(language === 'hi' ? 'hi-IN' : 'en-IN');
  const [isListening, setIsListening] = useState(false);
  const [permissionState, setPermissionState] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const [freqBars, setFreqBars] = useState<number[]>([18, 28, 16, 34, 22, 30, 18]);
  const [transcript, setTranscript] = useState('');
  const [interimText, setInterimText] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);

  // References
  const recognitionRef = useRef<any>(null);
  const animIntervalRef = useRef<any>(null);
  const autoSearchTimerRef = useRef<any>(null);
  const queryInputRef = useRef<HTMLInputElement>(null);

  const popularVoiceQueries = speechLang === 'hi-IN' ? [
    '3 बीएचके फ्लैट मुंबई',
    'साइबर सिटी ऑफिस स्पेस गुरुग्राम',
    '150 वर्ग गज प्लॉट पंचशील पार्क',
    'व्हाइटफील्ड विला बेंगलुरु',
    'जेवर एयरपोर्ट के पास कृषि भूमि',
    'नोएडा सेक्टर 150 रेडी टू मूव'
  ] : [
    '3 BHK for sale in Mumbai',
    'Commercial Office Cyber City Gurugram',
    '150 Sqyd Plot Panchsheel Park',
    'Luxury Villa Whitefield Bengaluru',
    'Agricultural Land near Jewar Airport',
    'Ready to Move Noida Sector 150'
  ];

  // Stop recognition and animation safely
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.abort();
      } catch {
        // ignore
      }
      recognitionRef.current = null;
    }

    if (animIntervalRef.current) {
      clearInterval(animIntervalRef.current);
      animIntervalRef.current = null;
    }

    if (autoSearchTimerRef.current) {
      clearTimeout(autoSearchTimerRef.current);
      autoSearchTimerRef.current = null;
    }

    setIsListening(false);
    setFreqBars([14, 18, 14, 22, 16, 20, 14]);
  }, []);

  // Execute search and notify parent
  const handleFinalSearch = useCallback((queryText: string) => {
    const cleanQuery = queryText.trim();
    if (!cleanQuery) return;

    setIsSearching(true);
    stopListening();

    setTimeout(() => {
      onTranscriptComplete(cleanQuery);
      onClose();
    }, 450);
  }, [onTranscriptComplete, onClose, stopListening]);

  // Start animated frequency equalizer bars
  const startEqualizerAnimation = useCallback(() => {
    if (animIntervalRef.current) {
      clearInterval(animIntervalRef.current);
    }

    animIntervalRef.current = setInterval(() => {
      // Dynamic organic wave heights when listening
      setFreqBars([
        Math.floor(12 + Math.random() * 28),
        Math.floor(16 + Math.random() * 42),
        Math.floor(10 + Math.random() * 32),
        Math.floor(22 + Math.random() * 52),
        Math.floor(14 + Math.random() * 38),
        Math.floor(18 + Math.random() * 45),
        Math.floor(12 + Math.random() * 26)
      ]);
    }, 90);
  }, []);

  // Start listening with Speech Recognition
  const startListening = useCallback(() => {
    setErrorMessage(null);
    setInterimText('');
    setIsSearching(false);

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition ||
      null;

    if (!SpeechRecognition) {
      setIsSpeechSupported(false);
      setErrorMessage(
        language === 'hi'
          ? 'आपके वर्तमान ब्राउज़र में डायरेक्ट स्पीच रिकॉग्निशन इंजन उपलब्ध नहीं है। नीचे दिया गया कोई सुझाव चुनें या टाइप करें।'
          : 'Speech recognition engine is not supported in this browser. You can click any popular voice query below or type directly.'
      );
      setIsListening(false);
      return;
    }

    setIsSpeechSupported(true);

    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }

      const recognition = new SpeechRecognition();
      // Continuous false ensures Chrome finishes utterance on pause
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = speechLang;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setPermissionState('granted');
        setErrorMessage(null);
        startEqualizerAnimation();
      };

      recognition.onresult = (event: any) => {
        let currentInterim = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const res = event.results[i];
          if (res.isFinal) {
            finalTranscript += res[0].transcript;
          } else {
            currentInterim += res[0].transcript;
          }
        }

        if (currentInterim) {
          setInterimText(currentInterim);
          // Boost frequency bars on voice detection
          setFreqBars([35, 55, 40, 70, 48, 62, 38]);
        }

        if (finalTranscript) {
          const cleaned = finalTranscript.trim();
          setTranscript(cleaned);
          setInterimText('');

          // Automatically trigger search after 600ms
          if (autoSearchTimerRef.current) {
            clearTimeout(autoSearchTimerRef.current);
          }
          autoSearchTimerRef.current = setTimeout(() => {
            handleFinalSearch(cleaned);
          }, 600);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('SpeechRecognition error:', event.error);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setPermissionState('denied');
          setIsListening(false);
          setErrorMessage(
            language === 'hi'
              ? 'माइक्रोफ़ोन की अनुमति अस्वीकृत है। कृपया अपने ब्राउज़र के एड्रेस बार में लॉक (🔒) आइकन पर क्लिक करके माइक्रोफ़ोन चालू करें।'
              : 'Microphone permission was denied. Please click the lock (🔒) icon in your browser URL bar to allow microphone access.'
          );
        } else if (event.error === 'no-speech') {
          // Keep waiting or prompt user
          setErrorMessage(
            language === 'hi'
              ? 'कोई आवाज़ सुनाई नहीं दी। कृपया थोड़ा तेज़ बोलें या नीचे दिए गए सुझाव पर टैप करें।'
              : 'No speech was detected. Please speak clearly or choose a popular query below.'
          );
        } else if (event.error === 'network') {
          setIsListening(false);
          setErrorMessage(
            language === 'hi'
              ? 'नेटवर्क स्पीच सेवा अस्थायी रूप से अनुपलब्ध है। नीचे दिए गए लोकप्रिय सुझावों पर टैप करें।'
              : 'Speech service network timeout. You can pick any voice query below or type directly.'
          );
        } else if (event.error !== 'aborted') {
          setErrorMessage(`Speech recognition notice: ${event.error}`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        if (animIntervalRef.current) {
          clearInterval(animIntervalRef.current);
          animIntervalRef.current = null;
        }
        setFreqBars([14, 18, 14, 22, 16, 20, 14]);
      };

      recognitionRef.current = recognition;
      recognition.start();
      setIsListening(true);
      startEqualizerAnimation();
    } catch (err: any) {
      console.warn('SpeechRecognition start failed:', err);
      setIsListening(false);
    }
  }, [handleFinalSearch, language, speechLang, startEqualizerAnimation]);

  // Manage open/close lifecycle
  useEffect(() => {
    if (!isOpen) {
      stopListening();
      setTranscript('');
      setInterimText('');
      setErrorMessage(null);
      setIsSearching(false);
      return;
    }

    // Auto-start listening on modal open
    startListening();

    // Close on Escape key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      stopListening();
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, speechLang, startListening, stopListening, onClose]);

  const handleSelectQuery = (q: string) => {
    setTranscript(q);
    setInterimText('');
    handleFinalSearch(q);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const queryToUse = transcript || interimText;
    if (queryToUse.trim()) {
      handleFinalSearch(queryToUse);
    }
  };

  if (!isOpen) return null;

  const currentDisplayQuery = transcript || interimText;
  const isAudioDetecting = Boolean(interimText) || isListening;

  // React Portal to document.body ensures escape from any parent CSS transforms/motion.div
  return createPortal(
    <div
      className="fixed inset-0 z-[9999] bg-navy-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn overflow-y-auto"
      onClick={e => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      role="presentation"
    >
      <div
        className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-navy-900/10 text-center relative overflow-hidden animate-scaleIn select-none my-auto"
        role="dialog"
        aria-modal="true"
        aria-label="Voice Search"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Header: Language Switcher, Audio Status & Close Button */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
          {/* Language Switcher */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setSpeechLang(prev => (prev === 'en-IN' ? 'hi-IN' : 'en-IN'));
                setErrorMessage(null);
              }}
              className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 hover:bg-[#D92228] hover:text-white text-gray-900 rounded-full text-xs font-bold transition-all cursor-pointer border border-gray-200"
              title="Toggle Recognition Language"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{speechLang === 'en-IN' ? 'English (India)' : 'हिन्दी (भारत)'}</span>
            </button>

            {/* Hardware Live Mic Indicator */}
            {isListening && (
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                isAudioDetecting
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-red-50 text-[#D92228] border border-red-200'
              }`}>
                <Radio className={`w-3 h-3 ${isAudioDetecting ? 'animate-pulse text-emerald-600' : 'text-[#D92228]'}`} />
                <span>{isAudioDetecting ? (language === 'hi' ? 'आवाज़ आ रही है' : 'Voice Heard') : (language === 'hi' ? 'माइक चालू' : 'Mic Live')}</span>
              </span>
            )}
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close Voice Search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Title */}
        <h3 className="font-display text-2xl font-black text-gray-950">
          {isSearching
            ? (language === 'hi' ? 'प्रॉपर्टी खोजी जा रही है...' : 'Searching Properties...')
            : isListening
            ? (language === 'hi' ? 'बोलिए, हम सुन रहे हैं...' : 'Listening... Speak Now')
            : (language === 'hi' ? 'वॉइस सर्च' : 'Voice Search')}
        </h3>

        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          {language === 'hi'
            ? 'प्रॉपर्टी का प्रकार, शहर, इलाका या सड़क चौड़ाई बोलें'
            : 'Speak property type, locality, city, or road width'}
        </p>

        {/* Animated Microphone Button & Equalizer */}
        <div className="my-6 flex flex-col items-center justify-center relative">
          {/* Outer Ripple Rings when Listening */}
          {isListening && (
            <>
              <span className="absolute w-28 h-28 rounded-full bg-[#D92228]/15 animate-ping pointer-events-none" />
              <span className="absolute w-24 h-24 rounded-full bg-[#D92228]/25 animate-pulse pointer-events-none" />
            </>
          )}

          {/* Center Microphone Button */}
          <button
            type="button"
            onClick={() => {
              if (isListening) {
                stopListening();
              } else {
                startListening();
              }
            }}
            className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-xl cursor-pointer ${
              isSearching
                ? 'bg-emerald-600 text-white scale-105 shadow-emerald-500/40'
                : isListening
                ? 'bg-[#D92228] text-white hover:bg-[#BF1E23] scale-110 shadow-red-600/50 ring-4 ring-red-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-gray-300'
            }`}
            aria-label={isListening ? 'Stop Listening' : 'Start Listening'}
            title={isListening ? 'Tap to Pause' : 'Tap to Start Speaking'}
          >
            {isSearching ? (
              <CheckCircle2 className="w-9 h-9 animate-bounce" />
            ) : isListening ? (
              <Mic className="w-9 h-9 animate-pulse" />
            ) : (
              <MicOff className="w-9 h-9" />
            )}
          </button>

          {/* Dynamic Frequency Equalizer Bars */}
          <div className="flex items-center justify-center gap-1.5 mt-5 h-10">
            {freqBars.map((height, i) => (
              <span
                key={i}
                className={`w-1.5 rounded-full transition-all duration-75 ${
                  isListening
                    ? isAudioDetecting
                      ? 'bg-[#D92228]'
                      : 'bg-orange-500'
                    : 'bg-gray-300'
                }`}
                style={{
                  height: `${isListening ? Math.max(8, height * 0.45) : 8}px`
                }}
              />
            ))}
          </div>

          <p className="text-[11px] font-semibold text-gray-500 mt-1">
            {isListening
              ? (language === 'hi' ? 'माइक पर टैप करके बंद करें' : 'Tap microphone to pause')
              : (language === 'hi' ? 'बोलने के लिए माइक दबाएँ' : 'Click microphone above to start speaking')}
          </p>
        </div>

        {/* Live Speech Transcript / Interim Text Display / Editable Input */}
        <form onSubmit={handleManualSubmit} className="mt-2">
          <div className="min-h-[56px] px-3.5 py-2.5 bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-between gap-2 shadow-inner focus-within:border-[#D92228] focus-within:ring-2 focus-within:ring-red-100 transition-all">
            <div className="flex-1 flex items-center gap-2 text-left">
              <Volume2 className={`w-4 h-4 shrink-0 ${isListening ? 'text-[#D92228] animate-pulse' : 'text-gray-400'}`} />
              <input
                ref={queryInputRef}
                type="text"
                value={currentDisplayQuery}
                onChange={e => {
                  setTranscript(e.target.value);
                  setInterimText('');
                }}
                placeholder={
                  isListening
                    ? (language === 'hi' ? 'जैसे बोलें: "3 बीएचके फ्लैट मुंबई"...' : 'Listening... e.g. "3 BHK in Mumbai"')
                    : (language === 'hi' ? 'यहाँ बोलें या टाइप करें...' : 'Speak or type property search query...')
                }
                className="w-full bg-transparent text-sm sm:text-base font-bold text-gray-950 placeholder-gray-400 focus:outline-none"
              />
            </div>

            {currentDisplayQuery && (
              <button
                type="button"
                onClick={() => {
                  setTranscript('');
                  setInterimText('');
                }}
                className="p-1 text-gray-400 hover:text-gray-700 rounded-full cursor-pointer"
                title="Clear"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>

        {/* Error Notification with Friendly Retry Action */}
        {errorMessage && (
          <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 font-medium text-left flex items-start gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span>{errorMessage}</span>
              {permissionState === 'denied' && (
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={startListening}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-amber-200 hover:bg-amber-300 text-amber-950 rounded-lg font-bold text-xs cursor-pointer transition-colors"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>{language === 'hi' ? 'पुनः प्रयास करें' : 'Try Again'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 1-Tap Popular Voice Prompts (Indian Real Estate Queries) */}
        <div className="mt-5 text-left">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            <span>{language === 'hi' ? 'लोकप्रिय वॉइस सुझाव (टैप करें):' : 'Popular Voice Suggestions (Tap to Search):'}</span>
          </p>

          <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
            {popularVoiceQueries.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectQuery(q)}
                className="px-3 py-1.5 bg-gray-100 hover:bg-[#D92228] hover:text-white text-gray-900 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 border border-gray-200 shadow-xs group"
              >
                <Mic className="w-3 h-3 text-[#D92228] group-hover:text-white shrink-0" />
                <span className="truncate max-w-[200px] sm:max-w-none">{q}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons: Cancel and Search Now */}
        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-100 font-bold rounded-xl text-sm transition-colors cursor-pointer"
          >
            {language === 'hi' ? 'रद्द करें' : 'Cancel'}
          </button>

          <button
            type="button"
            onClick={() => handleFinalSearch(currentDisplayQuery || popularVoiceQueries[0])}
            disabled={!currentDisplayQuery && !isSpeechSupported}
            className="flex-1 py-2.5 bg-[#D92228] hover:bg-[#BF1E23] disabled:opacity-50 disabled:cursor-not-allowed text-white font-extrabold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>
              {currentDisplayQuery
                ? (language === 'hi' ? 'अभी खोजें' : 'Search Now')
                : (language === 'hi' ? 'खोजें' : 'Search')}
            </span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
