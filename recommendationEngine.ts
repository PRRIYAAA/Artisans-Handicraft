import { Class, UserPreferences } from './types';

interface ClassScore {
  class: Class;
  score: number;
  reasons: string[];
}

export function getRecommendedClasses(
  allClasses: Class[],
  preferences: UserPreferences | undefined
): Class[] {
  if (!preferences || !preferences.preferredCategories || preferences.preferredCategories.length === 0) {
    // If no preferences, return classes sorted by popularity
    return [...allClasses].sort((a, b) => 
      (b.seats - b.availableSeats) - (a.seats - a.availableSeats)
    ).slice(0, 6);
  }

  const scoredClasses: ClassScore[] = allClasses.map(cls => {
    let score = 0;
    const reasons: string[] = [];

    // Category match (highest weight)
    if (preferences.preferredCategories.includes(cls.category)) {
      score += 50;
      reasons.push('Matches your interests');
    }

    // Skill level match
    if (preferences.skillLevel && cls.level === preferences.skillLevel) {
      score += 30;
      reasons.push('Perfect for your skill level');
    } else if (preferences.skillLevel === 'beginner' && cls.level === 'intermediate') {
      score += 15; // Slight boost for next level
      reasons.push('Good next step');
    } else if (preferences.skillLevel === 'intermediate' && 
               (cls.level === 'beginner' || cls.level === 'advanced')) {
      score += 10;
    }

    // Learning style match (based on class location/format)
    if (preferences.learningStyle) {
      if (preferences.learningStyle === 'hands-on' && cls.location === 'offline') {
        score += 15;
        reasons.push('Hands-on experience');
      } else if (preferences.learningStyle === 'visual' && cls.location === 'online') {
        score += 15;
        reasons.push('Visual demonstrations');
      } else if (preferences.learningStyle === 'mixed') {
        score += 10;
      }
    }

    // Availability boost
    if (cls.availableSeats > 0) {
      score += 10;
      if (cls.availableSeats <= 3) {
        reasons.push('Limited spots available');
      }
    }

    // Popularity boost (based on enrollment)
    const enrollmentRate = (cls.seats - cls.availableSeats) / cls.seats;
    if (enrollmentRate > 0.7) {
      score += 10;
      reasons.push('Popular choice');
    }

    // Recency boost
    const daysSinceCreated = (Date.now() - new Date(cls.createdAt).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceCreated < 7) {
      score += 5;
      reasons.push('Newly added');
    }

    return { class: cls, score, reasons };
  });

  // Sort by score and return top recommendations
  return scoredClasses
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map(item => item.class);
}

export function getMatchReasons(
  cls: Class,
  preferences: UserPreferences | undefined
): string[] {
  if (!preferences) return [];

  const reasons: string[] = [];

  if (preferences.preferredCategories.includes(cls.category)) {
    reasons.push('Matches your interests');
  }

  if (preferences.skillLevel && cls.level === preferences.skillLevel) {
    reasons.push('Perfect for your skill level');
  }

  if (preferences.learningStyle === 'hands-on' && cls.location === 'offline') {
    reasons.push('Hands-on learning experience');
  }

  if (preferences.learningStyle === 'visual' && cls.location === 'online') {
    reasons.push('Great for visual learners');
  }

  return reasons;
}
