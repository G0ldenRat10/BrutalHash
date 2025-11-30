import {asciiArt, asciiMenu} from './asciiStorage.js'
import crypto, { hash } from 'crypto';
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
    // TO-D0 Will soon implement random hash with it's clear-text result.
}

async function restartHashMenu() {
    const restartQ = await input(`\n'r' - restart program , 'q' - quit program : \n`)
    if (restartQ.toLowerCase() != 'r' && restartQ != 'q') {
        console.log('ERROR: Enter valid choice.');
        await restartHashMenu();
    } else if (restartQ.toLowerCase() === 'q') {
        console.log('\nExiting the program...');
        process.exit(0);
    } else {
        await hashMenu();
    };
}

async function hashMenu(restart=false) {
    const dictHashes = {
    1:'md5',
    2:'md5-sha1',
    3:'sha1',
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
        await hashMenu(restart=true);
    } else if (choiceNum < 1 || choiceNum > 15) {
        console.log('\nERROR: Number between 1-15 must be entered.');
        await hashMenu(restart=true);
    }
    const type = dictHashes[algChoice];

    const text = await input('\nEnter word of choice: \n');

    const result = generateHash(text,type);
    console.log(`\nResult in ${type} format:\n`)
    console.log(result);

    await restartHashMenu();
}

async function __main__() {
    console.log(asciiArt);
    hashMenu();
}

__main__();

