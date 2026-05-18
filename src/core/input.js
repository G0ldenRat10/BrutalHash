import readline from 'readline';
import chalk from 'chalk';

// Program logic functions:

function restartProgram() {
    // Signal run.sh to restart (exit code 42) instead of looping recursively
    process.exit(42); // 42 my code for silent restart
}

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

export { input, pressEnterToContinue, restartProgram };
