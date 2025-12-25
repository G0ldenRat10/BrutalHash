import fs from 'fs'
import path from 'path'
import ora from 'ora'
import chalk from 'chalk'
import {asciiArt, 
        asciiMenu, 
        mainMenuASCII, 
        crackingMenuASCII, 
        dictionaryListMenuASCIIHead,
        dictionaryListMenuASCIITail,
        dictionaryListMenuASCIIEnd,
        dictionaryListMenuASCIITitle,
        dictionaryCustomTitle,
        dictionaryCustomName,
        statusDictionary,
        dictionaryAttackMethodMenuASCII} from './asciiStorage.js'
import crypto from 'crypto';
import readline from 'readline';

import { fileURLToPath } from 'url';

// Resolve __dirname in ESM:

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getDictFolder() {
    const preferred = path.join(__dirname, 'Wordlists');
    if (fs.existsSync(preferred) && fs.statSync(preferred).isDirectory()) return preferred;
    return preferred; 
}

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

async function pressEnterToContinue() {
    await input(chalk.cyan('\nPress Enter to continue...\n'));
}

function generateHash(text,type) {
    return crypto.createHash(type).update(text).digest('hex');
}

async function dictionaryAttackInMemory(targetHash, wordlist, hashAlgorithm) {
    const startTime = Date.now();
    let attempts = 0;
    
    // First execute for loop, then display results
    for (let i = 0; i < wordlist.length; i++) {

        attempts++;
        const currentWord = wordlist[i].trim();
        if (!currentWord) continue; // to skip empty lines
        const testHash = generateHash(currentWord, hashAlgorithm);

        if (testHash === targetHash) {
            const endTime = Date.now() - startTime;
            console.log(`\nDictionary attack finished.`)
            console.log(chalk.green(`✓ Status: FOUND\n✓ Password: ${currentWord}\n✓ Attempts: ${attempts}\n✓ Time: ${endTime}ms`));
            return currentWord;
        }

        if (attempts % 20000 === 0) {
            console.log(chalk.blue(`◆ Currently at: ${attempts} attempts`));
        }
    }
    const endTime = Date.now() - startTime;
    console.log(`\nDictionary attack finished.`);
    console.log(chalk.red(`✗ Status: NOT FOUND\n✗ Password: Unknown \n✗ Attempts: ${attempts}\n✗ Time: ${endTime}ms`));
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
    console.log(`\nDictionary attack finished.`);
    if (found === null) console.log(chalk.red(`✗ Status: NOT FOUND\n✗ Password: Unknown \n✗ Attempts: ${attempts}\n✗ Time: ${endTime}ms`));
    else console.log(chalk.green(`✓ Status: FOUND\n✓ Password: ${found}\n✓ Attempts: ${attempts}\n✓ Time: ${endTime}ms`));
    return found;
}

async function dictionaryAttack(targetHash, wordListSource, hashAlgorithm, attackMethod) {

    console.log('Brutal Hash - Dictionary Attack');
    console.log('='.repeat(50));

    // Logic to not damage PC in case attackMethod is undefined:
    if (attackMethod === undefined) {
        if (typeof wordListSource === 'string') {
            // Stream attack, resource saving
            return await dictionaryAttackStream(targetHash, wordListSource, hashAlgorithm);
        } else {
            // Memory attack, hard on resource
            return dictionaryAttackInMemory(targetHash, wordListSource, hashAlgorithm);
        }
    // If attackMethod is picked:
    } else if (attackMethod === 'Dictionary_Attack') {
        return dictionaryAttackInMemory(targetHash, wordListSource, hashAlgorithm);
    } else if (attackMethod === 'Stream_Attack') {
        return dictionaryAttackStream(targetHash,wordListSource,hashAlgorithm);
    }

}

async function loadDictionaryList() {
    const folderPath = getDictFolder();
    const spinner = ora('Loading dictionary list...').start();
    try {
        const files = await fs.promises.readdir(folderPath);
        const result = [];
        for (const f of files) {
            const full = path.join(folderPath, f);
            try {
                const stat = await fs.promises.stat(full);
                if (stat.isFile()) {
                    result.push({ name: f, path: full, size: stat.size });
                }
            } catch (e) {
                // skip
            }
        }
        spinner.succeed('Dictionary list loaded!');
        return result;
    } catch (err) {
        spinner.fail('Error reading Wordlists folder');
        return [];
    }
}

