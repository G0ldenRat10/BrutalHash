import chalk from 'chalk'
import { asciiMenu } from '../ui/ascii.js'
import { input } from '../core/input.js'
import { generateHash, saltingPromp } from '../core/hashing.js'
import { addLog } from '../core/logger.js'

async function hashMenu(justEntered) {

    // Pita korisnika sta dalje posle heshiranja -> vraca akciju za stek
    async function askAfterHash() {
        const restartQ = await input(`\n'b' - return to Hash Menu , 'q' - return to Main Menu : \n`)
        if (restartQ.toLowerCase() != 'b' && restartQ.toLowerCase() != 'q') {
            console.log(chalk.red('ERROR: Enter valid choice.'));
            return await askAfterHash();
        } else if (restartQ.toLowerCase() === 'q') {
            return { type: 'pop' };                 // nazad na MAIN
        } else {
            return { type: 'stay' };                // ostani u Hash meniju (nov hash)
        }
    }

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
    console.log(asciiMenu);                         // uvek - lista algoritama je potrebna pri svakom heshu
    const algChoice = await input('\nEnter number: \n');

    if (algChoice.toLowerCase() === 'b') {
        return { type: 'pop' };
    }
    const choiceNum = Number(algChoice);

    if (isNaN(choiceNum)) {
        console.log(chalk.red('\nERROR: Number must be entered.'));
        return { type: 'stay' };
    } else if (choiceNum < 1 || choiceNum > 17) {
        console.log(chalk.red('\nERROR: Number between 1-17 must be entered.'));
        return { type: 'stay' };
    }

    const type = dictHashes[algChoice];

    const text = await input('\nEnter word of choice: \n');
    const saltedText = await saltingPromp(text);
    if (saltedText === undefined) {
        const result = generateHash(text,type);
        console.log(`Result in ${type} format:\n`)
        console.log(chalk.yellow(result));
        addLog({type:'hash', algorithm:type, input:text, output:result, salt:undefined});
        return await askAfterHash();
    } else {
        const result = generateHash(saltedText,type);
        console.log(`Result in ${type} format + added salt:\n`)
        console.log(chalk.yellow(result));
        addLog({type:'hash', algorithm:type, input:text, output:result, salt:saltedText});
        return await askAfterHash();
    }
}

export { hashMenu };
