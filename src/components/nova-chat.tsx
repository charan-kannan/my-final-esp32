"use client";

import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Mic, Send, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { emotionalSupportConversation } from '@/ai/flows/emotional-support-conversations';
import { getSensorSummary } from '@/ai/flows/voice-controlled-status-updates';
import { useSensorData } from '@/hooks/use-sensor-data';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'nova';
}

export function NovaChat() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hello! How are you feeling today?", sender: 'nova' },
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const { sensors } = useSensorData();

  const handleSend = async () => {
    if (input.trim() === '') return;

    const newUserMessage: Message = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, newUserMessage]);
    setInput('');
    setIsThinking(true);

    let response: string;
    try {
      if (input.toLowerCase().includes('status update')) {
        const sensorDataObject = sensors.reduce((acc, sensor) => {
            acc[sensor.type] = `${sensor.value.toFixed(2)} ${sensor.unit}`;
            return acc;
        }, {} as Record<string, string>);
        const res = await getSensorSummary({ voiceCommand: input, sensorData: sensorDataObject });
        response = res.summary;
      } else {
        const res = await emotionalSupportConversation({ message: input });
        response = res.response;
      }
    } catch (error) {
        console.error("AI flow error:", error);
        response = "I'm having a little trouble connecting right now. Please try again in a moment.";
    }


    const newNovaMessage: Message = { id: Date.now() + 1, text: response, sender: 'nova' };
    setMessages(prev => [...prev, newNovaMessage]);
    setIsThinking(false);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full text-primary hover:text-primary hover:bg-primary/10 relative">
          <Bot className="h-5 w-5" />
          <span className="absolute top-0 right-0 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
          </span>
          <span className="sr-only">Toggle Nova AI</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-primary">
            <Bot /> Nova - Your Personal Companion
          </SheetTitle>
        </SheetHeader>
        <div className="flex-1 flex flex-col justify-between h-[calc(100%-4rem)]">
          <ScrollArea className="flex-1 p-4 -mx-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={cn('flex items-start gap-3', message.sender === 'user' ? 'justify-end' : 'justify-start')}>
                  {message.sender === 'nova' && (
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
                    <Avatar className="h-8 w-8 border-2 border-primary">
                      <AvatarFallback>
                        <Bot className="text-primary" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-muted rounded-lg p-3 text-sm flex items-end gap-1 h-10">
                        <div className="w-1 bg-primary/80 rounded-full animate-sound-wave [animation-delay:-0.4s]" style={{height: '80%'}}></div>
                        <div className="w-1 bg-primary/80 rounded-full animate-sound-wave [animation-delay:-0.2s]" style={{height: '100%'}}></div>
                        <div className="w-1 bg-primary/80 rounded-full animate-sound-wave" style={{height: '60%'}}></div>
                        <div className="w-1 bg-primary/80 rounded-full animate-sound-wave [animation-delay:-0.3s]" style={{height: '90%'}}></div>
                        <div className="w-1 bg-primary/80 rounded-full animate-sound-wave [animation-delay:-0.1s]" style={{height: '70%'}}></div>
                    </div>
                </div>
              )}
            </div>
          </ScrollArea>
          <div className="flex items-center gap-2 border-t pt-4">
            <Button variant="ghost" size="icon" disabled>
              <Mic className="h-5 w-5" />
            </Button>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Talk to Nova..."
              className="flex-1"
              disabled={isThinking}
            />
            <Button onClick={handleSend} size="icon" disabled={isThinking}>
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
