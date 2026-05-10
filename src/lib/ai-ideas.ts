// src/lib/ai-ideas.ts

export const BUSINESS_BUILDING_IDEAS = [
  "Host a 24-hour flash sale and share behind-the-scenes prep.",
  "Share a customer success story with a call to action.",
  "Create a 'before and after' transformation post for your product/service.",
  "Launch a 'tag a friend' giveaway to boost engagement.",
  "Share your founder story and invite followers to DM for a special offer.",
  "Post a poll about your next product or service idea.",
  "Share a motivational tip for entrepreneurs and ask for audience input.",
  "Run a contest: 'Best use of our product' with a prize.",
  "Share a quick win or hack your audience can try today.",
  "Announce a limited-time bundle or bonus for new customers."
];

export function getRandomBusinessIdea() {
  return BUSINESS_BUILDING_IDEAS[Math.floor(Math.random() * BUSINESS_BUILDING_IDEAS.length)];
}
