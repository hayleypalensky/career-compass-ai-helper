
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

export const aiService = {
  async generateSummary(currentSummary: string, jobDescription: string, relevantSkills: string[]): Promise<string[]> {
    try {
      const { data, error } = await supabase.functions.invoke('generate-summary', {
        body: {
          currentSummary,
          jobDescription,
          relevantSkills
        }
      });

      if (error) throw error;
      return data.suggestions;
    } catch (error) {
      console.error('Error generating summary:', error);
      throw new Error('Failed to generate summary suggestions');
    }
  },

  async generateBulletPoints(currentBullet: string, jobTitle: string, jobDescription: string, relevantSkills: string[]): Promise<string[]> {
    try {
      const { data, error } = await supabase.functions.invoke('generate-bullets', {
        body: {
          currentBullet,
          jobTitle,
          jobDescription,
          relevantSkills
        }
      });

      if (error) throw error;
      return data.suggestions;
    } catch (error) {
      console.error('Error generating bullet points:', error);
      throw new Error('Failed to generate bullet point suggestions');
    }
  },

  async suggestSkills(jobDescription: string, currentSkills: string[]): Promise<string[]> {
    try {
      const { data, error } = await supabase.functions.invoke('suggest-skills', {
        body: {
          jobDescription,
          currentSkills
        }
      });

      if (error) throw error;
      return data.suggestedSkills;
    } catch (error) {
      console.error('Error suggesting skills:', error);
      throw new Error('Failed to suggest skills');
    }
  }
};
