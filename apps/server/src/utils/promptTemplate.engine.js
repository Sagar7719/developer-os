export class PromptTemplateEngine {
  static SYSTEM_BASE_INSTRUCTION = `You are an AI assistant integrated into Sagar.dev's Developer OS — a high-performance, production-grade Software Engineer Portfolio and CMS.
Your responses must be technical, articulate, concise, professional, and well-structured.
Avoid fluff, generic filler words, or overly verbose intros. Focus on engineering value, clean architecture, and modern web standards.`;

  /**
   * Generates system instruction and formatted prompt user text for a given promptType.
   * @param {string} promptType
   * @param {string} input
   * @param {Object} [context={}]
   * @returns {{ systemInstruction: string, contents: string }}
   */
  static buildPrompt(promptType, input, context = {}) {
    switch (promptType) {
      case 'GENERATE_PROJECT_DESC': {
        const title = context.title || 'Software Project';
        const techStack = context.techStack ? context.techStack.join(', ') : 'Modern Web Stack';

        const systemInstruction = `${this.SYSTEM_BASE_INSTRUCTION}
You specialize in writing high-impact, technical project overviews for Sagar.dev's portfolio.
Focus on business value, system architecture, key tech stack highlights, and technical achievements.`;

        const contents = `Draft a concise 2-3 paragraph technical overview and key bullet points for the following portfolio project:
Project Title: ${title}
Tech Stack: ${techStack}
Additional Context/Notes: ${input}`;

        return { systemInstruction, contents };
      }

      case 'SUMMARIZE_BLOG_POST': {
        const title = context.title || 'Engineering Article';

        const systemInstruction = `${this.SYSTEM_BASE_INSTRUCTION}
You specialize in summarizing software engineering articles into executive summaries and meta descriptions.`;

        const contents = `Summarize the following technical post into a 2-sentence executive summary and 3 key takeaways:
Article Title: ${title}
Article Content:
${input}`;

        return { systemInstruction, contents };
      }

      case 'OPTIMIZE_SEO': {
        const systemInstruction = `${this.SYSTEM_BASE_INSTRUCTION}
You are an SEO optimization assistant for developer portfolio pages.
Produce a structured JSON recommendation containing an optimized page title (under 60 chars), meta description (under 160 chars), and 5 target keywords.`;

        const contents = `Analyze the following content and generate SEO metadata:
Content Focus: ${input}`;

        return { systemInstruction, contents };
      }

      case 'SUGGEST_CONTACT_REPLY': {
        const senderName = context.name || 'Inquirer';
        const subject = context.subject || 'Portfolio Inquiry';

        const systemInstruction = `${this.SYSTEM_BASE_INSTRUCTION}
You are assisting Sagar.dev in drafting professional email responses to portfolio contact form inquiries.
Draft a polite, professional, and actionable email response.`;

        const contents = `Draft a response for:
From: ${senderName}
Subject: ${subject}
Message:
${input}`;

        return { systemInstruction, contents };
      }

      case 'FREEFORM_ASSISTANT':
      default: {
        const systemInstruction = `${this.SYSTEM_BASE_INSTRUCTION}
Assist Sagar.dev with software engineering tasks, documentation, refactoring tips, and technical questions.`;

        const contents = input;
        return { systemInstruction, contents };
      }
    }
  }
}

export default PromptTemplateEngine;
