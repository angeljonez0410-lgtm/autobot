import { Business, ContentTemplate, PostItem } from "@/lib/types";

export const BRAND_VOICE =
  "Confident, viral, motivational, cute but aggressive, mompreneur-friendly, beginner-friendly, honest, and action-focused.";

export const BUSINESS_CATEGORIES = [
  "T-shirt business",
  "Hoodies",
  "Mugs",
  "Tumblers",
  "Rugs",
  "Blankets",
  "Canva templates",
  "Ebook for stay-at-home moms",
  "Resume/job help",
  "Pickapeppa stuffed peppers",
  "Lemonade/slushie stand",
  "Affiliate products",
  "Dropshipping/product finds",
];

export const BUSINESSES: Business[] = [
  { id: "b1", name: "Boss Prints Co", niche: "T-shirts, hoodies, mugs", emoji: "👕" },
  { id: "b2", name: "Cozy Home Drop", niche: "Rugs, blankets, tumblers", emoji: "🛋️" },
  { id: "b3", name: "Mom Money Digital", niche: "Canva templates, ebooks", emoji: "💻" },
  { id: "b4", name: "Fast Cash Local", niche: "Stuffed peppers, lemonade/slushies", emoji: "🍋" },
  { id: "b5", name: "Career Glow Up", niche: "Resume/job tools", emoji: "📄" },
  { id: "b6", name: "Affiliate Finds Daily", niche: "Affiliate + product finds", emoji: "🛒" },
];

export const DEMO_POSTS: PostItem[] = [
  {
    id: "p1",
    businessId: "b1",
    platform: "instagram",
    caption: "Soft launch tonight: custom hoodie drop for busy moms who still serve looks.",
    hashtags: ["#Mompreneur", "#SmallBusiness", "#HoodieSeason"],
    cta: "Comment HOODIE for early access.",
    scheduledAt: new Date(Date.now() + 1000 * 60 * 90).toISOString(),
    status: "scheduled",
  },
  {
    id: "p2",
    businessId: "b3",
    platform: "tiktok",
    caption: "I made this Canva template in 20 mins and listed it in my shop. Let me show you how.",
    hashtags: ["#CanvaTemplates", "#DigitalProducts", "#MakeMoneyOnline"],
    cta: "Grab the template bundle in bio.",
    status: "ready",
  },
  {
    id: "p3",
    businessId: "b4",
    platform: "facebook",
    caption: "Taking local stuffed pepper pre-orders for Friday pickup. Fresh, seasoned, and family approved.",
    hashtags: ["#LocalBusiness", "#FoodPreorder", "#HomeKitchen"],
    cta: "Message to reserve your tray.",
    scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 5).toISOString(),
    status: "scheduled",
  },
  {
    id: "p4",
    businessId: "b5",
    platform: "pinterest",
    caption: "Resume before/after checklist that helps job seekers get callbacks faster.",
    hashtags: ["#ResumeTips", "#CareerHelp", "#WorkFromHome"],
    cta: "Download the checklist today.",
    status: "draft",
  },
];

const platforms: ContentTemplate["platform"][] = [
  "tiktok",
  "instagram",
  "facebook",
  "pinterest",
  "youtube_shorts",
];

const categorySeed = [
  "T-shirts",
  "Hoodies",
  "Mugs",
  "Tumblers",
  "Rugs",
  "Blankets",
  "Canva templates",
  "Ebook",
  "Resume help",
  "Stuffed peppers",
  "Lemonade/slushies",
  "Affiliate products",
  "Dropshipping finds",
];

export const CONTENT_TEMPLATES: ContentTemplate[] = Array.from({ length: 55 }).map((_, i) => {
  const category = categorySeed[i % categorySeed.length];
  const platform = platforms[i % platforms.length];

  return {
    id: `tpl-${i + 1}`,
    category,
    platform,
    hook: `Stop scrolling: ${category} can become tonight's income stream (${i + 1}).`,
    body:
      "Here is the exact play: post proof, show the offer, add urgency, and tell people what to DM you for. Keep it authentic and simple.",
    cta: "DM \"READY\" and I will send details.",
    hashtags: ["#Mompreneur", "#SideHustle", "#MakeMoneyTonight", `#${category.replace(/\s+/g, "")}`],
  };
});

export const LAUNCH_CHECKLIST = [
  "Set your top 1 product for tonight",
  "Customize 5 templates for your real offer",
  "Connect Buffer (or stay in Demo Mode)",
  "Schedule 8 posts across 3 platforms",
  "Post 1 urgent video now",
  "Reply to every DM within 10 minutes",
  "Track leads/orders in Analytics page",
  "Repeat tomorrow with yesterday's winner",
];

export const PRELOADED_LAUNCH_POSTS = Array.from({ length: 20 }).map((_, i) => ({
  id: `launch-${i + 1}`,
  title: `Launch Post ${i + 1}`,
  text: `Tonight only: I just opened orders for my ${categorySeed[i % categorySeed.length]} offer. First 10 customers get a bonus.`,
  platform: platforms[i % platforms.length],
}));

export const MONEY_IDEAS = [
  "Sell Canva templates for niche audiences",
  "Launch custom shirts and hoodies with local pickup",
  "Publish a practical digital ebook",
  "Take local food preorders (legal + compliant in your area)",
  "Offer resume refresh services",
  "Create UGC videos for brands",
  "Promote affiliate links with honest reviews",
  "Post product mockups daily",
  "Run Facebook Marketplace promos",
  "Test TikTok shop-style short promos",
];
