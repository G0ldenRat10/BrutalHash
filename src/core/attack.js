import fs from 'fs';
import ora from 'ora';
import chalk from 'chalk';
import readline from 'readline';
import { generateHash } from './hashing.js';
import { addLog } from './logger.js';

async function dictionaryAttackInMemory(targetHash, wordlist, hashAlgorithm, wordlistPath=null) {
    // Algorithm:
    // words --> RAM --> iterate
    // words = [] (already stored in RAM)

    const startTime = Date.now();
    let attempts = 0;

    // First to execute for loop, then display results
    for (let i = 0; i < wordlist.length; i++) {

        const currentWord = wordlist[i].trim();
        if (!currentWord) continue; // to skip empty lines

        // Note: here I put attempts bellow if(!currentWord) continue; -> since that is the code that empty's the lines; 
        // BEFOREFIX: ora_loader was at: 20m, FIX: it's now at 20k
        attempts++;
        const testHash = generateHash(currentWord, hashAlgorithm);

        if (testHash === targetHash) {
            const endTime = Date.now() - startTime;
            console.log(`\nDictionary attack finished.`)
            console.log(chalk.green(`✓ Status: FOUND\n✓ Password: ${currentWord}\n✓ Attempts: ${attempts}\n✓ Time: ${endTime}ms`));
            addLog({type:'crack',algorithm:hashAlgorithm,hash:targetHash,result:'found',cracked:currentWord,wordlist_path:wordlistPath,attempts:attempts});
            return currentWord;
        }

        if (attempts % 10000 === 0) {
            console.log(chalk.blue(`◆ Currently at: ${attempts} attempts`));
        }
    }
    // In case not found:
    const endTime = Date.now() - startTime;
    console.log(`\nDictionary attack finished.`);
    console.log(chalk.red(`✗ Status: NOT FOUND\n✗ Password: Unknown \n✗ Attempts: ${attempts}\n✗ Time: ${endTime}ms`));
    addLog({type:'crack',algorithm:hashAlgorithm,hash:targetHash,result:'not_found',cracked:null,wordlist_path:wordlistPath,attempts:attempts});
}

async function dictionaryAttackStream(targetHash, filePath, hashAlgorithm) {
    // Algorithm:
    // words if count of them is example:100 -> 1/100 => word -> 1 line -> generateHash(word, alg)... --> until: 100/100 or n({1,2,3...100) a match

    const startTime = Date.now();  // Start the time capture
    const spinner = ora('Starting stream attack...').start(); // Start the spinner
    spinner.color = 'yellow'; // set color spinner

    const fileStream = fs.createReadStream(filePath);   // reads in chunks

    const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity  });  // chunk to lines with readline , crlfDelay: \n \r registered as newline

    // variable setters:
    let attempts = 0;
    let found = null;
    let endTime = null;

    for await (const line of rl) {  // asinhron iterate, realine on stream -> awaits data of every line one by one without RAM consumption...
        const tokens = line.split(/\s+/); // in case words not devided by rows, but by space,tab,\n, take regex to trim it down to format i need
        for (const token of tokens) {
            const currentWord = token.trim();
            if (!currentWord) continue;

            attempts++;
            const testHash = generateHash(currentWord, hashAlgorithm);  // call -> generateHash() -> return result

            // Updating spinner every 10,000 attempts
            if (attempts % 10000 === 0) {
                const timePassed = Date.now() - startTime;
                spinner.text = chalk.yellow(`Attempts: ${attempts} | Time: ${timePassed} ms\n`);
            }

            if (testHash === targetHash) {
                found = currentWord;
                break;
            }
        }
        if (found) break;
    }

    endTime = Date.now() - startTime;
    rl.close();  // file reader closed
    console.log(chalk.blue(`\nINFO: Dictionary attack finished.`));

    if (found === null) {
        spinner.fail(chalk.red(`\n✗ STATUS: NOT FOUND\n✗ Password: Unknown \n✗ Attempts: ${attempts}\n✗ Time: ${endTime}ms`));
        addLog({type:'crack',algorithm:hashAlgorithm,hash:targetHash,result:'not_found',cracked:null,wordlist_path:filePath,attempts:attempts});
    }
    else {
        spinner.succeed(chalk.green(`\nSTATUS: FOUND\n✓ Password: ${found}\n✓ Attempts: ${attempts}\n✓ Time: ${endTime}ms`));
        addLog({type:'crack',algorithm:hashAlgorithm,hash:targetHash,result:'found',cracked:found,wordlist_path:filePath,attempts:attempts});
        return found;
    }
}

async function dictionaryAttack(targetHash, wordListSource, hashAlgorithm, attackMethod, wordlistPath=null) {
    // my router function to start attack , tried to fix it like this

    // Logic to not damage your PC in case attackMethod is undefined:
    if (attackMethod === undefined) {
        if (typeof wordListSource === 'string') {               // is path, not []
            // Stream attack, resource saving
            return await dictionaryAttackStream(targetHash, wordListSource, hashAlgorithm);
        } else {                                                // is [], not path
            // Memory (classic) attack, hard on resource
            return dictionaryAttackInMemory(targetHash, wordListSource, hashAlgorithm, wordlistPath);
        }
    // If attackMethod is picked:
    } else if (attackMethod === 'Dictionary_Attack') {
        return dictionaryAttackInMemory(targetHash, wordListSource, hashAlgorithm, wordlistPath);
    } else if (attackMethod === 'Stream_Attack') {
        return dictionaryAttackStream(targetHash,wordListSource,hashAlgorithm);
    }

}

export { dictionaryAttack, dictionaryAttackInMemory, dictionaryAttackStream };
