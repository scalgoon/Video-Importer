const execSync = require('child_process').execSync;

const fs = require('fs');

const { JsonDB, Config } = require('node-json-db');

const whoami = execSync('whoami', { encoding: 'utf-8' })

const who = whoami.trim()

const db = new JsonDB(new Config(`/home/${who}/Downloads/Videodeck/database`, true, false, '/'));

async function appUpdate() {

    let data = await db.getData("/");

    const appName = data.appName;

    try {

        const getNode = execSync(`which node`, { encoding: 'utf-8' })

        const nodeVersion = getNode.trim();

        let dir = `/home/${who}/Desktop/videodeck-temp/`;

        if (!fs.existsSync(dir)) {

            const makeTempDir = execSync(`mkdir ${dir}`, { encoding: 'utf-8' })

        }

        let dir2 = `/home/${who}/Desktop/videodeck-temp/temp-folder`;

        if (!fs.existsSync(dir2)) {

            const makeTempDir = execSync(`mkdir ${dir2}`, { encoding: 'utf-8' })

        }

        const config = {
            repository: 'https://github.com/scalgoon/Videodeck',
            fromReleases: true,
            tempLocation: `${dir2}`,
            ignoreFiles: ['database.json', 'assets/4options.png', 'README.md',],
            executeOnComplete: `${nodeVersion} /home/${who}/Downloads/Videodeck/service.js`,
            exitOnComplete: true
        }

        const updater = new AutoGitUpdate(config);

        updater.autoUpdate();

    } catch (e) {

        if (e.status === 1) {

            let END = execSync('zenity --error --title "Update Canceled" --text "Update process canceled" --no-wrap', { encoding: 'utf-8' })

        }

        return;

    }

}

appUpdate();