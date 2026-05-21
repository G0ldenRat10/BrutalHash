import fs from 'fs';

// Setup logs
const LOGS_FILE = './logs.json';

// Log functions
// napravi fajl ako ne postoji (u slucaju da saban koji koristi obrise)
function checkLogs() {
    if (!fs.existsSync(LOGS_FILE)) {
        fs.writeFileSync(LOGS_FILE, JSON.stringify({ operations: [] }, null, 2)); 
    }
}

function addLog(dataToAdd) {
    checkLogs(); // starting check
    const currentData = JSON.parse(fs.readFileSync(LOGS_FILE, 'utf8'));
    dataToAdd['id'] = currentData['operations'].length + 1;
    dataToAdd['timestamp'] = new Date().toISOString();
    currentData['operations'].push(dataToAdd);

    if (currentData['operations'].length > 500) {
        currentData['operations'] =  currentData['operations'].slice(-500); // keep last 500 added Datas
    }

    fs.writeFileSync(LOGS_FILE,JSON.stringify(currentData, null, 2)); // write edited current data, to file
}
// TO-DO: might implement text based, in terminal reader of logs as option 4? // 3 month later: nisam ga taknuo
function getLogs(slicesToReturn=10) {
    checkLogs(); // starting check
    const currentData = JSON.parse(fs.readFileSync(LOGS_FILE, 'utf8'));
    return currentData['operations'].slice(-slicesToReturn);
}

export { checkLogs, addLog, getLogs };
