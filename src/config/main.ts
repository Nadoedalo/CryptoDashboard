const apiKey = import.meta.env.VITE_COINGECKO_API_KEY;
export const mainConfig = {
  // FIXME: the API key should not be hardcoded like that, it's only to make sure we have at least 1
  COINGECKO_API_KEY: apiKey || 'CG-F9RKiWrufyAjWZfAXX1wTSJ9' || null,
  notification: {
    timeout: 3000,
    maxNotifications: 3,
  },
};
