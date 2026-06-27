import Groq from 'groq-sdk';
import type { GitHubData, RoastError, RoastIntensity } from '../types';

function getIntensityTone(intensity: RoastIntensity): string {
  if (intensity === 1) return 'gently teasing';
  if (intensity === 2) return 'brutally honest';
  return 'absolutely savage';
}

export async function generateRoast(
  data: GitHubData,
  intensity: RoastIntensity,
): Promise<string> {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;

  if (!apiKey || apiKey === 'your_groq_key') {
    throw {
      type: 'groq_error' as const,
      message:
        'Groq API key not configured. Add VITE_GROQ_API_KEY to your .env file.',
    };
  }

  const without_readme = 10 - data.readme_count;
  const languages =
    data.most_used_languages.length > 0
      ? data.most_used_languages.join(', ')
      : 'None detected (the void)';

  const lastCommit = data.last_push_date
    ? new Date(data.last_push_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'Never (rip)';

  const groq = new Groq({ apiKey, dangerouslyAllowBrowser: true });

  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are a savage but funny code roaster. Roast the developer based on their GitHub stats. Be brutally honest but keep it fun and developer-focused. Use developer humor, memes, and coding references. Keep roast to 4-5 sentences max. End with one backhanded compliment.`,
        },
        {
          role: 'user',
          content: `Roast this developer:
Name: ${data.name}
Repos: ${data.public_repos}
Followers: ${data.followers}
Most used languages: ${languages}
Last commit: ${lastCommit}
Repos without README: ${without_readme}
Total stars: ${data.total_stars}
Has profile picture: ${data.has_profile_pic}
Bio: ${data.bio}
Intensity: ${intensity} (1=mild, 3=nuclear)

Be ${getIntensityTone(intensity)}`,
        },
      ],
      max_tokens: 300,
      temperature: 0.9,
    });

    const roast = completion.choices[0]?.message?.content?.trim();

    if (!roast) {
      throw new Error('Empty response from Groq');
    }

    return roast;
  } catch (error) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'type' in error &&
      'message' in error
    ) {
      throw error;
    }

    const roastError: RoastError = {
      type: 'groq_error',
      message:
        'Failed to generate roast. Check your Groq API key or try again.',
    };
    throw roastError;
  }
}
