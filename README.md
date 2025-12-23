# BrutalHash
Node.js toolkit for hash/dehash related CyberSecurity use and brute-force option.

## Features
- **Hash Generation**: Support for 15+ hash algorithms (MD5, SHA-1, SHA-2, SHA-3, BLAKE2, RIPEMD-160, WHIRLPOOL)
- **Dictionary Attack**: Crack hashes using wordlists with two attack methods:
- **Dictionary Attack**: Fast, loads wordlist into memory
- **Stream Attack**: Memory-efficient, processes line by line
- **Custom Wordlists**: Create your own wordlists on the fly
- **Salt Support**: Add salt before hashing (head or tail position)
- **Color-coded UI**: Clear visual feedback with loading indicators

## Installation

### Prerequisites
- Node.js 
- npm 

### Setup
1. Clone the repository:
```bash
git clone https://github.com/G0ldenRat10/BrutalHash.git
cd BrutalHash
```

2. Install dependencies:
```bash
npm install
```

3. Run the program:
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
