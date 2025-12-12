import { GoogleGenAI } from "@google/genai";
import { SubmissionRecord, AgeGroup } from '../types';

// Helper to safely get the AI client
const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please configure it in your Vercel project settings.");
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeGenderData = async (records: SubmissionRecord[]): Promise<string> => {
  try {
    const ai = getAiClient(); // Initialize here instead of top-level
    
    // 1. Aggregating data for the prompt to keep it concise
    const summary = records.reduce((acc, record) => {
      record.data.forEach(d => {
        if (!acc[d.ageGroup]) {
          acc[d.ageGroup] = { male: 0, female: 0 };
        }
        acc[d.ageGroup].male += d.male;
        acc[d.ageGroup].female += d.female;
      });
      return acc;
    }, {} as Record<string, { male: number; female: number }>);

    const totalOffices = new Set(records.map(r => r.officeName)).size;

    const prompt = `
      You are a specialized Gender and Development (GAD) Data Analyst.
      Analyze the following aggregated database statistics.
      
      Data Source Scope:
      - Total Submissions: ${records.length}
      - Contributing Offices: ${totalOffices}
      
      Aggregated Demographic Data (Age Group -> Counts):
      ${JSON.stringify(summary, null, 2)}
      
      Please provide a strategic GAD analysis report in Markdown format.
      Include:
      1. **Executive Summary**: Brief overview of the gender balance.
      2. **Key Trends**: Notable gaps or patterns in specific age groups (e.g., Youth Bulge, Senior Care needs).
      3. **Recommendations**: 2-3 specific policy or program interventions based on these numbers (e.g., if there are more women in the senior bracket, suggest specialized senior healthcare).
      
      Keep the tone professional, objective, and constructive.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 } // Basic analysis, speed preferred
      }
    });

    return response.text || "No analysis could be generated at this time.";

  } catch (error: any) {
    console.error("Gemini analysis failed:", error);
    return `Analysis Failed: ${error.message || "Unknown error"}. Please check your API key configuration.`;
  }
};