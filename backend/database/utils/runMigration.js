import pm from 'postgres-migrations';
import 'dotenv/config.js';
import { selectEnvironment } from './selectEnvironment.js';

// async function runMigration(filePath, environment) {
export const runMigration = async (filePath, environment) => {
    const connectionInfo = selectEnvironment(environment);

    try {
        const val = await pm.migrate(connectionInfo, filePath);
        if (!val.length) {
            return console.log('\nNo new migrations found\n\n');
        }

        console.log('\nApplying migrations:');
        console.log('--------------------');

        val.map((v) => console.log(' ✅', v.fileName));

        console.log('--------------------');
        console.log('Migrations complete\n');
        return false;
    } catch (error) {
        console.error(error, ': => error in migration');
        return true;
    }
};
