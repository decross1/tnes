#!/bin/bash

# Automatic Node.js version setup script
# This script ensures Node 22 is active before running any commands

# Source nvm if it exists
if [ -f "$HOME/.nvm/nvm.sh" ]; then
    source "$HOME/.nvm/nvm.sh"
elif [ -f "/opt/homebrew/opt/nvm/nvm.sh" ]; then
    source "/opt/homebrew/opt/nvm/nvm.sh"
elif [ -f "/usr/local/opt/nvm/nvm.sh" ]; then
    source "/usr/local/opt/nvm/nvm.sh"
fi

# Check if nvm is available
if ! command -v nvm &> /dev/null; then
    echo "❌ NVM not found. Please install NVM first."
    exit 1
fi

# Switch to Node 22
echo "🔄 Switching to Node.js 22..."
nvm use 22

# Verify the version
NODE_VERSION=$(node --version)
echo "✅ Node.js version: $NODE_VERSION"

# Check if it's actually version 22
if [[ $NODE_VERSION == v22* ]]; then
    echo "✅ Node.js 22 is now active"
else
    echo "⚠️  Warning: Expected Node 22 but got $NODE_VERSION"
    echo "Installing Node 22..."
    nvm install 22
    nvm use 22
fi