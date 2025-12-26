#!/usr/bin/env bash

set -e

echo "INFO: Checking nvm..."

if [ ! -d "$HOME/.nvm" ]; then
  echo "INFO: NVM not found, proceeding with installation..."
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
else
  echo "STATUS: NVM already installed."
fi

export NVM_DIR="$HOME/.nvm"
if [ -s "$NVM_DIR/nvm.sh" ]; then
  . "$NVM_DIR/nvm.sh"
else
  echo "STATUS: nvm.sh not found"
  exit 1
fi

echo "INFO: Installing Node.js 20..."
nvm install 20

echo "INFO: Activating Node.js 20..."
nvm use 20

echo "INFO: Setting up Node.js as default..."
nvm alias default 20

echo "INFO: Refreshing the path..."
hash -r

echo "STATUS: Finished"
echo "Current Node version:"
node -v

echo "INFO: Node Binary location:"
which node