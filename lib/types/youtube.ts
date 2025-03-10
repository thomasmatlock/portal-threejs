// youtube.ts
export type YouTubeVideo = {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  viewCount: string;
  // New fields
  // New fields
  likeCount: string;
  commentCount: string;
  duration: string;
  tags: string[];
  description: string;
  isShort: boolean;
  definition: 'sd' | 'hd';
};

export type ChannelStats = {
  subscriberCount: string;
  viewCount: string;
  videoCount: string;
  channelName: string;
  channelThumbnail: string;
  channelHandle: string;
  // New fields
  description: string;
  createdAt: string;
  country: string;
  totalComments: string;
  avgViewsPerVideo: string;
  uploadSchedule: {
    mostPopularDay: string;
    mostPopularHour: string;
  };
  playlistCount: string;
};

export type ApiResponse = {
  videos?: YouTubeVideo[];
  channelStats?: ChannelStats;
  error?: string;
};
