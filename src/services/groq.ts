import Groq from 'groq-sdk';
import type { GitHubData, RoastError, RoastIntensity, RoastResponse, RoastScores } from '../types';

function getIntensityTone(intensity: RoastIntensity): string {
  if (intensity === 1) return 'gently teasing';
  if (intensity === 2) return 'brutally honest';
  return 'absolutely savage';
}

function clampScore(value: unknown): number {
  const num = typeof value === 'number' ? value : Number(value);
  if (Number.isNaN(num)) return 50;
  return Math.min(100, Math.max(0, Math.round(num)));
}

function parseRoastResponse(raw: string): RoastResponse {
  const cleaned = raw
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  try {
    const parsed = JSON.parse(cleaned) as Partial<RoastResponse>;
    if (!parsed.roast || typeof parsed.roast !== 'string') {
      throw new Error('Missing roast');
    }

    const scores = (parsed.scores ?? {}) as Partial<RoastScores>;
    return {
      roast: parsed.roast,
      scores: {
        codeQuality: clampScore(scores.codeQuality),
        commitConsistency: clampScore(scores.commitConsistency),
        documentationScore: clampScore(scores.documentationScore),
        creativityScore: clampScore(scores.creativityScore),
        overallRoastScore: clampScore(scores.overallRoastScore),
      },
      verdict: parsed.verdict ?? 'Roasted to perfection.',
    };
  } catch {
    return {
      roast: cleaned,
      scores: {
        codeQuality: 50,
        commitConsistency: 50,
        documentationScore: 50,
        creativityScore: 50,
        overallRoastScore: 50,
      },
      verdict: 'Could not parse scores, but the roast still hits.',
    };
  }
}

export async function generateRoast(
  data: GitHubData,
  intensity: RoastIntensity,
): Promise<RoastResponse> {
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
          content: `You are a savage but funny code roaster. Roast the developer based on their GitHub stats. Be brutally honest but keep it fun and developer-focused. Use developer humor, memes, and coding references. Keep roast to 4-5 sentences max. End with one backhanded compliment.

You MUST respond with ONLY valid JSON (no markdown, no extra text) in this exact shape:
{
  "roast": "the roast text",
  "scores": {
    "codeQuality": number 0-100,
    "commitConsistency": number 0-100,
    "documentationScore": number 0-100,
    "creativityScore": number 0-100,
    "overallRoastScore": number 0-100
  },
  "verdict": "one funny line summary"
}`,
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

Be ${getIntensityTone(intensity)}

Also return a JSON scorecard with roast, scores, and verdict as specified.`,
        },
      ],
      max_tokens: 500,
      temperature: 0.9,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0]?.message?.content?.trim();

    if (!content) {
      throw new Error('Empty response from Groq');
    }

    return parseRoastResponse(content);
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
