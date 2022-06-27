const pm = require('postgres-migrations');
const { selectEnvironment } = require('./selectEnvironment');
require('dotenv').config();

async function runMigration(filePath, environment) {
    const connectionInfo = selectEnvironment(environment);

    try {
        const val = await pm.migrate(connectionInfo, filePath);
        if (!val.length) {
            return console.log('No new migrations found.');
        }

        console.log('\n \nApplying migrations:');
        console.log('--------------------');

        val.map((v) => console.log(' ✅', v.fileName));

        console.log('--------------------');
        return console.log('Migrations complete');
    } catch (error) {
        return console.error(error, ': => error in migration');
    }
}

module.exports = {
    runMigration,
};
