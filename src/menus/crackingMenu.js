import fs from 'fs'
import path from 'path'
import ora from 'ora'
import chalk from 'chalk'
import { fileURLToPath } from 'url';
import { crackingMenuASCII,
         dictionaryListMenuASCIIHead,
         dictionaryListMenuASCIITail,
         dictionaryListMenuASCIIEnd,
         dictionaryListMenuASCIITitle,
         dictionaryCustomTitle,
         dictionaryCustomName,
         statusDictionary,
         dictionaryAttackMethodMenuASCII,
         asciiMenu } from '../ui/ascii.js'
import { input, pressEnterToContinue } from '../core/input.js'
import { dictionaryAttack } from '../core/attack.js'

// Resolve __dirname in ESM:

const __filename = fileURLToPath(import.meta.url); // -> ../BrutalHash/src/menus/crackingMenu.js
const __dirname = path.join(path.dirname(__filename), '..', '..'); // file moved into src/menus/ -> climb 2 levels back to project root /BrutalHash

function getDictFolder() {
    const preferred = path.join(__dirname, 'Wordlists'); // /BrutalHash/Wordlists check -> ?
    if (fs.existsSync(preferred) && fs.statSync(preferred).isDirectory()) return preferred;  // turn back  if it exists
    return preferred;
}

async function loadDictionaryList() {
    const folderPath = getDictFolder();
    const spinner = ora('STATUS: Loading dictionary list...').start();
    try {
        const files = await fs.promises.readdir(folderPath);         // load files
        const result = [];
        for (const f of files) {
            const full = path.join(folderPath, f);                   // -> FULLPATH/file
            try {
                const stat = await fs.promises.stat(full);
                if (stat.isFile()) {
                    result.push({ name: f, path: full, size: stat.size });
                }
            } catch (e) {
                spinner.fail('ERROR: Problem reading Wordlists folder.');
                return [];                                          // return empty []
            }
        }
        spinner.succeed('STATUS: Dictionary list loaded.');
        return result;
    } catch (err) {
        spinner.fail('ERROR:Problem reading Wordlists folder');
        return [];                                                  // --//--
    }
}

async function displayList() {
    const oldResult = await loadDictionaryList();   // convert tag format from list elements -> string format for display
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
    const userInput = (await input('\nEnter number: \n')).trim();

    if (userInput.toLowerCase() === 'b') {
        return null;                       // otkazi izbor wordliste, vrati se u Cracking meni
    }

    const choiceNum = Number(userInput);
    if (isNaN(choiceNum)) {
        console.log(chalk.red('\nERROR: Number must be entered.\n'));
        return await selectDictionaryMenu(true);
    }

    if (choiceNum < 1 || choiceNum > listLength) {
        console.log(chalk.red('\nERROR: Number must be entered in given range.\n'));
        return await selectDictionaryMenu(true);
    }

    const id = choiceNum - 1;
    const setFilePath = dictionaryList[id].path;
    console.log(chalk.green(`✓ '${dictionaryList[id].name}' set as active file.`));
    return setFilePath;
}

