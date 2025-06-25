'use server';
/**
 * @fileOverview A flow to generate financial details for a loan, including principal, margin, and a virtual account.
 *
 * - generateFinancialDetails - Generates financial details for a loan.
 * - GenerateFinancialDetailsInput - The input type for the flow.
 * - GenerateFinancialDetailsOutput - The output type for the flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const GenerateFinancialDetailsInputSchema = z.object({
  loanId: z.string().describe("The unique ID of the loan."),
  studentName: z.string().describe("The full name of the student."),
  lpkName: z.string().describe("The name of the LPK."),
  totalAmount: z.string().describe("The total loan amount, e.g., 'Rp 50.000.000'."),
  bank: z.string().describe("The destination bank, e.g., BCA, Mandiri, BNI."),
});
export type GenerateFinancialDetailsInput = z.infer<typeof GenerateFinancialDetailsInputSchema>;

const GenerateFinancialDetailsOutputSchema = z.object({
  principal: z.string().describe("The calculated principal amount of the loan, formatted as 'Rp X.XXX.XXX'."),
  margin: z.string().describe("The calculated margin amount of the loan, formatted as 'Rp X.XXX.XXX'."),
  virtualAccountNumber: z.string().describe("The generated 16-digit virtual account number."),
});
export type GenerateFinancialDetailsOutput = z.infer<typeof GenerateFinancialDetailsOutputSchema>;

export async function generateFinancialDetails(input: GenerateFinancialDetailsInput): Promise<GenerateFinancialDetailsOutput> {
  return generateFinancialDetailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFinancialDetailsPrompt',
  input: {schema: GenerateFinancialDetailsInputSchema},
  output: {schema: GenerateFinancialDetailsOutputSchema},
  prompt: `You are a financial analyst and virtual account generation API for an Indonesian bank.
Your task is to perform two actions:
1.  Calculate the principal and margin for a loan. A standard split is 90% for the principal and 10% for the margin. Use this as your default unless context suggests otherwise.
2.  Create a unique virtual account number based on the provided details.

Loan Details:
- Loan ID: {{loanId}}
- Student Name: {{studentName}}
- LPK Name: {{lpkName}}
- Total Amount: {{totalAmount}}
- Bank: {{bank}}

Rules for VA generation:
- The VA number must be 16 digits long.
- The first 4 or 5 digits should be a prefix for the bank (e.g., 8808 for Bank Permata, 70012 for Mandiri, 014 for BCA, 009 for BNI).
- The remaining digits should be a unique combination derived from the loan ID.
- Ensure the final VA output is a string containing only numbers.

Rules for Financial Calculation:
- Calculate the principal as 90% of the total amount.
- Calculate the margin as 10% of the total amount.
- Format both principal and margin as a string with 'Rp' prefix and Indonesian thousand separators (e.g., "Rp 45.000.000").

Generate the financial details for this loan for {{bank}}.`,
});

const generateFinancialDetailsFlow = ai.defineFlow(
  {
    name: 'generateFinancialDetailsFlow',
    inputSchema: GenerateFinancialDetailsInputSchema,
    outputSchema: GenerateFinancialDetailsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
