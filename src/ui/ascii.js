export const asciiArt = `\n
 ╱$$$$$$$                        ╱$$               ╱$$ ╱$$   ╱$$                     ╱$$        
│ $$__  $$                      │ $$              │ $$│ $$  │ $$                    │ $$       
│ $$  ╲ $$  ╱$$$$$$  ╱$$   ╱$$ ╱$$$$$$    ╱$$$$$$ │ $$│ $$  │ $$  ╱$$$$$$   ╱$$$$$$$│ $$$$$$$  
│ $$$$$$$  ╱$$__  $$│ $$  │ $$│_  $$_╱   │____  $$│ $$│ $$$$$$$$ │____  $$ ╱$$_____╱│ $$__  $$
│ $$__  $$│ $$  ╲__╱│ $$  │ $$  │ $$      ╱$$$$$$$│ $$│ $$__  $$  ╱$$$$$$$│  $$$$$$ │ $$  ╲ $$
│ $$  ╲ $$│ $$      │ $$  │ $$  │ $$ ╱$$ ╱$$__  $$│ $$│ $$  │ $$ ╱$$__  $$ ╲____  $$│ $$  │ $$
│ $$$$$$$╱│ $$      │  $$$$$$╱  │  $$$$╱│  $$$$$$$│ $$│ $$  │ $$│  $$$$$$$ ╱$$$$$$$╱│ $$  │ $$
│_______╱ │__╱       ╲______╱    ╲___╱   ╲_______╱│__╱│__╱  │__╱ ╲_______╱│_______╱ │__╱  │__╱ 
\n`;


export const asciiMenu = `
╔═══════════════════════════════════════════════╗
║               HASH FAMILIES:                  ║
╚═══════════════════════════════════════════════╝

┌─ MD5 Family ──────────────────────────────────┐
│ 1. MD5          - 128-bit hash                │
│ 2. MD5-SHA1     - Combined hash               │
└───────────────────────────────────────────────┘

┌─ SHA-1 ───────────────────────────────────────┐
│ 3. SHA-1        - 160-bit hash                │
└───────────────────────────────────────────────┘

┌─ SHA-2 Family ────────────────────────────────┐
│ 4. SHA-224      - 224-bit secure hash         │
│ 5. SHA-256      - 256-bit secure hash         │
│ 6. SHA-384      - 384-bit secure hash         │
│ 7. SHA-512      - 512-bit secure hash         │
└───────────────────────────────────────────────┘

┌─ SHA-3 Family ────────────────────────────────┐
│ 8. SHA3-224     - 224-bit Keccak hash         │
│ 9. SHA3-256     - 256-bit Keccak hash         │
│ 10. SHA3-384    - 384-bit Keccak hash         │
│ 11. SHA3-512    - 512-bit Keccak hash         │
└───────────────────────────────────────────────┘

┌─ BLAKE2 Family ───────────────────────────────┐
│ 12. BLAKE2s-256 - 256-bit optimized hash      │
│ 13. BLAKE2b-512 - 512-bit optimized hash      │
└───────────────────────────────────────────────┘

┌─ RIPEMD / XOF / NATIONAL ─────────────────────┐
│ 14. RIPEMD-160  - 160-bit European hash       │
│ 15. SHAKE128    - Extendable-output hash      │
│ 16. SHAKE256    - Extendable-output hash      │
│ 17. SM3         - Chinese national hash       │
└───────────────────────────────────────────────┘

╔═══════════════════════════════════════════════╗
║ Enter 1-17 to select algorithm • b to back    ║
╚═══════════════════════════════════════════════╝
`;

