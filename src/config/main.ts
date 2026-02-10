const apiKey = import.meta.env.VITE_COINGECKO_API_KEY;
export const mainConfig = {
  COINGECKO_API_KEY: apiKey || null,
  notification: {
    timeout: 3000,
    maxNotifications: 3,
  },
};
