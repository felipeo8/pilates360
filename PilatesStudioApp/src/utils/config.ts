import { Platform } from "react-native";

export const CONFIG = {
  // API_URL: Platform.OS === 'web'
  //   ? '/api/v1' // Use relative path when running on web (served from same origin)
  //   : Constants.expoConfig?.extra?.apiUrl || 'http://localhost:5273/api/v1',
  API_URL:
    Platform.OS === "web"
      ? "http://localhost:5273/api/v1"
      : "https://pilates360.com.mx/api/v1",
};

export default CONFIG;
