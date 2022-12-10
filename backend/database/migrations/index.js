import fs from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { createNewMigration } from '../utils/createMigration.js';
import { runMigration } from '../utils/runMigration.js';
import { dropTables, seedTables } from '../utils/seedMigration.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const migrationsSQLFolder = `${__dirname}/sql`;
const argv = process.argv.slice(2);


// create sql folder if it doesnt exist
if (!fs.existsSync(migrationsSQLFolder)) {
    fs.mkdirSync(migrationsSQLFolder);
}

try {
    switch (argv[0]) {
        case 'seed':
            dropTables().then(() => {
                runMigration(migrationsSQLFolder, argv[1]).then((err) => {
                    if (err) return console.log('Seeding aborted');
                    seedTables();
                });
            });
            break;

        case 'create':
            createNewMigration(argv[1], migrationsSQLFolder);
            break;

        case 'migrate':
        default:
            runMigration(migrationsSQLFolder, argv[0]);
            break;
    }
} catch (error) {
    console.log(error);
}
