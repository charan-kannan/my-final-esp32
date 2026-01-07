'use server';

/**
 * @fileOverview Flow for sending an alert notification when a sensor detects danger.
 *
 * - sendAlertNotification - A function that sends a danger alert.
 * - SendAlertNotificationInput - The input type for the sendAlertNotification function.
 * - SendAlertNotificationOutput - The return type for the sendAlertNotification function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SendAlertNotificationInputSchema = z.object({
  userEmail: z.string().email().describe('The email address of the user to notify.'),
  sensorType: z.string().describe('The type of sensor that triggered the alert.'),
  sensorValue: z.number().describe('The value of the sensor reading.'),
  unit: z.string().describe('The unit of the sensor reading.'),
});
export type SendAlertNotificationInput = z.infer<typeof SendAlertNotificationInputSchema>;

const SendAlertNotificationOutputSchema = z.object({
  success: z.boolean().describe('Whether the notification was sent successfully.'),
  message: z.string().describe('A summary of the notification sent.'),
});
export type SendAlertNotificationOutput = z.infer<typeof SendAlertNotificationOutputSchema>;


export async function sendAlertNotification(
  input: SendAlertNotificationInput
): Promise<SendAlertNotificationOutput> {
  return sendAlertNotificationFlow(input);
}


const sendAlertNotificationPrompt = ai.definePrompt({
    name: 'sendAlertNotificationPrompt',
    input: { schema: SendAlertNotificationInputSchema },
    prompt: `
      You are an AI security system for a smart home.
      A sensor has detected a dangerous reading.
      Generate a concise subject line and a clear, urgent email body to alert the user.

      User Email: {{{userEmail}}}
      Sensor: {{{sensorType}}}
      Reading: {{{sensorValue}}} {{{unit}}}

      Subject: URGENT: Danger Alert for {{sensorType}} Sensor
      
      Body:
      Attention!

      Your HAZARDAVERT AI system has detected a DANGEROUS level for the following sensor:

      - Sensor: {{{sensorType}}}
      - Reading: {{{sensorValue}}} {{{unit}}}

      Please take immediate action and check the affected area.

      - HAZARDAVERT AI
    `,
});

const sendAlertNotificationFlow = ai.defineFlow(
  {
    name: 'sendAlertNotificationFlow',
    inputSchema: SendAlertNotificationInputSchema,
    outputSchema: SendAlertNotificationOutputSchema,
  },
  async (input) => {
    // In a real application, this is where you would integrate with an email service
    // like SendGrid, Nodemailer, etc. For this simulation, we'll generate the content
    // and log it to the console as if it were sent.
    
    const { text } = await sendAlertNotificationPrompt(input);
    
    console.log("--- SIMULATING EMAIL ALERT ---");
    console.log(`To: ${input.userEmail}`);
    console.log(text);
    console.log("----------------------------");

    return {
      success: true,
      message: `Simulated email alert sent to ${input.userEmail} for ${input.sensorType} sensor.`,
    };
  }
);
