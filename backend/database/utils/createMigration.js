const fs = require('fs');
const { format } = require('date-fns');
const { exec } = require('node:child_process');

// to use
// npm run migrate create your-migration-name-here

const createNewMigration = (fileName, filePath) => {
    if (!fileName) {
        throw new Error('Must contain a migration name \n\nExample: npm run migrate create some-file-name\n\n');
    }
    const currentMigrations = fs.readdirSync(filePath);

    currentMigrations.forEach(item => {
        const split = item.split(/_([^.]+)/s);
        if (split[1] === fileName) {
            throw new Error(`\n\nMust be a unique filename \n"${fileName}" is already being used as a migration\n`);
        }
    });

    let parsed;
    let number;
    if (!currentMigrations.length) {
        number = '0000';
        parsed = parseInt(number) + 1;
    } else {
        const lastFileSplit = currentMigrations[currentMigrations.length - 1].split('_');
        [number] = lastFileSplit;
        parsed = parseInt(number) + 1;
    }

    const parsedBackToString = parsed.toString();
    const leading = Math.max(0, number.length - parsedBackToString.length);
    const newNumber = '0'.repeat(leading) + parsed;

    const newFileName = `${newNumber}_${fileName.replace(/-/g, '_')}.sql`;

    const content = `-- Created: ${format(new Date(), 'PPP @ pp')} \n-- Write SQL for new migration\n\n`;

    console.log('\nCreating migration');
    console.log('--------------------');

    fs.writeFile(`${filePath}/${newFileName}`, content, async err => {
        if (err) {
            return console.error(err);
        }
        console.log(` ✅ ${newFileName}`);
        console.log('--------------------');

        return exec(`code ${filePath}/${newFileName}`, (execErr) => {
            if (execErr) {
                return console.log(`Migration file created at:\n${filePath}/${newFileName}\n`);
            }
            return console.log('Migration file created and opened\n\n');
        });
    });
};

module.exports = {
    createNewMigration,
};
