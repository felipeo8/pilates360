# Pilates Studio Mobile App

A React Native mobile application built with Expo for booking Pilates classes. This app provides customers with an intuitive way to browse classes, make bookings, and manage their profile.

## Features

### 🔐 Authentication
- User registration and login
- JWT token-based authentication
- Secure session management

### 📅 Class Management
- Browse available classes with date filters
- View detailed class information
- Real-time availability tracking
- Class booking functionality

### 📖 Booking Management
- View upcoming and past bookings
- Cancel bookings when needed
- Booking status tracking (Confirmed, Cancelled, Completed, No Show)

### 👤 Profile Management
- User profile display
- Personal information management
- Logout functionality

## Technology Stack

- **React Native** with TypeScript
- **Expo** for development and deployment
- **React Navigation** for screen navigation
- **Axios** for API communication
- **AsyncStorage** for local data persistence
- **React Native Paper** for UI components
- **Expo Vector Icons** for iconography

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── BookingCard.tsx
│   └── ClassCard.tsx
├── context/            # React Context providers
│   └── AuthContext.tsx
├── navigation/         # Navigation configuration
│   └── AppNavigator.tsx
├── screens/           # Application screens
│   ├── LoginScreen.tsx
│   ├── RegisterScreen.tsx
│   ├── ClassesScreen.tsx
│   ├── ClassDetailScreen.tsx
│   ├── BookingsScreen.tsx
│   └── ProfileScreen.tsx
├── services/          # API and external services
│   └── api.ts
├── types/             # TypeScript type definitions
│   └── index.ts
└── utils/             # Utility functions
    └── config.ts
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development)
- Android Studio & Android Emulator (for Android development)

### Installation

1. Navigate to the mobile app directory:
   ```bash
   cd PilatesStudioApp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Update the API configuration in `app.json`:
   ```json
   {
     "expo": {
       "extra": {
         "apiUrl": "https://your-backend-api-url.com/api/v1"
       }
     }
   }
   ```

### Development

1. Start the Expo development server:
   ```bash
   npx expo start
   ```

2. Run on iOS Simulator:
   ```bash
   npx expo run:ios
   ```

3. Run on Android Emulator:
   ```bash
   npx expo run:android
   ```

4. Run in web browser:
   ```bash
   npx expo start --web
   ```

### Building for Production

1. Build for iOS:
   ```bash
   eas build --platform ios
   ```

2. Build for Android:
   ```bash
   eas build --platform android
   ```

## Configuration

### API Configuration
Update the `apiUrl` in `app.json` under `expo.extra` to point to your backend API:

```json
{
  "expo": {
    "extra": {
      "apiUrl": "https://your-backend-api-url.com/api/v1"
    }
  }
}
```

### App Branding
- Update app name, icon, and splash screen in `app.json`
- Replace assets in the `assets/` directory
- Update bundle identifiers for iOS and Android

## Key Components

### AuthContext
Manages user authentication state and provides login/logout functionality throughout the app.

### API Service
Centralized service for all backend communication with automatic token management and error handling.

### Navigation
Stack and tab-based navigation with authentication flow separation.

## Features in Detail

### Class Browsing
- Filter classes by date (Today, Tomorrow, specific dates)
- View class details including instructor, studio, time, and availability
- Real-time spot availability tracking

### Booking System
- One-tap booking with confirmation
- Automatic availability updates
- Booking cancellation with confirmation dialogs
- Status-based booking organization

### User Experience
- Intuitive navigation with bottom tabs
- Consistent design language
- Loading states and error handling
- Pull-to-refresh functionality

## API Integration

The app integrates with the .NET Web API backend:

- **Authentication**: `/auth/login`, `/auth/register`
- **Classes**: `/classes`, `/classes/{id}`
- **Bookings**: `/bookings` (GET, POST, DELETE)

All API calls include automatic JWT token authentication and error handling.

## Customization

### Colors and Styling
The app uses a consistent color scheme defined in component styles:
- Primary: `#6366f1` (Indigo)
- Success: `#10b981` (Emerald)
- Warning: `#f59e0b` (Amber)
- Error: `#ef4444` (Red)

### Adding New Features
1. Create new screens in `src/screens/`
2. Add navigation routes in `AppNavigator.tsx`
3. Create reusable components in `src/components/`
4. Add API methods in `src/services/api.ts`
5. Update TypeScript types in `src/types/index.ts`

## Troubleshooting

### Common Issues

1. **Metro bundler cache issues**:
   ```bash
   npx expo start -c
   ```

2. **iOS build issues**:
   ```bash
   cd ios && pod install
   ```

3. **Android build issues**:
   ```bash
   cd android && ./gradlew clean
   ```

## Contributing

1. Follow the existing code structure and naming conventions
2. Add TypeScript types for new features
3. Update README when adding new features
4. Test on both iOS and Android platforms

## License

This project is licensed under the MIT License.