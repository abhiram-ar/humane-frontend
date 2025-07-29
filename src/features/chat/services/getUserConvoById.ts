import { api } from "@/lib/axios";
import { Conversation } from "../Types/Conversation";
import { API_ROUTES } from "@/lib/API_ROUTES";

export type GetUserConvoByIdResponse = {
  data: { convo: Conversation | null };
};

export const getUserConvoById = async (convoId: string) => {
  const res = await api.get<GetUserConvoByIdResponse>(`${API_ROUTES.CHAT_ROUTE}/convo/${convoId}`);
  return res.data.data;
};
