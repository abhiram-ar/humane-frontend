import { API_ROUTES } from "@/lib/API_ROUTES";
import { api } from "@/lib/axios";
import { HashtagWithCount } from "../types/HashtagWithCount";

export type HashTagSearchResponse = {
  data: {
    hashtags: HashtagWithCount[];
  };
};

export const fetchSuggestions = async (searchTag: string) => {
  const res = await api.get<HashTagSearchResponse>(`${API_ROUTES.WRITER_ROUTE}/hashtag`, {
    params: { query: searchTag, limit: 5 },
  });
  return res.data.data.hashtags;
};
