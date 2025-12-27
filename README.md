# BrutalHash
This Node.js toolkit includes: hash/dehash (with salting) + dictionary attack (stream/classic) + format matching with regex

![My Image](https://github.com/G0ldenRat10/PrivatePictures/blob/main/Screenshot%20from%202025-12-27%2011-38-20.png?raw=true)

## Features
- **Hash Generation**: Support for 17 hash algorithms (MD5, SHA-1, SHA-2, SHA-3, BLAKE2, RIPEMD-160, WHIRLPOOL...)
- **Dictionary Attack**: Two mods (in-memory and stream). In-memory is faster but it eats more RAM, stream if better for low PC power and also works on big (rockyou) files.
- **Custom Wordlists**: Create your own wordlists on the fly
- **Salt Support**: Add salt before hashing (head or tail position)
- **Hash Pattern Test**: Input hash value and test to find out algorithm
- **Color-coded UI**: Clear visual feedback with loading indicators

## Installation

### Prerequisites
- Node.js (v20)
- npm (comes with Node.js)

### Setup
```bash
git clone https://github.com/G0ldenRat10/BrutalHash.git
cd BrutalHash
```

If you do not have Node.js with version 20.0.0, pick one of the options:
- Manually: install via Node Version Manager (NVM)
	```bash
	curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
	source ~/.bashrc    # ~/.zshrc -> if user shell ZSH
	nvm install 20
	nvm use 20
	```
 
- Download an LTS installer from https://nodejs.org and follow the prompts.

- Built-in installer (easiest): install via bash script that comes with downloading BrutalHash
  	```bash
   	chmod +x install_node_20.sh
   	./install_node_20.sh
   	```

### Install Dependencies
After Node.js is installed, install npm dependencies (built-in installer will do it for you):
```bash
npm install
```

## Running BrutalHash
Once dependencies are installed, start the program:

```bash
node main.js
```

## Usage

### Hash Generation
Choose from 17 supported algorithms and optionally add salt to your text before hashing.

### Dictionary Attack
1. Select a wordlist (or create a custom one)
2. Choose attack method (Dictionary or Stream)
3. Enter the hash to crack
4. Select the hash algorithm type
5. View status and start the attack

### Hash Pattern Test
1. Paste hash value into input field
2. Tool runs regex for MD5, SHA1, SHA2, SHA3, BLAKE2, RIPEMD-160, SHAKE128/256, SM3 ...
3. Writes down the list of the potential algorithms used for that specific hash value.

## Supported Hash Algorithms
- MD5, MD5-SHA1
- SHA-1
- SHA-224, SHA-256, SHA-384, SHA-512
- SHA3-224, SHA3-256, SHA3-384, SHA3-512
- BLAKE2s-256, BLAKE2b-512
- RIPEMD-160
- WHIRLPOOL

## Note
This tool is for educational and authorized security testing purposes only. Use responsibly.
