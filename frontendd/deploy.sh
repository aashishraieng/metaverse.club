#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Preparing to deploy to Vercel ===${NC}"

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}Vercel CLI not found. Installing globally...${NC}"
    npm install -g vercel
fi

# Ask for project name
echo -e "${BLUE}Enter a project name (lowercase, only letters, numbers, and ., _, -):${NC}"
read project_name

# Validate project name
if [[ ! $project_name =~ ^[a-z0-9._-]+$ ]] || [[ $project_name =~ --- ]]; then
    echo -e "${RED}Invalid project name. Project names can only contain lowercase letters, numbers, dots, underscores, and hyphens. They cannot contain the sequence '---'.${NC}"
    exit 1
fi

if [ ${#project_name} -gt 100 ]; then
    echo -e "${RED}Project name is too long. Maximum length is 100 characters.${NC}"
    exit 1
fi

# Build the project
echo -e "${YELLOW}Building project...${NC}"
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo -e "${GREEN}Build successful!${NC}"
else
    echo -e "${RED}Build failed. Please fix the errors and try again.${NC}"
    exit 1
fi

# Deploy to Vercel with the specified name
echo -e "${YELLOW}Deploying to Vercel...${NC}"
vercel --name "$project_name" --prod

echo -e "${GREEN}Deployment process completed!${NC}" 