# Pilates Studio Booking System

A comprehensive booking system for Pilates studios built with .NET Web API backend and designed for React web and React Native mobile frontends.

## Backend (.NET Web API)

### Technologies Used
- ASP.NET Core Web API
- Entity Framework Core
- SQL Server
- JWT Authentication
- AutoMapper
- ASP.NET Core Identity

### Project Structure
```
PilatesStudio.Api/
├── Controllers/v1/          # API Controllers
├── Models/                  # Database entities
├── DTOs/                   # Data Transfer Objects
├── Services/               # Business logic layer
├── Repositories/           # Data access layer
├── Interfaces/             # Service contracts
├── Data/                   # Database context
├── Profiles/               # AutoMapper profiles
└── Migrations/             # EF Core migrations
```

### Key Features
- User authentication and authorization (JWT)
- Class scheduling and management
- Booking system with capacity management
- Role-based access (Admin, Instructor, Customer)
- Package/membership system
- RESTful API design

### API Endpoints

#### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - User login

#### Classes
- `GET /api/v1/classes` - Get all classes (optional date filter)
- `GET /api/v1/classes/{id}` - Get class by ID
- `POST /api/v1/classes` - Create class (Admin/Instructor)
- `PUT /api/v1/classes/{id}` - Update class (Admin/Instructor)
- `DELETE /api/v1/classes/{id}` - Delete class (Admin)

#### Bookings
- `POST /api/v1/bookings` - Book a class
- `GET /api/v1/bookings` - Get user's bookings
- `GET /api/v1/bookings/{id}` - Get booking details
- `DELETE /api/v1/bookings/{id}` - Cancel booking

### Setup Instructions

#### Prerequisites
- .NET 8.0 SDK
- SQL Server (LocalDB or full instance)
- Entity Framework Core tools

#### Installation
1. Clone the repository
2. Navigate to the API project:
   ```bash
   cd PilatesStudio.Api
   ```

3. Update the connection string in `appsettings.json`:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Server=localhost;Database=PilatesStudioDb;Trusted_Connection=true;TrustServerCertificate=true;"
     }
   }
   ```

4. Run database migrations:
   ```bash
   dotnet ef database update
   ```

5. Build and run the project:
   ```bash
   dotnet run
   ```

The API will be available at `http://localhost:5273`. Swagger documentation will be accessible at `/swagger`.

### Integrated Deployment (API + Web App)
You can serve both the API and the React Native web app from the same port:

1. Run the deployment script:
   ```bash
   ./deploy-integrated.sh
   ```

2. Start the integrated application:
   ```bash
   cd PilatesStudio.Api
   dotnet run
   ```

3. Access the application:
   - **Web App**: `http://localhost:5273`
   - **API Documentation**: `http://localhost:5273/swagger`
   - **API Endpoints**: `http://localhost:5273/api/v1/*`

This deployment method is perfect for production as it serves everything from a single port.

## 🐛 VS Code Debugging

The project is configured for easy debugging in Visual Studio Code:

### Quick Start
1. **Open workspace**: `code pilates360.code-workspace`
2. **Press F5** or click the play button
3. **Choose a configuration**:
   - 🔧 **Launch Integrated App** - Full-stack debugging (recommended)
   - 🚀 **Launch .NET API** - Backend only
   - 📱 **Launch React Native Web** - Frontend only
   - 📲 **Launch Mobile iOS/Android** - Native mobile apps

### Available Configurations
- **Integrated App**: API + Web on same port (http://localhost:5273)
- **Separate Services**: API (5273) + Web (8082) on different ports
- **Mobile Development**: iOS Simulator and Android Emulator support
- **Auto-open browser**: Automatically opens Swagger docs or web app

See [DEBUGGING.md](DEBUGGING.md) for detailed debugging instructions and troubleshooting.

### Database Schema
- **Users** - Customer/staff information (extends IdentityUser)
- **Instructors** - Instructor details
- **Studios** - Physical studio/room information
- **ClassTypes** - Different types of classes (e.g., Beginner Pilates, Advanced)
- **Classes** - Scheduled class instances
- **Bookings** - User class reservations
- **Packages** - Membership plans and credit packages
- **UserPackages** - User's purchased packages and remaining credits

### Security Features
- JWT token-based authentication
- Role-based authorization
- Password hashing via ASP.NET Core Identity
- CORS configuration for web/mobile clients

## Mobile App (React Native)

### Technologies Used
- React Native with Expo
- TypeScript
- React Navigation
- AsyncStorage for local data
- Axios for API communication

### Features
- User authentication (register/login)
- Browse and filter classes by date
- View detailed class information
- Book and cancel classes
- View booking history
- User profile management

### Setup Instructions
1. Navigate to the mobile app directory:
   ```bash
   cd PilatesStudioApp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Update API URL in `app.json`:
   ```json
   {
     "expo": {
       "extra": {
         "apiUrl": "https://your-backend-url.com/api/v1"
       }
     }
   }
   ```

4. Start the development server:
   ```bash
   npx expo start
   ```

5. Run on iOS/Android:
   ```bash
   npx expo run:ios
   npx expo run:android
   ```

## Frontend Web (Coming Soon)
- React web application for customers and admin
- Responsive design with modern UI components

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License
This project is licensed under the MIT License.