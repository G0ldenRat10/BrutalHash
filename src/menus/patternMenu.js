import chalk from 'chalk'
import { patternRegexHashASCII } from '../ui/ascii.js'
import { input } from '../core/input.js'

async function patternRegexHash(justEntered) {

    // Built in functions:

    function isValidHash(hash,regex) {
        return regex.test(hash);
    }

    // Pita korisnika sta dalje -> vraca akciju za stek (bilo: userInputIsItValid)
    async function askAfter() {
        let userInput = await input("\n'r' to restart , 'q' for main menu: \n");
        if (userInput.toLowerCase() === 'r') {
            return { type: 'stay' };                // ponovi pattern test
        } else if (userInput.toLowerCase() === 'q') {
            return { type: 'pop' };                 // nazad na MAIN
        } else {
            console.log(chalk.red('\nERROR: Invalid option.\n'))
            return await askAfter();
        }
    }


    // 1. test
    async function detectEncoding(inputHash) {
        const encodings = {
            'hex': /^[a-fA-F0-9]+$/,                                                         // encoding
            'base64': /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/,    // encoding
            'bcrypt': /^\$2[aby]\$\d{2}\$.{53}$/,                                            // algorithm for pw, purposly slow, salt built in (TO-DO will see options in future)
            'argon2': /^\$argon2(id|i|d)\$/                                                  // uses base64 for hash and salting, GPU resistant (TO-DO will see options in future)
        };
        for (const enc in encodings) {   //for each key in dict
            if (encodings[enc].test(inputHash)) return enc;  // test regex -> return encoding type
        }
        // else
        return 'unknown';
    }
    // 2. test
    // Shannon entropy -> finding poisition frequency -> more random, less repeating -> high ration entrophy -> better probability of HASH organization
    async function calculateEntropy(inputHash) {
        const frequency = {};                  // Empty object to save char
        for (const char of inputHash) {        // for each char in input string
            frequency[char] = (frequency[char] || 0) + 1;  // if undefined(empty) --> f[c] = 0 --> 0 + 1 // if n --> f[c] = n + 1
        }
        const numbersFrequency =  Object.values(frequency); // get values from object
        // Formula:
        // H = − Σ p(x) log₂ p(x)  --> result is weighted information for specific outcome
        // p(x) - how likely the outcome , p(x)= frequency/lenght
        // log2p(x) - how much information it provides
        // Σ - reduce() --> sum  ; - - => + , the reason of negation before SUM is to end up with positive
        // cur/lenght ==> probability = p(x)
        const entropy = numbersFrequency.reduce((acc,cur) => acc - (cur/inputHash.length) * Math.log2(cur/inputHash.length), 0); 
        return entropy.toFixed(2);
    }
    async function filterEntropy(entropy, encoding) {
        let standard = 0; // set standard to check
        if (encoding === 'hex') {
            standard = 3.5;
        } else if (encoding === 'base64' || encoding === 'argon2') {
            standard = 5.5;
        } else {
            standard = 5.0; // bcrypt
        }
        if (entropy >= standard) return `\nINFO: High entropy detected: ${entropy}, likely a hash.\n`;
        else return `\nINFO: Low entropy detected: ${entropy}, likely not a hash.\n`;
    }
    // 3. test (if Hex)
    async function detectHex(inputHash) {
            const regexAndHash = {
                'md5': /^[a-fA-F0-9]{32}$/,                      // 32 HEX
                'md5-sha1': /^[a-fA-F0-9]{32}[a-fA-F0-9]{40}$/,  // 32+40=72 HEX --> (md5:32)+(sha1:40)
                'sha1': /^[a-fA-F0-9]{40}$/,                     // 40 HEX
                'sha224': /^[a-fA-F0-9]{56}$/,                   // 56 HEX
                'sha256': /^[a-fA-F0-9]{64}$/,                   // 64 HEX
                'sha384': /^[a-fA-F0-9]{96}$/,                   // 96 HEX
                'sha512': /^[a-fA-F0-9]{128}$/,                  // 128 HEX
                'sha3-224': /^[a-fA-F0-9]{56}$/,                 // 56 HEX
                'sha3-256': /^[a-fA-F0-9]{64}$/,                 // 64 HEX
                'sha3-384': /^[a-fA-F0-9]{96}$/,                 // 96 HEX
                'sha3-512': /^[a-fA-F0-9]{128}$/,                // 128 HEX
                'blake2s256': /^[a-fA-F0-9]{64}$/,               // 64 HEX
                'blake2b512': /^[a-fA-F0-9]{128}$/,              // 128 HEX
                'ripemd160': /^[a-fA-F0-9]{40}$/,                // 40 HEX - Bitcoin algorithm, simillar to SHA1
                'shake128': /^[a-fA-F0-9]{32}$/,                 // Depends - likely 32 hex - XOF Function
                'shake256': /^[a-fA-F0-9]{64}$/,                 // Depends - likely 64 hex
                'sm3': /^[a-fA-F0-9]{64}$/                       // 64 HEX- Chinese SHA256
            };

        let capturePotentialHashesList = [];

        console.log(chalk.yellow(`\nSTATUS: Looking for potential matches...\n`));
        for (let key in regexAndHash) {
            let hashName = key;
            let regex = regexAndHash[key];
            if (isValidHash(inputHash,regex)) {
                capturePotentialHashesList.push(hashName);
            }
        }

        if (capturePotentialHashesList.length > 0) {
            console.log(chalk.green('\nINFO: Success\n'));
            console.log(chalk.yellow(`\nPotential HASH ALGORITHMS for: ${inputHash}\n`));
            for (let i = 0; i < capturePotentialHashesList.length; i++) {
                console.log(chalk.yellow(`${i + 1}. ${capturePotentialHashesList[i]}`));
            }
            return await askAfter();
        } else {
            console.log(chalk.red('\nINFO: No specific algorithm found for this input.\n'));
            return await askAfter();
        }
    }

    // mejn part:
    console.log(patternRegexHashASCII);        // uvek - prikazi baner pri svakom prolazu
    // 1: check encoding regex and display:
    const inputHash = await input(`\nEnter hash: `);
    const encoding = await detectEncoding(inputHash);
    console.log(chalk.yellow(`\nINFO: Detected encoding: ${encoding}`));
    // 2: check entropy result and display:
    const entropy = await calculateEntropy(inputHash);
    console.log(chalk.yellow(await filterEntropy(entropy, encoding)));
    // 3: test Regex with switch/case to declare what encoding--> if hex: type --> if base64: calculate immidiatly --> else: give info and exit
    switch (encoding) {
        case 'hex':
            return await detectHex(inputHash);
        case 'base64': {
            const decoded = Buffer.from(inputHash,'base64').toString('utf8');
            console.log(chalk.yellow(`INFO: Your Base64 encode in clear-text is: ${decoded}`));
            return await askAfter();
        }
        case 'bcrypt':
            console.log(chalk.yellow(`INFO: Bycript is one way operation, you can not get original password.`));
            return await askAfter();
        case 'argon2':
            console.log(chalk.yellow(`INFO: Argon2 is one way operation, you can not get original password.`));
            return await askAfter();
        default:
            // since encoding is 'unknown' in this case
            return await askAfter();
    }
}

export { patternRegexHash };
