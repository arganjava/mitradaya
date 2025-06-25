'use server';
/**
 * @fileOverview A flow to generate a virtual account number.
 *
 * - generateVirtualAccount - Generates a virtual account number.
 * - GenerateVAInput - The input type for the flow.
 * - GenerateVAOutput - The output type for the flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const GenerateVAInputSchema = z.object({
  studentName: z.string().describe("The full name of the student."),
  loanId: z.string().describe("The unique ID of the loan."),
  bank: z.string().describe("The destination bank, e.g., BCA, Mandiri."),
});
export type GenerateVAInput = z.infer<typeof GenerateVAInputSchema>;

export const GenerateVAOutputSchema = z.object({
  virtualAccountNumber: z.string().describe("The generated virtual account number."),
});
export type GenerateVAOutput = z.infer<typeof GenerateVAOutputSchema>;

export async function generateVirtualAccount(input: GenerateVAInput): Promise<GenerateVAOutput> {
  return generateVAFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateVAPrompt',
  input: {schema: GenerateVAInputSchema},
  output: {schema: GenerateVAOutputSchema},
  prompt: `You are a virtual account generation API for an Indonesian bank.
Your task is to create a unique virtual account number based on the provided details.

Bank: {{bank}}
Student Name: {{studentName}}
Loan ID: {{loanId}}

Rules for VA generation:
- The VA number must be 16 digits long.
- The first 4 or 5 digits should be a prefix for the bank (e.g., 8808 for Bank Permata, 70012 for Mandiri).
- The remaining digits should be a unique combination derived from the loan ID and student name, but it should look like a plausible, numeric-only account number. Do not include any characters from the names.
- Ensure the final output is a string containing only numbers.

Generate a {{bank}} Virtual Account number.`,
});

const generateVAFlow = ai.defineFlow(
  {
    name: 'generateVAFlow',
    inputSchema: GenerateVAInputSchema,
    outputSchema: GenerateVAOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
