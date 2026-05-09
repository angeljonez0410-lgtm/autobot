export type Platform = "tiktok" | "instagram" | "facebook" | "pinterest" | "youtube_shorts";

export type PostStatus = "idea" | "draft" | "ready" | "scheduled" | "posted";

export interface Business {
  id: string;
  name: string;
  niche: string;
  emoji: string;
}

export interface PostItem {
  id: string;
  businessId: string;
  platform: Platform;
  caption: string;
  imageUrl?: string;
  hashtags: string[];
  cta: string;
  scheduledAt?: string;
  status: PostStatus;
}

export interface ContentTemplate {
  id: string;
  category: string;
  platform: Platform;
  hook: string;
  body: string;
  cta: string;
  hashtags: string[];
}
