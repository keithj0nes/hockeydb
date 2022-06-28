const fs = require('fs');
const { createNewMigration } = require('../utils/createMigration');
const { runMigration } = require('../utils/runMigration');
const { dropTables, seedTables } = require('../utils/seedMigration');


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
                runMigration(migrationsSQLFolder, argv[1]).then(() => {
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