export const crackingMenuASCII = `
╔═══════════════════════════════════════════════╗
║                 CRACKING MENU                 ║
╚═══════════════════════════════════════════════╝

┌─ OPTIONS ─────────────────────────────────────┐
│ 1. Select Wordlist         - Equip from list  │
│ 2. Make Custom Wordlist    - Create your own  │
│ 3. Select Attack Method    - Pick best suited │
| 4. Enter Hash to crack     - Input hash       |
| 5. Select type of hash     - Info about type  |
│ 6. Show Status             - See equiped stats│
│ 7. Start Attack            - Start cracking   │
└───────────────────────────────────────────────┘

╔═══════════════════════════════════════════════╗
║     Enter 1-7 to select option • b to back    ║
╚═══════════════════════════════════════════════╝
`


export const mainMenuASCII = `
┌───────────────────────────────────────────────┐
│                   MAIN MENU                   │
└───────────────────────────────────────────────┘

    ┌─  HASHING   ─────────────────────────────┐
    │  1. Hash Text                            │
    │     • Generate hashes from any text      │
    │     • Support for 15+ algorithms         │
    │     • Fast batch processing              │
    └──────────────────────────────────────────┘

    ┌─  CRACKING   ────────────────────────────┐
    │  2. Dictionary Attack                    │
    │     • Crack hashes using wordlists       │
    │     • Optimized for performance          │
    │     • RockYou.txt compatible             │
    └──────────────────────────────────────────┘

    ┌─  ANALYSIS   ────────────────────────────┐
    │  3. Hash Pattern Test                    │
    │     • Analyze hash format & length       │
    │     • Detect most likely algorithm       │
    │     • Regex-based validation             │
    └──────────────────────────────────────────┘

    ┌─  EXIT   ────────────────────────────────┐
    │  4. Exit Program                         │
    │     • Close Brutal Hash                  │
    │     • Return to terminal                 │
    └──────────────────────────────────────────┘

╔═══════════════════════════════════════════════╗
║  Enter 1-4 to select • Ctrl+C to brute Exit   ║
╚═══════════════════════════════════════════════╝
`;

export const dictionaryListMenuASCIITitle = `
╔═══════════════════════════════════════════════╗
║               DICTIONARY LIST MENU            ║
╚═══════════════════════════════════════════════╝
`
export const dictionaryListMenuASCIIHead = `
─ AVAILABLE DICTIONARIES ────────────────────────
`

export const dictionaryListMenuASCIITail = `
─────────────────────────────────────────────────
`

export const dictionaryListMenuASCIIEnd = `
╔════════════════════════════════════════════════╗
║ Enter number to select dictionary • b to back  ║
╚════════════════════════════════════════════════╝
`
export const dictionaryCustomTitle = `
╔════════════════════════════════════════════════════╗
║ Enter number of words you will use in custom list  ║
║         • s to stop making custom list             ║
╚════════════════════════════════════════════════════╝
`

export const dictionaryCustomName = `
╔════════════════════════════════════════════════════╗
║       Enter the name of this new dictionary        ║
║         • s to stop making custom list             ║
╚════════════════════════════════════════════════════╝
`

export const statusDictionary = `
╔═══════════════════════════════════════════════╗
║                    STATUS                     ║
╚═══════════════════════════════════════════════╝
`

export const dictionaryAttackMethodMenuASCII = `
╔═══════════════════════════════════════════════╗
║            SELECT ATTACK METHOD               ║
╚═══════════════════════════════════════════════╝

┌─ METHODS ─────────────────────────────────────┐
│ 1. Dictionary Attack (In-Memory)              │
│      • Loads full wordlist into RAM           │
│ 2. Stream Attack (On-Disk)                    │
│      • Reads wordlist line-by-line            │
└───────────────────────────────────────────────┘

╔═══════════════════════════════════════════════╗
║     Enter 1-2 to select method • b to back    ║
╚═══════════════════════════════════════════════╝
`

export const patternRegexHashASCII = `
╔════════════════════════════════════════════════════╗
║   TEST HASH AND FIND MOST PATTERNABLE ALGORITHM    ║
╚════════════════════════════════════════════════════╝
`
