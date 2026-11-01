import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, X, Volume2, Sparkles, CheckCircle2, ArrowRight, Globe } from 'lucide-react';
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
  const [transcript, setTranscript] = useState('');
  const [interimText, setInterimText] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const recognitionRef = useRef<any>(null);

  const popularVoiceQueries = speechLang === 'hi-IN' ? [
    '3 बीएचके ग्रेटर नोएडा',
    'साइबर सिटी ऑफिस स्पेस',
    'जेवर एयरपोर्ट कृषि भूमि',
    '100 फीट रोड इंडस्ट्रियल प्लॉट',
    'व्हाइटफील्ड विला बेंगलुरु'
  ] : [
    '3 BHK in Greater Noida',
    'Commercial Office Cyber City Gurugram',
    '12 Bigha Agri Land Jewar Airport',
    'Industrial Plot 100 ft Road',
    'Luxury Villa Whitefield Bengaluru'
  ];

  // Start speech recognition when modal opens
  useEffect(() => {
    if (!isOpen) {
      stopListening();
      setTranscript('');
      setInterimText('');
      setErrorMessage(null);
      setIsSearching(false);
      return;
    }

    startListening();

    return () => {
      stopListening();
    };
  }, [isOpen, speechLang]);

  const startListening = () => {
    setErrorMessage(null);
    setTranscript('');
    setInterimText('');
    setIsSearching(false);

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setErrorMessage(
        language === 'hi'
          ? 'आपके ब्राउज़र में वॉइस सर्च समर्थित नहीं है। नीचे दिए गए सुझावों पर क्लिक करें।'
          : 'Web Speech API is not supported in this browser. You can click on the suggested voice queries below.'
      );
      setIsListening(false);
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = speechLang;

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMessage(null);
      };

      recognition.onresult = (event: any) => {
        let currentInterim = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            currentInterim += event.results[i][0].transcript;
          }
        }

        if (currentInterim) {
          setInterimText(currentInterim);
        }

        if (finalTranscript) {
          setTranscript(finalTranscript);
          setInterimText('');
          handleFinalSearch(finalTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setErrorMessage(
            language === 'hi'
              ? 'माइक्रोफ़ोन की अनुमति अस्वीकृत है। कृपया ब्राउज़र सेटिंग्स में माइक्रोफ़ोन चालू करें।'
              : 'Microphone access was denied. Please allow microphone permissions in your browser bar.'
          );
        } else if (event.error === 'no-speech') {
          setErrorMessage(
            language === 'hi'
              ? 'कोई आवाज़ सुनाई नहीं दी। कृपया पुनः बोलें या सुझाव चुनें।'
              : 'No speech was detected. Please try speaking again or click a popular voice suggestion.'
          );
        } else {
          setErrorMessage(`Voice input error: ${event.error}`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      setIsListening(false);
      setErrorMessage('Could not initialize speech recognition.');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
      recognitionRef.current = null;
    }
    setIsListening(false);
  };

  const handleFinalSearch = (queryText: string) => {
    setIsSearching(true);
    stopListening();
    setTimeout(() => {
      onTranscriptComplete(queryText);
      onClose();
    }, 700);
  };

  const handleSelectQuery = (q: string) => {
    setTranscript(q);
    handleFinalSearch(q);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-navy-950/75 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div
        className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-navy-900/10 text-center relative overflow-hidden animate-scaleIn select-none"
        role="dialog"
        aria-modal="true"
        aria-label="Voice Search"
      >
        {/* Top Bar with Language Toggle & Close Button */}
        <div className="flex items-center justify-between mb-4">
          {/* Language Switcher */}
          <button
            type="button"
            onClick={() => setSpeechLang(prev => (prev === 'en-IN' ? 'hi-IN' : 'en-IN'))}
            className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 hover:bg-[#D92228] hover:text-white text-gray-900 rounded-full text-xs font-bold transition-all cursor-pointer border border-gray-200"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{speechLang === 'en-IN' ? 'English (India)' : 'हिन्दी (भारत)'}</span>
          </button>

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
            ? (language === 'hi' ? 'सर्च हो रहा है...' : 'Searching Properties...')
            : isListening
            ? (language === 'hi' ? 'बोलिए, हम सुन रहे हैं...' : 'Listening... Speak Now')
            : (language === 'hi' ? 'वॉइस सर्च' : 'Voice Search')}
        </h3>

        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          {language === 'hi'
            ? 'प्रॉपर्टी का प्रकार, शहर, इलाका या सड़क चौड़ाई बोलें'
            : 'Speak property type, locality, city, or road width'}
        </p>

        {/* Animated Pulse Ring & Equalizer Display */}
        <div className="my-7 flex flex-col items-center justify-center relative">
          {/* Outer Ripple Rings when Listening */}
          {isListening && (
            <>
              <span className="absolute w-36 h-36 rounded-full bg-[#D92228]/15 animate-ping" />
              <span className="absolute w-28 h-28 rounded-full bg-[#D92228]/25 animate-pulse" />
            </>
          )}

          {/* Center Mic Button */}
          <button
            type="button"
            onClick={() => {
              if (isListening) stopListening();
              else startListening();
            }}
            className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-xl cursor-pointer ${
              isSearching
                ? 'bg-emerald-600 text-white scale-105'
                : isListening
                ? 'bg-[#D92228] text-white hover:bg-[#BF1E23] scale-110 shadow-red-600/40'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            aria-label={isListening ? 'Stop Listening' : 'Start Listening'}
          >
            {isSearching ? (
              <CheckCircle2 className="w-9 h-9 animate-bounce" />
            ) : isListening ? (
              <Mic className="w-9 h-9 animate-pulse" />
            ) : (
              <MicOff className="w-9 h-9" />
            )}
          </button>

          {/* Equalizer Sound Waves Bars */}
          {isListening && (
            <div className="flex items-center gap-1.5 mt-5 h-8">
              {[60, 100, 40, 80, 50, 90, 70].map((h, i) => (
                <span
                  key={i}
                  className="w-1.5 bg-[#D92228] rounded-full transition-all duration-150 animate-pulse"
                  style={{
                    height: `${Math.max(12, h * 0.32)}px`,
                    animationDelay: `${i * 120}ms`
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Live Speech Transcript / Interim Text */}
        <div className="min-h-[56px] px-4 py-2.5 bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-center">
          {transcript || interimText ? (
            <p className="text-base sm:text-lg font-bold text-gray-950 flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-[#D92228] shrink-0 animate-pulse" />
              <span>"{transcript || interimText}"</span>
            </p>
          ) : isListening ? (
            <p className="text-sm font-semibold text-[#D92228] italic flex items-center gap-1.5 animate-pulse">
              <Sparkles className="w-4 h-4" />
              <span>
                {language === 'hi'
                  ? 'जैसे बोलें: "3 बीएचके ग्रेटर नोएडा"'
                  : 'Say e.g.: "3 BHK in Greater Noida"'}
              </span>
            </p>
          ) : (
            <p className="text-xs sm:text-sm text-gray-500">
              {language === 'hi' ? 'माइक्रोफ़ोन पर टैप करके बोलें' : 'Tap the microphone above to speak'}
            </p>
          )}
        </div>

        {/* Error Notification if any */}
        {errorMessage && (
          <div className="mt-3 p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 font-medium">
            {errorMessage}
          </div>
        )}

        {/* 1-Tap Popular Voice Prompts */}
        <div className="mt-5 text-left">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            <span>{language === 'hi' ? 'लोकप्रिय वॉइस सुझाव (टैप करें):' : 'Popular Voice Suggestions (Tap to Search):'}</span>
          </p>

          <div className="flex flex-wrap gap-1.5">
            {popularVoiceQueries.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectQuery(q)}
                className="px-3 py-1.5 bg-gray-100 hover:bg-[#D92228] hover:text-white text-gray-900 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 border border-gray-200 shadow-xs group"
              >
                <Mic className="w-3 h-3 text-[#D92228] group-hover:text-white" />
                <span>{q}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-100 font-bold rounded-xl text-sm transition-colors cursor-pointer"
          >
            {language === 'hi' ? 'रद्द करें' : 'Cancel'}
          </button>

          {(transcript || interimText) && (
            <button
              type="button"
              onClick={() => handleFinalSearch(transcript || interimText)}
              className="flex-1 py-2.5 bg-[#D92228] hover:bg-[#BF1E23] text-white font-extrabold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>{language === 'hi' ? 'अभी खोजें' : 'Search Now'}</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};