"use client";

import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Mic, Send, User, Volume2, VolumeX } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { emotionalSupportConversation } from '@/ai/flows/emotional-support-conversations';
import { getSensorSummary } from '@/ai/flows/voice-controlled-status-updates';
import { textToSpeech } from '@/ai/flows/text-to-speech';
import { SENSOR_TYPES, SENSOR_THRESHOLDS } from '@/lib/constants';
import { VoiceListeningUI } from './voice-listening-ui';
import type { SensorData } from '@/lib/types';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'friday';
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

// Function to get current sensor data when needed
const getCurrentSensorData = (): SensorData[] => {
    return SENSOR_TYPES.map((type, index) => {
      const { min, max, unit } = SENSOR_THRESHOLDS[type];
      // Simulate some value fluctuation for realism
      const value = min + (max - min) * (0.4 + Math.random() * 0.2); 
      return {
        id: index,
        type: type,
        value: value,
        unit: unit,
        riskLevel: 'SAFE', // Simplified for this context
        history: [],
        min,
        max,
      };
    });
  };

export function NovaChat() {
  const [messages, setMessages] = useState<Message[]>(() => [
    { id: 1, text: "Good day. I am F.R.I.D.A.Y. How can I assist you?", sender: 'friday' },
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isListeningView, setIsListeningView] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const recognitionRef = useRef<any>(null);

  const handleSend = async (messageText: string) => {
    if (messageText.trim() === '') return;

    const newUserMessage: Message = { id: Date.now(), text: messageText, sender: 'user' };
    setMessages(prev => [...prev, newUserMessage]);
    setInput('');
    setIsThinking(true);

    let response: string;
    try {
      if (messageText.toLowerCase().includes('status update')) {
        const sensorData = getCurrentSensorData();
        const sensorDataObject = sensorData.reduce((acc, sensor) => {
            acc[sensor.type] = `${sensor.value.toFixed(2)} ${sensor.unit}`;
            return acc;
        }, {} as Record<string, string>);
        const res = await getSensorSummary({ voiceCommand: messageText, sensorData: sensorDataObject });
        response = res.summary;
      } else {
        const res = await emotionalSupportConversation({ message: messageText });
        response = res.response;
      }
    } catch (error) {
        console.error("AI flow error:", error);
        response = "I'm having a little trouble connecting right now. Please try again in a moment.";
    }

    setIsThinking(false);
    const newFridayMessage: Message = { id: Date.now() + 1, text: response, sender: 'friday' };
    setMessages(prev => [...prev, newFridayMessage]);
    
    playAudio(response);
  };
  
  const playAudio = async (text: string) => {
    if (!isAudioEnabled) return;
    try {
      const { audio } = await textToSpeech({ text });
      setAudioUrl(audio);
    } catch(e) {
      console.error("Error generating speech", e);
    }
  }
  
  // This effect runs only once on mount to play the initial greeting
  useEffect(() => {
    playAudio("Good day. I am F.R.I.D.A.Y. How can I assist you?");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setIsListeningView(false); // Close listening view on result
        handleSend(transcript); // Automatically send the transcript
      };

      recognitionRef.current.onerror = (event: any) => {
        if (event.error !== 'no-speech') {
          console.error("Speech recognition error", event.error);
        }
        setIsListeningView(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsListeningView(false);
      };
    }
  }, []);

  useEffect(() => {
    if (audioUrl && audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play().catch(e => console.error("Audio playback failed", e));
    }
  }, [audioUrl]);

  const handleTextInputSend = () => {
    handleSend(input);
  }
  
  const handleMicClick = () => {
    if (recognitionRef.current) {
      setIsListeningView(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListeningView(false);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full text-primary hover:text-primary hover:bg-primary/10 relative">
          <Bot className="h-5 w-5" />
          <span className="absolute top-0 right-0 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
          </span>
          <span className="sr-only">Toggle F.R.I.D.A.Y. AI</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="h-4/5 max-h-[800px] w-[90vw] max-w-[600px] flex flex-col bg-cyber-gray/80 backdrop-blur-lg border-primary/50">
        {isListeningView ? (
          <div className="flex flex-col items-center justify-center w-full h-full">
            <VoiceListeningUI stopListening={stopListening} />
          </div>
        ) : (
          <>
            <DialogHeader className="flex-row justify-between items-center">
              <DialogTitle className="flex items-center gap-2 text-primary">
                <Bot /> F.R.I.D.A.Y. - Your Personal Companion
              </DialogTitle>
              <Button variant="ghost" size="icon" onClick={() => setIsAudioEnabled(!isAudioEnabled)}>
                    {isAudioEnabled ? <Volume2 className="h-5 w-5"/> : <VolumeX className="h-5 w-5"/>}
                    <span className="sr-only">{isAudioEnabled ? 'Disable Audio' : 'Enable Audio'}</span>
                </Button>
            </DialogHeader>
            <div className="flex-1 flex flex-col justify-between h-full min-h-0">
              <ScrollArea className="flex-1 p-4 -mx-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className={cn('flex items-start gap-3', message.sender === 'user' ? 'justify-end' : 'justify-start')}>
                      {message.sender === 'friday' && (
                        <Avatar className="h-8 w-8 border-2 border-primary">
                          <AvatarFallback>
                            <Bot className="text-primary" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div className={cn('max-w-[75%] rounded-lg p-3 text-sm', message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                        <p>{message.text}</p>
                      </div>
                      {message.sender === 'user' && (
                        <Avatar className="h-8 w-8 border-2 border-muted-foreground">
                          <AvatarFallback>
                            <User />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}
                  {isThinking && (
                    <div className="flex items-start gap-3 justify-start">
                        <Avatar className="h-8 w-8 border-2 border-primary animate-pulse-glow">
                          <AvatarFallback className="bg-transparent">
                            <Bot className="text-primary" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="bg-muted rounded-lg p-3 text-sm flex items-end gap-1 h-10">
                            <div className="w-1 bg-primary/80 rounded-full animate-sound-wave [animation-delay:-0.4s]" style={{height: '80%'}}></div>
                            <div className="w-1 bg-primary/80 rounded-full animate-sound-wave [animation-delay:-0.2s]" style={{height: '100%'}}></div>
                            <div className="w-1 bg-primary/80 rounded-full animate-sound-wave" style={{height: '60%'}}></div>
                        </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
              <div className="flex items-center gap-2 border-t pt-4">
                <Button variant="ghost" size="icon" onClick={handleMicClick} disabled={!recognitionRef.current || isThinking}>
                  <Mic className="h-5 w-5" />
                </Button>
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleTextInputSend()}
                  placeholder="Talk to F.R.I.D.A.Y...."
                  className="flex-1"
                  disabled={isThinking}
                />
                <Button onClick={handleTextInputSend} size="icon" disabled={isThinking}>
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </>
        )}
        <audio ref={audioRef} />
      </DialogContent>
    </Dialog>
  );
}
