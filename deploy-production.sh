#!/bin/bash

# Production Deployment Script for Pilates Studio Application
# This script builds and publishes the application for production deployment via FTP

set -e  # Exit on any error

echo "🚀 Starting Production Build Process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="$(dirname "$0")/PilatesStudio.Api"
MOBILE_APP_DIR="$(dirname "$0")/PilatesStudioApp"
OUTPUT_DIR="$(pwd)/publish"

# Load environment variables from .env file if it exists
if [ -f ".env" ]; then
    echo -e "${BLUE}📄 Loading .env configuration...${NC}"
    export $(grep -v '^#' .env | xargs)
fi

# FTP Configuration (set these variables for your FTP server)
FTP_SERVER="${FTP_SERVER:-your-ftp-server.com}"
FTP_USER="${FTP_USER:-your-username}"
FTP_PASS="${FTP_PASS:-your-password}"
FTP_PATH="${FTP_PATH:-/public_html}"

echo -e "${BLUE}📁 Project Directory: $PROJECT_DIR${NC}"
echo -e "${BLUE}📱 Mobile App Directory: $MOBILE_APP_DIR${NC}"
echo -e "${BLUE}📦 Output Directory: $OUTPUT_DIR${NC}"

# Clean previous builds
echo -e "\n${YELLOW}🧹 Cleaning previous builds...${NC}"
rm -rf "$OUTPUT_DIR"
mkdir -p "$OUTPUT_DIR"

# Build React Native Web App
echo -e "\n${YELLOW}📱 Building React Native Web App...${NC}"
cd "$MOBILE_APP_DIR"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build for web production
echo "🏗️ Building web app..."
npx expo export --platform web --output-dir ./dist --clear

# Copy web build to API wwwroot
echo "📋 Copying web build to API..."
rm -rf ../PilatesStudio.Api/wwwroot/*
cp -r ./dist/* ../PilatesStudio.Api/wwwroot/

# Build .NET API
echo -e "\n${YELLOW}🔧 Building .NET API...${NC}"
cd ..
cd "$PROJECT_DIR"

current_directory=$(pwd)
echo "The current directory is: $current_directory"

echo -e "\n${YELLOW}PROJECT_DIR...${PROJECT_DIR}"

# Clean and restore
echo "🧹 Cleaning .NET project..."
dotnet clean --configuration Release

echo "📦 Restoring .NET packages..."
dotnet restore

# Publish the application
echo "🏗️ Publishing .NET API..."
dotnet publish \
  --configuration Release \
  --output "$OUTPUT_DIR" \
  --self-contained false \
  --runtime linux-x64 \
  -p:PublishTrimmed=false

# Copy additional files
echo -e "\n${YELLOW}📋 Copying configuration files...${NC}"
cp appsettings.json "$OUTPUT_DIR/"
cp appsettings.Production.json "$OUTPUT_DIR/"

# Create web.config for IIS (if needed)
cat > "$OUTPUT_DIR/web.config" << 'EOF'
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <location path="." inheritInChildApplications="false">
    <system.webServer>
      <handlers>
        <add name="aspNetCore" path="*" verb="*" modules="AspNetCoreModuleV2" resourceType="Unspecified" />
      </handlers>
      <aspNetCore processPath="dotnet" arguments="PilatesStudio.Api.dll" stdoutLogEnabled="false" stdoutLogFile=".\\logs\\stdout" hostingModel="InProcess" />
      <security>
        <requestFiltering>
          <requestLimits maxAllowedContentLength="52428800" />
        </requestFiltering>
      </security>
    </system.webServer>
  </location>
</configuration>
EOF

echo -e "\n${GREEN}✅ Build completed successfully!${NC}"
echo -e "${BLUE}📁 Published files are in: $OUTPUT_DIR${NC}"

# FTP Upload
echo -e "\n${YELLOW}📤 Uploading to FTP server...${NC}"
if [ "$FTP_SERVER" != "your-ftp-server.com" ] && [ "$FTP_USER" != "your-username" ] && [ "$FTP_PASS" != "your-password" ]; then
    echo -e "${BLUE}🔗 Connecting to $FTP_SERVER...${NC}"
    
    # Try lftp first (if available)
    if command -v lftp >/dev/null 2>&1; then
        echo -e "${BLUE}Using lftp for upload...${NC}"
        lftp -c "set ftp:ssl-allow no; open -u $FTP_USER,$FTP_PASS $FTP_SERVER; lcd $OUTPUT_DIR; cd $FTP_PATH; mirror -R --delete --verbose .; quit"
        upload_result=$?
    else
        # Fallback to curl (built into macOS)
        echo -e "${BLUE}Using curl for upload (lftp not available)...${NC}"
        upload_result=0
        
        # Create remote directory structure and upload files
        cd "$OUTPUT_DIR"
        while IFS= read -r -d '' file; do
            remote_path="$FTP_PATH/${file#./}"
            remote_dir=$(dirname "$remote_path")
            
            # Create directory structure
            if [ "$remote_dir" != "." ] && [ "$remote_dir" != "$FTP_PATH" ]; then
                curl -s --ftp-create-dirs -u "$FTP_USER:$FTP_PASS" "ftp://$FTP_SERVER$remote_dir/" || true
            fi
            
            # Upload file
            echo "File: '$file'"
            echo "Remote path: '$remote_path'"
            full_url="ftp://${FTP_SERVER}${remote_path}"
            echo "Full URL: '$full_url'"
            echo "Starting upload..."
            curl -T "$file" -u "$FTP_USER:$FTP_PASS" "$full_url"
            if [ $? -ne 0 ]; then
                echo -e "${RED}❌ Failed to upload $file${NC}"
                upload_result=1
            fi
        done < <(find . -type f -print0)
        cd - > /dev/null
    fi
    
    if [ $upload_result -eq 0 ]; then
        echo -e "\n${GREEN}✅ FTP upload completed successfully!${NC}"
        echo -e "${GREEN}🌐 Your application is now deployed!${NC}"
    else
        echo -e "\n${RED}❌ FTP upload failed!${NC}"
        echo -e "${YELLOW}📋 Manual upload instructions:${NC}"
        echo "Upload all files from $OUTPUT_DIR to your FTP server at $FTP_PATH"
        exit 1
    fi
else
    echo -e "${YELLOW}⚠️  FTP credentials not configured. Load .env file:${NC}"
    echo "source .env && ./deploy-production.sh"
    echo -e "\n${YELLOW}📋 Manual upload instructions:${NC}"
    echo "Upload all files from $OUTPUT_DIR to your web server root directory"
fi

# Display post-deployment information
echo -e "\n${YELLOW}📝 Post-Deployment Checklist:${NC}"
echo "1. Ensure your production database connection string is configured"
echo "2. Set ASPNETCORE_ENVIRONMENT=Production on your server"
echo "3. Verify file permissions on your web server"
echo "4. Test your application at your domain"

echo -e "\n${GREEN}🎉 Production deployment completed!${NC}"