async function displayList() {
    const oldResult = await loadDictionaryList();
    let newResult = [];
    for (let i = 0; i < oldResult.length; i++) {
        const newElement = `${i + 1}.  File: ${oldResult[i].name}  Path: ${oldResult[i].path}  Size: ${oldResult[i].size}`
        newResult.push(newElement);
    }
    console.log(dictionaryListMenuASCIITitle);
    console.log(dictionaryListMenuASCIIHead);
    for (let i = 0; i < newResult.length; i++) {
        console.log(newResult[i]);
    }
    console.log(dictionaryListMenuASCIITail);
    console.log(dictionaryListMenuASCIIEnd);
}

async function selectDictionaryMenu(restart=false) {
    if (restart === false) {
        await displayList();
    }
    const dictionaryList = await loadDictionaryList();
    const listLength = dictionaryList.length;
    const userInputRaw = (await input('\nEnter number: \n')).trim();

    if (userInputRaw.toLowerCase() === 'b') {
        await crackingMenu();
        return null;
    }

    const choiceNum = Number(userInputRaw);
    if (isNaN(choiceNum)) {
        console.log(chalk.red('\nERROR: Number must be entered.\n'));
        return await selectDictionaryMenu(true);
    }

    if (choiceNum < 1 || choiceNum > listLength) {
        console.log(chalk.red('\nERROR: Number must be entered in given range.\n'));
        return await selectDictionaryMenu(true);
    }

    const idx = choiceNum - 1;
    const setFilePath = dictionaryList[idx].path;
    console.log(chalk.green(`✓ '${dictionaryList[idx].name}' set as active file.`));
    return setFilePath;
} 

async function selectCustomDictionaryMenu() {
    // Create a new custom dictionary file with user-provided words
    const listOfWords = [];

    console.log(dictionaryCustomName);
    let userInput = (await input('\nEnter file name (without extension): \n')).trim();
    if (!userInput) {
        console.log(chalk.red('\nERROR: File name cannot be empty.'));
        return await selectCustomDictionaryMenu();
    }
    // sanitize filename (basic)
    userInput = userInput.replace(/[^a-zA-Z0-9_\-]/g, '_') + '.txt';

    console.log(dictionaryCustomTitle);
    const userInput2 = (await input('\nHow many words to add: \n')).trim();
    if (isNaN(userInput2)) {
        console.log(chalk.red('\nERROR: Number must be entered.\n'));
        return await selectCustomDictionaryMenu();
    }
    const numberOfWords = Number(userInput2);
    if (numberOfWords < 1) {
        console.log(chalk.red('\nERROR: Invalid range.\n'));
        return await selectCustomDictionaryMenu();
    }

    for (let i = 0; i < numberOfWords; i++) {
        const word = (await input(`\nEnter word ${i + 1} of ${numberOfWords}:\n`)).trim();
        if (!word) {
            console.log('Skipping empty word.');
            continue;
        }
        listOfWords.push(word);
    }

    const dictDir = getDictFolder();
    try {
        await fs.promises.mkdir(dictDir, { recursive: true });
    } catch (e) {
        // ignore
    }

    const newPath = path.join(dictDir, userInput);
    try {
        const spinner = ora('Writing file...').start();
        await fs.promises.writeFile(newPath, listOfWords.join('\n') + '\n', 'utf8');
        spinner.succeed(chalk.green(`File successfully written to ${newPath}`));
        return newPath;
    } catch (err) {
        console.error(chalk.red('Error writing file:'), err.message);
        return undefined;
    }
}

async function selectAttackMethodMenu(restart=false) {
    if (restart ===  false) {
        console.log(dictionaryAttackMethodMenuASCII);
    }
    const userInputRaw = (await input('\nEnter number: \n')).trim();

    if (userInputRaw.toLowerCase() === 'b') {
        await crackingMenu();
        return undefined;
    }

    const choiceNum = Number(userInputRaw);

    if (isNaN(choiceNum)) {
        console.log(chalk.red('\nERROR: Number must be entered.\n'));
        return await selectAttackMethodMenu(true);
    }

    if (choiceNum < 1 || choiceNum > 2) {
        console.log(chalk.red('\nERROR: Number must be entered in given range.\n'));
        return await selectAttackMethodMenu(true);
    }

    if (choiceNum === 1) {
        return 'Dictionary_Attack';
    } else if (choiceNum === 2) {
        return 'Stream_Attack';
    };
}


