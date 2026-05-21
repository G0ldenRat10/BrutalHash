import chalk from 'chalk'
import { asciiArt } from './asciiStorage.js'
import { Stack } from './src/structures/Stack.js'
import { mainMenu } from './src/menus/mainMenu.js'
import { hashMenu } from './src/menus/hashMenu.js';
import { crackingMenu } from './src/menus/crackingMenu.js';
import { patternRegexHash } from './src/menus/patternMenu.js';

//ascii:
console.log(chalk.rgb(255,0,0).bold(asciiArt));
console.log(chalk.rgb(200,0,0).italic('               Developed by: ') + chalk.rgb(148, 126, 0, 1).italic('G0ldenRat10'));
console.log(chalk.rgb(200,0,0).italic('     GitHub: ') + chalk.rgb(65, 65, 250, 1).italic('https://github.com/G0ldenRat10/BrutalHash'));

// Objekat Steka:
const menuStack = new Stack();

// Status crackinga: 
const session = {
    activeFilePath : undefined,
    activeAttackMethod : undefined,
    activeHashToCrack : undefined,
    activeHashAlgorithm : undefined,
};

menuStack.push('MAIN'); // Startuj MAIN MENU
let lastScreen = null;

while ( !menuStack.isEmpty() ) {
    const screen = menuStack.peek(); // aktivan prikaz menija if stack !empty
    const justEntered = screen !== lastScreen; // provera da li je upravo udjeno na ekran, bez stay-a i resava mi ascii spam True/False
    lastScreen = screen; // update za sledecu iteraciju 

    let action;

    switch (screen) {
        case 'MAIN':     action = await mainMenu(justEntered);              break;
        case 'HASH':     action = await hashMenu(justEntered);              break;
        case 'CRACKING': action = await crackingMenu(justEntered, session); break;
        case 'PATTERN':  action = await patternRegexHash(justEntered);      break;
        default:         action = { type: 'pop'};
    }

    // Kontroler STACK-a: 
    if (action.type === 'push') {
        menuStack.push(action.screen);
    } else if (action.type === 'pop') {
        menuStack.pop();
    } else if (action.type === 'exit') {
        menuStack.clear();
    }
    // ako je stay ne dira stek
}

// Izlaz iz programa:
console.log(chalk.yellow('\nINFO: Exiting the program.\n'));