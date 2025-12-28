#!/usr/bin/env bash

set -e

echo "INFO: Checking nvm..."

if [ ! -d "$HOME/.nvm" ]; then
  echo "INFO: NVM not found, proceeding with installation..."
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
  
  # Give NVM new configuration if not there
  SHELL_RC="$HOME/.bashrc"
  if [ -n "$ZSH_VERSION" ]; then
    SHELL_RC="$HOME/.zshrc"
  fi
  
  if ! grep -q 'NVM_DIR' "$SHELL_RC"; then
    echo "INFO: Adding NVM to $SHELL_RC..."
    echo '' >> "$SHELL_RC"
    echo 'export NVM_DIR="$HOME/.nvm"' >> "$SHELL_RC"
    echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' >> "$SHELL_RC"
    echo '[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"' >> "$SHELL_RC"
  fi
else
  echo "STATUS: NVM already installed."
fi

# Load NVM here
export NVM_DIR="$HOME/.nvm"
if [ -s "$NVM_DIR/nvm.sh" ]; then
  . "$NVM_DIR/nvm.sh"
else
  echo "ERROR: nvm.sh not found. NVM installation may have failed."
  echo "Please manually install Node.js 20 and run: npm install"
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

echo "INFO: Installing npm dependencies..."
npm install

echo ""
echo "============================================"
echo "STATUS: Setup complete!"
echo "============================================"
echo ""
echo "IMPORTANT: To use node immediately, run:"
echo "  source ~/.bashrc    (for bash users)"
echo "  source ~/.zshrc     (for zsh users)"
echo ""
echo "Or simply close and reopen your terminal."
echo ""
echo "Then you can start the program by running:"
echo "  npm start"
echo ""
