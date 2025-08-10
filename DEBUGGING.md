# 🐛 VS Code Debugging Guide

This guide explains how to debug your Pilates Studio application using Visual Studio Code.

## 🚀 Quick Start

1. **Open the workspace**:
   ```bash
   code pilates360.code-workspace
   ```

2. **Press F5 or click the play button** in VS Code
3. **Select a launch configuration** from the dropdown:
   - 🔧 **Launch Integrated App (No Browser)** - Full-stack, no certificate issues ⭐
   - 🔧 **Launch Integrated App** - Full-stack debugging (may ask for certificate)
   - 🚀 **Launch .NET API** - Backend only
   - 📱 **Launch React Native Web** - Frontend only
   - 📲 **Launch Mobile iOS/Android** - Native mobile apps

## 🎯 Available Launch Configurations

### 🔧 **Launch Integrated App (API + Web)** - *Recommended*
- **What it does**: Builds and serves both API and web app from one port
- **URL**: http://localhost:5273
- **Best for**: Full-stack debugging and production-like testing

### 🚀 **Launch .NET API**
- **What it does**: Starts only the backend API server
- **URL**: http://localhost:5273
- **Swagger**: http://localhost:5273/swagger
- **Best for**: Backend debugging and API testing

### 📱 **Launch React Native Web**
- **What it does**: Starts the React Native web development server
- **URL**: http://localhost:8082
- **Best for**: Frontend debugging with hot reload

### 🚀 **Launch API + Mobile Web (Separate)**
- **What it does**: Starts both API and web app on separate ports
- **URLs**: API: http://localhost:5273, Web: http://localhost:8082
- **Best for**: Debugging frontend/backend communication

### 📲 **Launch React Native iOS/Android**
- **What it does**: Starts the mobile app in iOS Simulator or Android Emulator
- **Best for**: Mobile app testing

## 🛠️ Setting Breakpoints

### .NET API Debugging
1. Open any `.cs` file in the `PilatesStudio.Api` folder
2. Click in the gutter next to line numbers to set breakpoints
3. Use **F5** to start debugging
4. Make API calls to trigger breakpoints

### React Native Debugging
1. Open any `.tsx` or `.ts` file in the `PilatesStudioApp/src` folder
2. Set breakpoints by clicking in the gutter
3. Use **F5** to start debugging
4. Open browser developer tools for additional debugging

## 🔧 Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Start Debugging | `F5` |
| Start Without Debugging | `Ctrl+F5` |
| Stop Debugging | `Shift+F5` |
| Restart | `Ctrl+Shift+F5` |
| Step Over | `F10` |
| Step Into | `F11` |
| Step Out | `Shift+F11` |
| Continue | `F5` |

## 🎨 Features

### Auto-Open Browser
- **API configurations** automatically open Swagger documentation
- **Web configurations** automatically open the application
- **No manual navigation needed!**

### Hot Reload
- **React Native Web**: Changes automatically refresh
- **.NET API**: Automatic recompilation on file changes
- **Save time during development**

### Multi-Project Support
- **Workspace folders** organized by project type
- **IntelliSense** works across all projects
- **Integrated terminal** for each project

## 🚨 Troubleshooting

### HTTPS Certificate Errors
If you get certificate errors like "Couldn't create self-signed certificate":

**Option 1: Use "No Browser" Configuration (Recommended)**
1. In VS Code, select **🔧 Launch Integrated App (No Browser)**
2. This skips browser auto-open and avoids certificate prompts
3. Manually open: http://localhost:5273

**Option 2: Click "No" on Certificate Prompt**
1. When prompted "Create a trusted self-signed certificate?"
2. Click **"No"**  
3. The app will still start on HTTP

**Option 3: Manual Command Line**
```bash
cd PilatesStudio.Api
ASPNETCORE_URLS=http://localhost:5273 dotnet run
```

### Port Already in Use
If you get port errors:
```bash
# Kill processes using the ports
lsof -ti:5273 | xargs kill -9
lsof -ti:8082 | xargs kill -9
```

### Build Errors
1. **Clean and rebuild**:
   ```bash
   # For API
   cd PilatesStudio.Api && dotnet clean && dotnet build
   
   # For Mobile App
   cd PilatesStudioApp && npm install
   ```

2. **Check VS Code Problems panel** (Ctrl+Shift+M)

### Missing Extensions
VS Code will prompt to install recommended extensions. Click **Install** when prompted.

## 📁 Project Structure

```
pilates360/
├── .vscode/                 # VS Code configuration
│   ├── launch.json         # Debug configurations
│   ├── tasks.json          # Build tasks
│   └── settings.json       # Workspace settings
├── PilatesStudio.Api/      # .NET Backend
└── PilatesStudioApp/       # React Native App
```

## 🎉 Happy Debugging!

You're all set! Press **F5** and start debugging your Pilates Studio application with ease.