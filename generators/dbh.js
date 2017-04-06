const DBH_CONSTANTS = require('./dbh-constants');
const fs = require('fs');


const isTrueString = x => (typeof x === 'string' && x !== '');


/** return the content of .yo-rc.json */
const getApplicationConfig = () => {
    return new Promise((resolve, reject) => {
        const appConfigFile = DBH_CONSTANTS.applicationConfigFile;
        // if file exists, return its output as a JSON object
        if (fs.existsSync(appConfigFile)) {
            //console.log('getApplicationConfig: file exists');
            fs.readFile(appConfigFile, 'utf8', (err, data) => {
                if (err) {
                    throw new Error(err);
                }
                const applicationConfig = JSON.parse(data);
                //console.log('getApplicationConfig: parsed JSON = %j\n---', applicationConfig);
                if (applicationConfig) {
                    resolve(applicationConfig);
                } else {
                    reject(`getApplicationConfig: no output. Type: ${typeof applicationConfig}, value: ${applicationConfig}`);
                }
            });
        } else {
            throw new Error('file doesnt exist');
        }
    });
};


module.exports = {
    getApplicationConfig,
    isTrueString
};
