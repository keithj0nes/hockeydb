
export const selectEnvironment = (environment) => {
    let connectionInfo = {};

    switch (environment) {
        case 'dev':
        case 'development':
        default: {
            const { DEV_DB_HOST, DEV_DB_PORT, DEV_DB_DATABASE, DEV_DB_USERNAME, DEV_DB_PASSWORD } = process.env;

            if (!DEV_DB_HOST || !DEV_DB_PORT || !DEV_DB_DATABASE || DEV_DB_USERNAME === undefined || DEV_DB_PASSWORD === undefined) {
                throw new Error('Missing development database keys in your .env');
            }

            connectionInfo = {
                host: DEV_DB_HOST,
                port: parseInt(DEV_DB_PORT),
                database: DEV_DB_DATABASE,
                user: DEV_DB_USERNAME,
                password: DEV_DB_PASSWORD,
            };

            break;
        }
        case 'test': {
            const { TEST_DB_HOST, TEST_DB_PORT, TEST_DB_DATABASE, TEST_DB_USERNAME, TEST_DB_PASSWORD } = process.env;

            if (!TEST_DB_HOST || !TEST_DB_PORT || !TEST_DB_DATABASE || TEST_DB_USERNAME === undefined || TEST_DB_PASSWORD === undefined) {
                throw new Error('Missing test database keys in your .env');
            }

            connectionInfo = {
                host: TEST_DB_HOST,
                port: parseInt(TEST_DB_PORT),
                database: TEST_DB_DATABASE,
                user: TEST_DB_USERNAME,
                password: TEST_DB_PASSWORD,
            };
            break;
        }
        // TODO: make production work
        case 'prod':
        case 'production': {
            const { PROD_DB_HOST, PROD_DB_PORT, PROD_DB_DATABASE, PROD_DB_USERNAME, PROD_DB_PASSWORD } = process.env;
            if (!PROD_DB_HOST || !PROD_DB_PORT || !PROD_DB_DATABASE || !PROD_DB_USERNAME || !PROD_DB_PASSWORD) {
                throw new Error('Missing production database keys in your .env');
            }
            connectionInfo = {
                user: PROD_DB_USERNAME,
                password: PROD_DB_PASSWORD,
                host: PROD_DB_HOST,
                port: parseInt(PROD_DB_PORT),
                database: PROD_DB_DATABASE,
                ssl: false,
                poolSize: 2,
            };
            break;
        }
    }

    connectionInfo.ensureDatabaseExists = true;

    return connectionInfo;
};