async function selectCustomDictionaryMenu() {
    const listOfWords = [];

    console.log(dictionaryCustomName);
    let userInput = (await input('\nEnter file name (without extension): \n')).trim();
    if (!userInput) {
        console.log(chalk.red('\nERROR: File name cannot be empty.'));
        return await selectCustomDictionaryMenu();
    }

    userInput = userInput.replace(/[^a-zA-Z0-9_\-]/g, '_') + '.txt';    // regex to turn it into formatable input

    console.log(dictionaryCustomTitle);
    const userInput2 = (await input('\nHow many words to add (in number): \n')).trim();
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

    // check for existing folder, if deleted make new
    try {
        await fs.promises.mkdir(dictDir, { recursive: true });
    } catch (err) {
        console.error(chalk.red('Failed to create directory:'), err.message);
        throw err;
    }
    // path.join -> PATH/new_file_name
    const newPath = path.join(dictDir, userInput);
    try {
        const spinner = ora('Writing file...').start();
        await fs.promises.writeFile(newPath, listOfWords.join('\n') + '\n', 'utf8'); // split file in rows
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
        return undefined;                  // otkazi izbor metode, vrati se u Cracking meni
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

function pickAlgorithmMenu(n) {
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
        15:'shake128',
        16:'shake256',
        17:'sm3'
    };
    return dictHashes[n];
}

async function crackingMenu(justEntered, session) {
    console.log(crackingMenuASCII);            // uvek - meni opcija mora da se vidi posle svake akcije
    let choiceNum = await input('\nEnter number: \n');
    if (choiceNum === 'b' || choiceNum === 'B') {
        return { type: 'pop' };                                  // nazad na MAIN
    } else if (isNaN(choiceNum)) {
        console.log(chalk.red('\nERROR: Number must be entered.\n'));
        return { type: 'stay' };
    } else if (choiceNum < 1 || choiceNum > 7) {
        console.log(chalk.red('\nERROR: Number between 1-7 must be entered.\n'));
        return { type: 'stay' };
    }

    choiceNum = Number(choiceNum);

    if (choiceNum === 1) {
        const selected = await selectDictionaryMenu();
        if (selected) session.activeFilePath = selected;         // null (otkazano) -> ne diraj
        return { type: 'stay' };
    } else if (choiceNum === 2) {
        const customPath = await selectCustomDictionaryMenu();
        if (customPath) {
            session.activeFilePath = customPath;
        }
        return { type: 'stay' };
    } else if (choiceNum === 3) {
        const method = await selectAttackMethodMenu();
        if (method) session.activeAttackMethod = method;         // undefined (otkazano) -> ne diraj
        return { type: 'stay' };
    } else if (choiceNum === 4) {
        session.activeHashToCrack = await input('\nEnter hash to crack: \n');
        console.log(chalk.green(`✓ Hash set: ${session.activeHashToCrack.substring(0, 20)}...`));
        return { type: 'stay' };
    } else if (choiceNum === 5) {
        console.log(asciiMenu);
        let inputNumber = await input('\nEnter number: \n');
        inputNumber = inputNumber.trim();
        if (isNaN(inputNumber) || inputNumber < 1 || inputNumber > 17) {
            console.log(chalk.red('\nERROR: Number between 1-17 must be entered.\n'));
        } else {
            session.activeHashAlgorithm = pickAlgorithmMenu(inputNumber);
            console.log(chalk.green(`✓ '${session.activeHashAlgorithm}' set as active hash algorithm.`));
        }
        return { type: 'stay' };
    } else if (choiceNum === 6) {
        console.log(statusDictionary);
        console.log(`- Hash to dehash: ${session.activeHashToCrack}`);
        console.log(`- Hash type: ${session.activeHashAlgorithm}`);
        console.log(`- Wordlist: ${session.activeFilePath}`);
        if (session.activeAttackMethod === 'Dictionary_Attack') {
            console.log(`- Attack Method: ${session.activeAttackMethod} (WARNING: NOT SUGGESTED FOR PC WITH LOW RAM!)`);
        } else {
            console.log(`- Attack Method: ${session.activeAttackMethod}`);
        }
        console.log(dictionaryListMenuASCIITail);
        return { type: 'stay' };
    } else if (choiceNum === 7) {
        // Validation that all data is entered
        if (!session.activeFilePath) {
            console.log(chalk.red('\nERROR: Please select a wordlist first (Option 1).\n'));
            return { type: 'stay' };
        }
        if (!session.activeAttackMethod) {
            console.log(chalk.red('\nERROR: Please select attack method first (Option 3).\n'));
            return { type: 'stay' };
        }
        if (!session.activeHashToCrack) {
            console.log(chalk.red('\nERROR: Please enter target hash first (Option 4).\n'));
            return { type: 'stay' };
        }
        if (!session.activeHashAlgorithm) {
            console.log(chalk.red('\nERROR: Please select hash algorithm first (Option 5).\n'));
            return { type: 'stay' };
        }

        console.log(dictionaryListMenuASCIITail);
        console.log(chalk.cyan('\nSTATUS: Attack started'));
        console.log('\n');

        let wordListSource;

        if (session.activeAttackMethod === 'Dictionary_Attack') {
            // Dictionary_Attack
            const spinner = ora('Loading wordlist into memory...').start();
            const content = await fs.promises.readFile(session.activeFilePath, 'utf8');
            wordListSource = content.split('\n');
            spinner.succeed(`Loaded ${wordListSource.length} words`);
        } else {
            // Stream_Attack
            wordListSource = session.activeFilePath;
        }

        await dictionaryAttack(session.activeHashToCrack, wordListSource, session.activeHashAlgorithm, session.activeAttackMethod, session.activeFilePath);

        await pressEnterToContinue();
        return { type: 'stay' };
    }
}

export { crackingMenu };
