// Node.js implementation of the COBOL Student Account Management System
// Preserves business logic, data integrity, and menu options from the COBOL version

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'balance.json');
const INITIAL_BALANCE = 1000.00;

// Data Layer: Handles persistent storage of the account balance
function readBalance() {
    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, JSON.stringify({ balance: INITIAL_BALANCE }));
    }
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    return data.balance;
}

function writeBalance(newBalance) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ balance: newBalance }));
}

// Business Logic Layer: Handles account operations
function viewBalance() {
    const balance = readBalance();
    console.log(`Current balance: $${balance.toFixed(2)}`);
}

function creditAccount() {
    rl.question('Enter credit amount: ', (input) => {
        const amount = parseFloat(input);
        if (isNaN(amount) || amount <= 0) {
            console.log('Invalid amount.');
            return mainMenu();
        }
        let balance = readBalance();
        balance += amount;
        writeBalance(balance);
        console.log(`Amount credited. New balance: $${balance.toFixed(2)}`);
        mainMenu();
    });
}

function debitAccount() {
    rl.question('Enter debit amount: ', (input) => {
        const amount = parseFloat(input);
        if (isNaN(amount) || amount <= 0) {
            console.log('Invalid amount.');
            return mainMenu();
        }
        let balance = readBalance();
        if (balance >= amount) {
            balance -= amount;
            writeBalance(balance);
            console.log(`Amount debited. New balance: $${balance.toFixed(2)}`);
        } else {
            console.log('Insufficient funds for this debit.');
        }
        mainMenu();
    });
}

// Presentation Layer: Handles user interaction
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function mainMenu() {
    console.log('--------------------------------');
    console.log('Account Management System');
    console.log('1. View Balance');
    console.log('2. Credit Account');
    console.log('3. Debit Account');
    console.log('4. Exit');
    console.log('--------------------------------');
    rl.question('Enter your choice (1-4): ', (choice) => {
        switch (choice.trim()) {
            case '1':
                viewBalance();
                mainMenu();
                break;
            case '2':
                creditAccount();
                break;
            case '3':
                debitAccount();
                break;
            case '4':
                console.log('Exiting the program. Goodbye!');
                rl.close();
                break;
            default:
                console.log('Invalid choice, please select 1-4.');
                mainMenu();
        }
    });
}

// Start the application
mainMenu();
