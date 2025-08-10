#!/bin/bash

echo "🚀 Building integrated Pilates Studio application..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📱 Building React Native web app...${NC}"
cd PilatesStudioApp
npx expo export -p web --clear

if [ $? -ne 0 ]; then
    echo "❌ Failed to build React Native web app"
    exit 1
fi

echo -e "${BLUE}📂 Copying web files to API wwwroot...${NC}"
rm -rf ../PilatesStudio.Api/wwwroot/*
cp -r dist/* ../PilatesStudio.Api/wwwroot/

echo -e "${BLUE}🔧 Building .NET API...${NC}"
cd ../PilatesStudio.Api
dotnet build

if [ $? -ne 0 ]; then
    echo "❌ Failed to build .NET API"
    exit 1
fi

echo -e "${GREEN}✅ Build completed successfully!${NC}"
echo -e "${GREEN}🌐 You can now run the integrated application with:${NC}"
echo -e "${BLUE}   cd PilatesStudio.Api && dotnet run${NC}"
echo -e "${GREEN}📱 Access the application at: http://localhost:5273${NC}"
echo -e "${GREEN}🔧 API documentation at: http://localhost:5273/swagger${NC}"