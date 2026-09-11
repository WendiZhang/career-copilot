import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type ApiErrorPayload = {
  message?: string;
  msg?: string;
};

export function getApiErrorMessage(error: unknown, fallback: string) {
  if (!axios.isAxiosError<ApiErrorPayload>(error)) return fallback;

  return error.response?.data?.message || error.response?.data?.msg || fallback;
}

export function isUnauthorized(error: unknown) {
  return axios.isAxiosError(error) && error.response?.status === 401;
}

export const sendChatMessage = async (messages: ChatMessage[]) => {
  const res = await axios.post(
    `${API_URL}/api/chat`,
    { messages }
  );

  return res.data.reply;
};
