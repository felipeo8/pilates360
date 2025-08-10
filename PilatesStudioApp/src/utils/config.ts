import Constants from 'expo-constants';
import { Platform } from 'react-native';

export const CONFIG = {
  API_URL: Platform.OS === 'web' 
    ? '/api/v1' // Use relative path when running on web (served from same origin)
    : Constants.expoConfig?.extra?.apiUrl || 'http://localhost:5273/api/v1',
};

export default CONFIG;