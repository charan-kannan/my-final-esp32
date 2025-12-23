'use server';
/**
 * @fileOverview Flow for providing personalized safety recommendations based on sensor readings and user profile.
 *
 * - personalizedSafetyRecommendations - A function that generates personalized safety recommendations.
 * - PersonalizedSafetyRecommendationsInput - The input type for the personalizedSafetyRecommendations function.
 * - PersonalizedSafetyRecommendationsOutput - The return type for the personalizedSafetyRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedSafetyRecommendationsInputSchema = z.object({
  sensorReadings: z.record(z.string(), z.any()).describe('A record of sensor readings, where keys are sensor names and values are the sensor readings.'),
  userProfile: z.object({
    healthConditions: z.string().describe('The user health conditions.'),
    age: z.number().describe('The user age.'),
    lifestyle: z.string().describe('The user lifestyle.'),
  }).describe('The user profile including health conditions, age, and lifestyle.'),
});

export type PersonalizedSafetyRecommendationsInput = z.infer<typeof PersonalizedSafetyRecommendationsInputSchema>;

const PersonalizedSafetyRecommendationsOutputSchema = z.object({
  recommendations: z.array(z.string()).describe('A list of personalized safety recommendations based on the sensor readings and user profile.'),
});

export type PersonalizedSafetyRecommendationsOutput = z.infer<typeof PersonalizedSafetyRecommendationsOutputSchema>;

export async function personalizedSafetyRecommendations(input: PersonalizedSafetyRecommendationsInput): Promise<PersonalizedSafetyRecommendationsOutput> {
  return personalizedSafetyRecommendationsFlow(input);
}

const personalizedSafetyRecommendationsPrompt = ai.definePrompt({
  name: 'personalizedSafetyRecommendationsPrompt',
  input: {schema: PersonalizedSafetyRecommendationsInputSchema},
  output: {schema: PersonalizedSafetyRecommendationsOutputSchema},
  prompt: `You are Nova, a helpful AI assistant that provides personalized safety recommendations based on sensor readings and user profiles.

  Given the following sensor readings:
  {{#each sensorReadings}}
  - {{@key}}: {{this}}
  {{/each}}

  And the following user profile:
  - Health Conditions: {{userProfile.healthConditions}}
  - Age: {{userProfile.age}}
  - Lifestyle: {{userProfile.lifestyle}}

  Provide a list of personalized safety recommendations to ensure the user safety and well-being. Be empathetic, conversational, supportive, and proactive.
  Format recommendations as a numbered list.
  `,
});

const personalizedSafetyRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedSafetyRecommendationsFlow',
    inputSchema: PersonalizedSafetyRecommendationsInputSchema,
    outputSchema: PersonalizedSafetyRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await personalizedSafetyRecommendationsPrompt(input);
    return output!;
  }
);
