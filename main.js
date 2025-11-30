import fs from 'fs'
import {asciiArt, asciiMenu, mainMenuASCII} from './asciiStorage.js'
import crypto from 'crypto';
import readline from 'readline';

// Functions:

function input(question) {
    const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
    });
    return new Promise(resolve => rl.question(question, ans => {
        rl.close();
        resolve(ans);
    }));
}

function generateHash(text,type) {
    return crypto.createHash(type).update(text).digest('hex');
    // TO-DO Will soon implement random hash with its clear-text result.
}

async function dictionaryAttackInMemory(targetHash, wordlist, hashAlgorithm) {
    const startTime = Date.now();
    let attempts = 0;
    
    // Prvo se izvrsi for loop, onda sledi prikaz
    for (let i = 0; i < wordlist.length; i++) {

        attempts++;
        const currentWord = wordlist[i].trim();
        if (!currentWord) continue; // Ako je empty space, nastavi loop dalje

        const testHash = generateHash(currentWord, hashAlgorithm);

        if (testHash === targetHash) {
            const endTime = Date.now() - startTime;
            console.log(`\nDictionary attack finished.\n`)
            console.log(`\nStatus: FOUND\nPassword: ${currentWord}\nAttempts: ${attempts}\nTime: ${endTime}ms`);
            return currentWord;
        }

        if (attempts % 20000 === 0) {
            console.log(`\nCurrently at: ${attempts} attempts`);
        }
    }
    const endTime = Date.now() - startTime;
    console.log(`\nDictionary attack finished.\n`);
    console.log(`\nStatus: NOT FOUND\nPassword: Unknown \nAttempts: ${attempts}\nTime: ${endTime}ms`);
}

async function dictionaryAttackStream(targetHash, filePath, hashAlgorithm) {
    const startTime = Date.now();

    const fileStream = fs.createReadStream(filePath);

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let attempts = 0;
    let found = null;
    let endTime = null;

    for await (const line of rl) {
        // A line may contain multiple words separated by whitespace.
        // Split the line into tokens and test each token separately.
        const tokens = line.split(/\s+/);
        for (const token of tokens) {
            const currentWord = token.trim();
            if (!currentWord) continue;

            attempts++;
            const testHash = generateHash(currentWord, hashAlgorithm);

            if (testHash === targetHash) {
                found = currentWord;
                break;
            }
        }
        if (found) break;
    }

    endTime = Date.now() - startTime;
    rl.close();
    console.log(`\nDictionary attack finished.\n`);
    if (found === null) console.log(`\nStatus: NOT FOUND\nPassword: Unknown \nAttempts: ${attempts}\nTime: ${endTime}ms`);
    else console.log(`\nStatus: FOUND\nPassword: ${found}\nAttempts: ${attempts}\nTime: ${endTime}ms`);
    return found;
}

async function dictionaryAttack(targetHash, wordListSource, hashAlgorithm) {

    console.log('Brutal Hash - Dictionary Attack');
    console.log('='.repeat(50));

    if (typeof wordListSource === 'string') {
        // Stream attack, resource saving
        return await dictionaryAttackStream(targetHash, wordListSource, hashAlgorithm);
    } else {
        // Memory attack, easy on resource
        return dictionaryAttackInMemory(targetHash, wordListSource, hashAlgorithm);
    }

}

async function hashMenu(restart=false) {

    async function restartHashMenu() {
    const restartQ = await input(`\n'b' - return to Hash Menu , 'q' - return to Main Menu : \n`)
    if (restartQ.toLowerCase() != 'b' && restartQ.toLowerCase() != 'q') {
        console.log('ERROR: Enter valid choice.');
        await restartHashMenu();
    } else if (restartQ.toLowerCase() === 'q') {
        await mainMenu();
    } else {
        await hashMenu();
    }}

    const dictHashes = {
    1:'md5',
    2:'sha1',
    3:'sha256',
    4:'sha224',
    5:'sha256',
    6:'sha384',
    7:'sha512',
    8:'sha3-224',
    9:'sha3-256',
    10:'sha3-384',
    11:'sha3-512',
    12:'blake2s256',
    13:'blake2b512',
    14:'ripemd160',
    15:'whirlpool',
    };
    if (restart === false) {
        console.log(asciiMenu);
    } 
    const algChoice = await input('\nEnter number: \n');

    if (algChoice.toLowerCase() === 'q') {
        console.log('\nExiting the program...');
        process.exit(0);
    }
    const choiceNum = Number(algChoice);
    if (isNaN(choiceNum)) {
        console.log('\nERROR: Number must be entered.');
        await hashMenu(true);
    } else if (choiceNum < 1 || choiceNum > 15) {
        console.log('\nERROR: Number between 1-15 must be entered.');
        await hashMenu(true);
    }
    const type = dictHashes[algChoice];

    const text = await input('\nEnter word of choice: \n');

    const result = generateHash(text,type);
    console.log(`\nResult in ${type} format:\n`)
    console.log(result);

    await restartHashMenu();
}

async function mainMenu(restart=false) {
    if (restart === false) {
        console.log(mainMenuASCII);
    }
    let choiceNum = await input('\nEnter number: \n');
    if (isNaN(choiceNum)) {
        console.log('\nERROR: Number must be entered.\n');
        await mainMenu(true);
    } else if (choiceNum < 1 || choiceNum > 3) {
        console.log('\nERROR: Number between 1-3 must be entered.\n');
        await mainMenu(true);
    }
    choiceNum = Number(choiceNum);
    if (choiceNum === 1) {
        await hashMenu();
    } else if (choiceNum === 2) {
        // TO-DO napravi Cracking Menu
    } else {
        console.log('\nINFO: Exiting the program.\n');
        //process.exit(0); // TODO - Until the menu is added, stays like this.
    }
}

// Showcase of Main:
await mainMenu();

// Dictionary test:
// Soon updated with own Menu
console.log('\nStarting Dictionary test showcase...\n')
const wordToTest = 'randomWordHere';
const targetHash = crypto.createHash('md5').update(wordToTest).digest('hex');
console.log(`Hash to test: ${targetHash}, Word in clear-text: ${wordToTest}\n\n`);
const wordListSource = './BrutalHashJS/Wordlists/dictionaryTest.txt';
const hashAlgorithm = 'md5';

await dictionaryAttack(targetHash,wordListSource,hashAlgorithm);
