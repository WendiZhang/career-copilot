import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const sendChatMessage = async (messages: any[]) => {
  const res = await axios.post(
    `${API_URL}/api/chat`,
    { messages }
  );

  return res.data.reply;
};
