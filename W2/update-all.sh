#!/bin/bash

# Script to pull updates from multiple git repositories
# Usage: ./pull_all_repos.sh [directory_path]

# Set the base directory (use argument or current directory)
BASE_DIR="${1:-.}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "🔄 Pulling updates for all git repositories in: $BASE_DIR"
echo "=================================================="

# Counter for statistics
total_repos=0
successful_pulls=0
failed_pulls=0
skipped_dirs=0

# Function to check if directory is a git repository
is_git_repo() {
    local repo_path="$1"
    (cd "$repo_path" 2>/dev/null && git rev-parse --git-dir > /dev/null 2>&1)
}

# Function to pull a single repository
pull_repo() {
    local repo_path="$1"
    local repo_name=$(basename "$repo_path")
    
    echo -e "\n${BLUE}📁 Processing: $repo_name${NC}"
    
    # Check if it's actually a git repository BEFORE changing directories
    if ! is_git_repo "$repo_path"; then
        echo -e "${YELLOW}⚠️  Skipping '$repo_name' - not a git repository${NC}"
        ((skipped_dirs++))
        return 0
    fi
    
    ((total_repos++))
    
    # Change to repository directory
    if ! cd "$repo_path" 2>/dev/null; then
        echo -e "${RED}❌ Cannot access directory '$repo_path'${NC}"
        ((failed_pulls++))
        return 1
    fi
    
    # Check if there are any remotes configured
    if ! git remote > /dev/null 2>&1 || [ -z "$(git remote)" ]; then
        echo -e "${YELLOW}⚠️  No remotes configured for '$repo_name'${NC}"
        ((failed_pulls++))
        return 1
    fi
    
    # Get current branch
    current_branch=$(git branch --show-current 2>/dev/null)
    if [ -z "$current_branch" ]; then
        echo -e "${YELLOW}⚠️  Not on any branch in '$repo_name'${NC}"
        ((failed_pulls++))
        return 1
    fi
    
    # Check for uncommitted changes
    if ! git diff-index --quiet HEAD --; then
        echo -e "${YELLOW}⚠️  Uncommitted changes in '$repo_name' - pulling anyway${NC}"
    fi
    
    # Perform the pull
    echo "🔄 Pulling from remote..."
    if git pull; then
        echo -e "${GREEN}✅ Successfully pulled '$repo_name' (branch: $current_branch)${NC}"
        ((successful_pulls++))
    else
        echo -e "${RED}❌ Failed to pull '$repo_name'${NC}"
        ((failed_pulls++))
    fi
}

# Main execution
if [ ! -d "$BASE_DIR" ]; then
    echo -e "${RED}❌ Directory '$BASE_DIR' does not exist${NC}"
    exit 1
fi

# Store original directory
original_dir=$(pwd)

# Loop through all subdirectories
for dir in "$BASE_DIR"/*; do
    # Remove trailing slash and check if it's a directory
    dir="${dir%/}"
    if [ -d "$dir" ] && [ "$(basename "$dir")" != "*" ]; then
        pull_repo "$dir"
        # Return to base directory after each repo
        cd "$original_dir"
    fi
done

# Return to original directory
cd "$original_dir"

# Print summary
echo -e "\n=================================================="
echo -e "${BLUE}📊 Summary:${NC}"
echo -e "Total repositories processed: $total_repos"
echo -e "${GREEN}Successful pulls: $successful_pulls${NC}"
echo -e "${RED}Failed pulls: $failed_pulls${NC}"
echo -e "${YELLOW}Non-git directories skipped: $skipped_dirs${NC}"

if [ $failed_pulls -gt 0 ]; then
    exit 1
else
    echo -e "\n${GREEN}🎉 All operations completed successfully!${NC}"
fi