'use server';

/**
 * @fileOverview A voice-controlled status update flow for the GuardianAngel AI project.
 *
 * - getSensorSummary - A function that generates a summary of current sensor readings based on voice command.
 * - GetSensorSummaryInput - The input type for the getSensorSummary function.
 * - GetSensorSummaryOutput - The return type for the getSensorSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetSensorSummaryInputSchema = z.object({
  voiceCommand: z.string().describe('The voice command from the user requesting a sensor summary.'),
  sensorData: z.record(z.string(), z.any()).describe('The latest readings from all environmental sensors.'),
});
export type GetSensorSummaryInput = z.infer<typeof GetSensorSummaryInputSchema>;

const GetSensorSummaryOutputSchema = z.object({
  summary: z.string().describe('A summary of the current sensor readings.'),
});
export type GetSensorSummaryOutput = z.infer<typeof GetSensorSummaryOutputSchema>;

export async function getSensorSummary(input: GetSensorSummaryInput): Promise<GetSensorSummaryOutput> {
  return getSensorSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getSensorSummaryPrompt',
  input: {schema: GetSensorSummaryInputSchema},
  output: {schema: GetSensorSummaryOutputSchema},
  prompt: `You are Nova, a helpful and empathetic AI assistant in a smart home environment.
  A user has requested a summary of the current sensor readings via voice command.
  Using the sensor data provided, create a concise and easy-to-understand summary of the current environmental status for the user.

  Voice Command: {{{voiceCommand}}}

  Sensor Data: {{{sensorData}}}

  Summary:`, 
});

const getSensorSummaryFlow = ai.defineFlow(
  {
    name: 'getSensorSummaryFlow',
    inputSchema: GetSensorSummaryInputSchema,
    outputSchema: GetSensorSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
