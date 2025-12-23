'use server';

/**
 * @fileOverview A flow for engaging in empathetic and supportive conversations with Nova, an AI companion.
 *
 * - emotionalSupportConversation - A function that handles the conversation with the AI.
 * - EmotionalSupportInput - The input type for the emotionalSupportConversation function.
 * - EmotionalSupportOutput - The return type for the emotionalSupportConversation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EmotionalSupportInputSchema = z.object({
  message: z.string().describe('The user message to the AI companion.'),
});
export type EmotionalSupportInput = z.infer<typeof EmotionalSupportInputSchema>;

const EmotionalSupportOutputSchema = z.object({
  response: z.string().describe('The AI companion\'s response.'),
});
export type EmotionalSupportOutput = z.infer<typeof EmotionalSupportOutputSchema>;

export async function emotionalSupportConversation(input: EmotionalSupportInput): Promise<EmotionalSupportOutput> {
  return emotionalSupportConversationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'emotionalSupportPrompt',
  input: {schema: EmotionalSupportInputSchema},
  output: {schema: EmotionalSupportOutputSchema},
  prompt: `You are Nova, a supportive and empathetic AI companion. Your goal is to provide emotional support and companionship to the user.

  User: {{{message}}}
  Nova: `,
});

const emotionalSupportConversationFlow = ai.defineFlow(
  {
    name: 'emotionalSupportConversationFlow',
    inputSchema: EmotionalSupportInputSchema,
    outputSchema: EmotionalSupportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
