import type { GitHubData } from '../types';
import { getDaysSinceLastCommit } from '../services/github';

export interface EasterEggMessage {
  text: string;
  type: 'legend' | 'funny' | 'celebrity' | 'stars';
}

export function getEasterEggMessages(data: GitHubData): EasterEggMessage[] {
  const messages: EasterEggMessage[] = [];

  if (data.username.toLowerCase() === 'torvalds') {
    messages.push({
      type: 'legend',
      text: "We don't roast legends. Linus would roast us back and we'd deserve it.",
    });
  }

  if (data.public_repos === 0) {
    messages.push({
      type: 'funny',
      text: "No repos? Bold strategy to have a GitHub account just to stare at other people's code.",
    });
  }

  if (data.followers > data.following * 10 && data.following > 0) {
    messages.push({
      type: 'celebrity',
      text: "You're basically a GitHub celebrity. We're not worthy.",
    });
  }

  if (data.public_repos > 0 && data.total_stars === 0) {
    messages.push({
      type: 'stars',
      text: "Zero stars across all repos. Even your mom hasn't starred your projects.",
    });
  }

  return messages;
}

export function shouldShowLastSeenBadge(data: GitHubData): boolean {
  const days = getDaysSinceLastCommit(data.last_push_date);
  return days !== null && days > 365;
}

export function formatLastSeenDate(lastPushDate: string | null): string {
  if (!lastPushDate) return 'Unknown';
  return new Date(lastPushDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function isLegendUsername(username: string): boolean {
  return username.toLowerCase() === 'torvalds';
}
