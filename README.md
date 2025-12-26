# BrutalHash
Node.js toolkit for hash/dehash related CyberSecurity use and brute-force option.

## Features
- **Hash Generation**: Support for 15+ hash algorithms (MD5, SHA-1, SHA-2, SHA-3, BLAKE2, RIPEMD-160, WHIRLPOOL)
- **Dictionary Attack**: Dva moda (in-memory i stream). In-memory je brži ali troši više RAM-a, stream je štedljiviji i radi i na velikim (rockyou) fajlovima.
- **Custom Wordlists**: Create your own wordlists on the fly
- **Salt Support**: Add salt before hashing (head or tail position)
- **Hash Pattern Test**: Nalepi hash i dobićeš najverovatnije algoritme na osnovu regex/dužine
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
Choose from 15 supported algorithms and optionally add salt to your text before hashing.

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

## Project Structure
```
BrutalHash/
├── main.js              # Glavni program (ostaje netaknut)
├── asciiStorage.js      # Re-export ASCII resursa iz src/ui/ascii.js
├── src/
│   └── ui/
│       └── ascii.js     # ASCII art i layout menija
├── Wordlists/           # Podrazumevani wordlist primeri (npr. test100.txt)
├── package.json         # Dependencies
├── install_node_20.sh   # Pomoćni installer za Node 20
└── README.md
```

## Note
This tool is for educational and authorized security testing purposes only. Use responsibly.
