import { createClient } from '@supabase/supabase-js';
import { Profile } from '@/types/profile';

const supabase = createClient(
  'https://ilrrxwkxrbgslpifkdlf.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlscnJ4d2t4cmJnc2xwaWZrZGxmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3NTY3MTYsImV4cCI6MjA2MzMzMjcxNn0.pKX2Uzg7DT3H5v7OhUXySAuktLCwk05Rm3ZB3_-XaJ4'
);

export const aiService = {
  async generateSummary(currentSummary: string, jobDescription: string, relevantSkills: string[]): Promise<string[]> {
    try {
      console.log('Calling generate-summary function with:', {
        hasCurrentSummary: !!currentSummary,
        hasJobDescription: !!jobDescription,
        relevantSkillsCount: relevantSkills.length
      });

      const { data, error } = await supabase.functions.invoke('generate-summary', {
        body: {
          currentSummary,
          jobDescription,
          relevantSkills
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }
      
      console.log('Summary generation response:', data);
      return data.suggestions || [];
    } catch (error) {
      console.error('Error generating summary:', error);
      throw new Error('Failed to generate summary suggestions');
    }
  },

  async generateBulletPoints(currentBullet: string, jobTitle: string, jobDescription: string, relevantSkills: string[]): Promise<string[]> {
    try {
      console.log('Calling generate-bullets function with:', {
        currentBullet,
        jobTitle,
        hasJobDescription: !!jobDescription,
        relevantSkillsCount: relevantSkills.length
      });

      const { data, error } = await supabase.functions.invoke('generate-bullets', {
        body: {
          currentBullet,
          jobTitle,
          jobDescription,
          relevantSkills
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }
      
      console.log('Bullet generation response:', data);
      return data.suggestions || [];
    } catch (error) {
      console.error('Error generating bullet points:', error);
      throw new Error('Failed to generate bullet point suggestions');
    }
  },

  async suggestSkills(jobDescription: string, currentSkills: string[]): Promise<string[]> {
    try {
      console.log('Calling suggest-skills function with:', {
        hasJobDescription: !!jobDescription,
        currentSkillsCount: currentSkills.length
      });

      const { data, error } = await supabase.functions.invoke('suggest-skills', {
        body: {
          jobDescription,
          currentSkills
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }
      
      console.log('Skills suggestion response:', data);
      return data.suggestedSkills || [];
    } catch (error) {
      console.error('Error suggesting skills:', error);
      throw new Error('Failed to suggest skills');
    }
  },

  async generateCoverLetter(
    profile: Profile, 
    jobDescription: string, 
    jobTitle: string, 
    companyName: string, 
    relevantSkills: string[]
  ): Promise<string> {
    try {
      console.log('Calling generate-cover-letter function with:', {
        hasProfile: !!profile,
        hasJobDescription: !!jobDescription,
        jobTitle,
        companyName,
        relevantSkillsCount: relevantSkills.length
      });

      const { data, error } = await supabase.functions.invoke('generate-cover-letter', {
        body: {
          profile,
          jobDescription,
          jobTitle,
          companyName,
          relevantSkills
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }
      
      console.log('Cover letter generation response:', data);
      return data.coverLetter || '';
    } catch (error) {
      console.error('Error generating cover letter:', error);
      throw new Error('Failed to generate cover letter');
    }
  }
};
