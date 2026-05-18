import chalk from 'chalk'
import { mainMenuASCII } from '../ui/ascii.js'
import { input } from '../core/input.js'
import { hashMenu } from './hashMenu.js'
import { crackingMenu } from './crackingMenu.js'
import { patternRegexHash } from './patternMenu.js'

async function mainMenu(justEntered) {

    if (justEntered) { console.log(mainMenuASCII) };
    let choiceNum = await input('\nEnter number: \n');

    if (isNaN(choiceNum)) {
        console.log(chalk.red('\nERROR: Number must be entered.\n'));
        return { type: 'stay' };  // umesto rekurzivnog pozivanja, vraca type:stay
    }
    if (choiceNum < 1 || choiceNum > 4) {
        console.log(chalk.red('\nERROR: Number between 1-4 must be entered.\n'));
        return { type: 'stay' };        
    }

    choiceNum = Number(choiceNum);
    if (choiceNum === 1) return { type: 'push', screen: 'HASH'};
    if (choiceNum === 2) return { type: 'push', screen: 'CRACKING'};
    if (choiceNum === 3) return { type: 'push', screen: 'PATTERN'};
    return { type: 'exit'}; // choiceNum === 4 
}

export { mainMenu };