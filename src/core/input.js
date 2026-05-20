import readline from 'readline';
import chalk from 'chalk';

function input(question) {
    const rl = readline.createInterface({    // interface readline
    input: process.stdin,
    output: process.stdout
    });
    return new Promise(resolve => rl.question(question, ans => {   // promise wraper --> rl.question is callback based question: '' , ans: user input
        rl.close();
        resolve(ans);
    }));
}

async function pressEnterToContinue() {
    await input(chalk.cyan('\nPress Enter to continue...\n'));
}

export { input, pressEnterToContinue };
