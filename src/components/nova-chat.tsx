"use client";

import { useState, useRef, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Mic, Send, User, Volume2, VolumeX } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { emotionalSupportConversation } from '@/ai/flows/emotional-support-conversations';
import { getSensorSummary } from '@/ai/flows/voice-controlled-status-updates';
import { textToSpeech } from '@/ai/flows/text-to-speech';
import { useSensorData } from '@/hooks/use-sensor-data';
import { VoiceListeningUI } from './voice-listening-ui';

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

export function NovaChat() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Good day. I am F.R.I.D.A.Y. How can I assist you?", sender: 'friday' },
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isListeningView, setIsListeningView] = useState(false);
  const [initialGreetingPlayed, setInitialGreetingPlayed] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const recognitionRef = useRef<any>(null);
  const { sensors: latestSensors } = useSensorData(); // Get the latest sensor data when needed

  const playAudio = async (text: string) => {
    if (!isAudioEnabled) return;
    try {
      const { audio } = await textToSpeech({ text });
      setAudioUrl(audio);
    } catch(e) {
      console.error("Error generating speech", e);
    }
  }

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListeningView(false); // Close listening view on result
      };

      recognitionRef.current.onerror = (event: any) => {
        // The 'no-speech' error is common if the user doesn't say anything.
        // We can handle it gracefully without logging a console error.
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
        audioRef.current.play().catch(e => console.error("Audio playback failed", e));
    }
  }, [audioUrl]);
  
  useEffect(() => {
    // Play the initial greeting only once when the component mounts
    if (!initialGreetingPlayed) {
      playAudio(messages[0].text);
      setInitialGreetingPlayed(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSend = async () => {
    if (input.trim() === '') return;

    const newUserMessage: Message = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, newUserMessage]);
    const currentInput = input;
    setInput('');
    setIsThinking(true);
    setAudioUrl(null); // Clear previous audio

    let response: string;
    try {
      if (currentInput.toLowerCase().includes('status update')) {
        // Fetch the latest sensor data only when needed
        const sensorDataObject = latestSensors.reduce((acc, sensor) => {
            acc[sensor.type] = `${sensor.value.toFixed(2)} ${sensor.unit}`;
            return acc;
        }, {} as Record<string, string>);
        const res = await getSensorSummary({ voiceCommand: currentInput, sensorData: sensorDataObject });
        response = res.summary;
      } else {
        const res = await emotionalSupportConversation({ message: currentInput });
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
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full text-primary hover:text-primary hover:bg-primary/10 relative">
            <Bot className="h-5 w-5" />
            <span className="absolute top-0 right-0 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            <span className="sr-only">Toggle F.R.I.D.A.Y. AI</span>
          </Button>
        </SheetTrigger>
        <SheetContent className="flex flex-col">
          <SheetHeader className="flex-row justify-between items-center">
            <SheetTitle className="flex items-center gap-2 text-primary">
              <Bot /> F.R.I.D.A.Y. - Your Personal Companion
            </SheetTitle>
            <Button variant="ghost" size="icon" onClick={() => setIsAudioEnabled(!isAudioEnabled)}>
                  {isAudioEnabled ? <Volume2 className="h-5 w-5"/> : <VolumeX className="h-5 w-5"/>}
                  <span className="sr-only">{isAudioEnabled ? 'Disable Audio' : 'Enable Audio'}</span>
              </Button>
          </SheetHeader>
          <div className="flex-1 flex flex-col justify-between h-[calc(100%-4rem)]">
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
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Talk to F.R.I.D.A.Y...."
                className="flex-1"
                disabled={isThinking}
              />
              <Button onClick={handleSend} size="icon" disabled={isThinking}>
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
          {audioUrl && <audio ref={audioRef} src={audioUrl} />}
        </SheetContent>
      </Sheet>
      {isListeningView && <VoiceListeningUI stopListening={stopListening} />}
    </>
  );
}
