import crypto from 'crypto';
import chalk from 'chalk';
import { input } from './input.js';

function generateHash(text,type) {
    return crypto.createHash(type).update(text).digest('hex');
}

async function saltingPromp(text) {

    const q = (await input('\nWould you like to add salt before hashing? (y - yes / n - no): \n')).toLowerCase();

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
        return await getResult(salt,text);
    } else if (q === 'n') {
        return;
    } else {
           console.log(chalk.red('\nERROR: Invalid input. \n'));
           // Recursion again
           return await saltingPromp(text);
    }
}

export { generateHash, saltingPromp };