async function hashMenu(restart=false) {

    async function restartHashMenu() {
    const restartQ = await input(`\n'b' - return to Hash Menu , 'q' - return to Main Menu : \n`)
    if (restartQ.toLowerCase() != 'b' && restartQ.toLowerCase() != 'q') {
        console.log(chalk.red('ERROR: Enter valid choice.'));
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

    if (algChoice.toLowerCase() === 'b') {
        await mainMenu();
    }
    const choiceNum = Number(algChoice);
    if (isNaN(choiceNum)) {
        console.log(chalk.red('\nERROR: Number must be entered.'));
        await hashMenu(true);
    } else if (choiceNum < 1 || choiceNum > 15) {
        console.log(chalk.red('\nERROR: Number between 1-15 must be entered.'));
        await hashMenu(true);
    }
    const type = dictHashes[algChoice];

    const text = await input('\nEnter word of choice: \n');
    const saltedText = await saltingPromp(text);
    if (saltedText === undefined) {
        const result = generateHash(text,type);
        console.log(`Result in ${type} format:\n`)
        console.log(chalk.yellow(result));
        await restartHashMenu();
    } else {
        const result = generateHash(saltedText,type);
        console.log(`Result in ${type} format + added salt:\n`)
        console.log(chalk.yellow(result));
        await restartHashMenu();
    }
}

function pickAlgorithmMenu(n) {
    const dictHashes = {
        '1':'md5',
        '2':'sha1',
        '3':'sha256',
        '4':'sha224',
        '5':'sha256',
        '6':'sha384',
        '7':'sha512',
        '8':'sha3-224',
        '9':'sha3-256',
        '10':'sha3-384',
        '11':'sha3-512',
        '12':'blake2s256',
        '13':'blake2b512',
        '14':'ripemd160',
        '15':'whirlpool',
    };
    return dictHashes[n];
}

async function saltingPromp(text) {

    const q = (await input('\nWould you like to add salt before hashing? (y/n): \n')).toLowerCase();

    if (q === 'y') {
        const salt = await input('\nInput salt to add: \n');
        async function getResult(salt,text) {
            const q2 = (await input('\nPositioning of the salt (h - head / t - tail): \n')).toLowerCase();
            if (q2 === 'h') {
            const result = `${salt}${text}`;
            return result;
            } else if (q2 === 't') {
                const result = `${text}${salt}`;
                return result;
            } else {
                console.log(chalk.red('\nERROR: Invalid choice. \n'));
                // Recursion again
                return await getResult(salt,text,q2);
            }
        }
        return getResult();
    } else if (q === 'n') {
        return;
    } else {
           console.log(chalk.red('\nERROR: Invalid input. \n'));
           // Recursion again
           return await saltingPromp(text); 
    }
}

async function crackingMenu(restart=false,activeFilePath,activeAttackMethod,activeHashToCrack,activeHashAlgorithm) {
    if (restart === false) {
        console.log(crackingMenuASCII);
    }
    let choiceNum = await input('\nEnter number: \n');
    if (choiceNum === 'b' || choiceNum === 'B') {
        await mainMenu();
    } else if (isNaN(choiceNum)) {
        console.log(chalk.red('\nERROR: Number must be entered.\n'));
        await crackingMenu(true);
    } else if (choiceNum < 1 || choiceNum > 7) {
        console.log(chalk.red('\nERROR: Number between 1-7 must be entered.\n'));
        await crackingMenu(true);
    }

    choiceNum = Number(choiceNum);

    if (choiceNum === 1) {
        activeFilePath = await selectDictionaryMenu();
        await crackingMenu(restart=false,activeFilePath=activeFilePath,activeAttackMethod=activeAttackMethod,activeHashToCrack=activeHashToCrack,activeHashAlgorithm=activeHashAlgorithm);
    } else if (choiceNum === 2) {
        const customPath = await selectCustomDictionaryMenu();
        if (customPath) {
            activeFilePath = customPath;
        }
        await crackingMenu(restart=false,activeFilePath=activeFilePath,activeAttackMethod=activeAttackMethod,activeHashToCrack=activeHashToCrack,activeHashAlgorithm=activeHashAlgorithm);
    } else if (choiceNum === 3) {
        activeAttackMethod = await selectAttackMethodMenu();
        await crackingMenu(restart=false,activeFilePath=activeFilePath,activeAttackMethod=activeAttackMethod,activeHashToCrack=activeHashToCrack,activeHashAlgorithm=activeHashAlgorithm);
    } else if (choiceNum === 4) {
        activeHashToCrack = await input('\nEnter hash to crack: \n');
        console.log(chalk.green(`✓ Hash set: ${activeHashToCrack.substring(0, 20)}...`));
        await crackingMenu(restart=false,activeFilePath=activeFilePath,activeAttackMethod=activeAttackMethod,activeHashToCrack=activeHashToCrack,activeHashAlgorithm=activeHashAlgorithm);
    } else if (choiceNum === 5) {
        console.log(asciiMenu);
        let inputNumber = await input('\nEnter number: \n');
        inputNumber = inputNumber.trim();
        if (isNaN(inputNumber) || inputNumber < 1 || inputNumber > 15) {
            console.log(chalk.red('\nERROR: Number between 1-15 must be entered.\n'));
        } else {
            activeHashAlgorithm = pickAlgorithmMenu(inputNumber);
            console.log(chalk.green(`✓ '${activeHashAlgorithm}' set as active hash algorithm.`));
        }
        await crackingMenu(restart=false,activeFilePath=activeFilePath,activeAttackMethod=activeAttackMethod,activeHashToCrack=activeHashToCrack,activeHashAlgorithm=activeHashAlgorithm);
    } else if (choiceNum === 6) {
        console.log(statusDictionary);
        console.log(`- Hash to dehash: ${activeHashToCrack}`);
        console.log(`- Hash type: ${activeHashAlgorithm}`);
        console.log(`- Wordlist: ${activeFilePath}`);
        if (activeAttackMethod === 'Dictionary_Attack') {
            console.log(chalk.yellow(`- Attack Method: ${activeAttackMethod} (WARNING: NOT SUGGESTED FOR PC WITH LOW RAM!)`));
        } else {
            console.log(`- Attack Method: ${activeAttackMethod}`);
        }
        console.log(dictionaryListMenuASCIITail);
        await crackingMenu(restart=false,activeFilePath=activeFilePath,activeAttackMethod=activeAttackMethod,activeHashToCrack=activeHashToCrack,activeHashAlgorithm=activeHashAlgorithm);
    } else if (choiceNum === 7) {
        // Validation that all data is entered
        if (!activeFilePath) {
            console.log(chalk.red('\nERROR: Please select a wordlist first (Option 1).\n'));
            await crackingMenu(restart=false,activeFilePath,activeAttackMethod,activeHashToCrack,activeHashAlgorithm);
            return;
        }
        if (!activeAttackMethod) {
            console.log(chalk.red('\nERROR: Please select attack method first (Option 3).\n'));
            await crackingMenu(restart=false,activeFilePath,activeAttackMethod,activeHashToCrack,activeHashAlgorithm);
            return;
        }
        if (!activeHashToCrack) {
            console.log(chalk.red('\nERROR: Please enter target hash first (Option 4).\n'));
            await crackingMenu(restart=false,activeFilePath,activeAttackMethod,activeHashToCrack,activeHashAlgorithm);
            return;
        }
        if (!activeHashAlgorithm) {
            console.log(chalk.red('\nERROR: Please select hash algorithm first (Option 5).\n'));
            await crackingMenu(restart=false,activeFilePath,activeAttackMethod,activeHashToCrack,activeHashAlgorithm);
            return;
        }
        
        console.log('\n='.repeat(50));
        console.log(chalk.cyan('STATUS: Attack started'));
        console.log('='.repeat(50));
        console.log('\n');
        
        let wordListSource;

        if (activeAttackMethod === 'Dictionary_Attack') {
            // Dictionary_Attack
            const spinner = ora('Loading wordlist into memory...').start();
            const content = await fs.promises.readFile(activeFilePath, 'utf8');
            wordListSource = content.split('\n');
            spinner.succeed(`Loaded ${wordListSource.length} words`);
        } else {
            // Stream_Attack 
            wordListSource = activeFilePath;
        }
        
        await dictionaryAttack(activeHashToCrack, wordListSource, activeHashAlgorithm);
        
        await pressEnterToContinue();
        await crackingMenu(restart=false,activeFilePath,activeAttackMethod,activeHashToCrack,activeHashAlgorithm);
    } else {
        console.log('\nINFO: Exiting the program.\n');
        //process.exit(0); // TODO - Until the menu is added, stays like this.
    }
}

async function mainMenu(restart=false) {
    if (restart === false) {
        console.log(mainMenuASCII);
    }
    let choiceNum = await input('\nEnter number: \n');
    if (isNaN(choiceNum)) {
        console.log(chalk.red('\nERROR: Number must be entered.\n'));
        await mainMenu(true);
    } else if (choiceNum < 1 || choiceNum > 3) {
        console.log(chalk.red('\nERROR: Number between 1-3 must be entered.\n'));
        await mainMenu(true);
    }
    choiceNum = Number(choiceNum);
    if (choiceNum === 1) {
        await hashMenu();
    } else if (choiceNum === 2) {
        await crackingMenu();
    } else {
        console.log(chalk.yellow('\nINFO: Exiting the program.\n'));
        process.exit(0);
    }
}

// Main: 

console.log(chalk.yellow(asciiArt));
await mainMenu();