const execSync = require('child_process').execSync;

const fs = require('fs');

const { JsonDB, Config } = require('node-json-db');

const AutoGitUpdate = require('auto-git-update');

const whoami = execSync('whoami', { encoding: 'utf-8' })

const who = whoami.trim()

const pwd = execSync('pwd', { encoding: 'utf-8' })

const where = pwd.trim();

const db = new JsonDB(new Config(`"${where}/database"`, true, false, '/'));

const versionCheck = execSync(`curl -sL https://api.github.com/repos/scalgoon/Videodeck/releases/latest | jq -r ".tag_name"`, { encoding: 'utf-8' })

const appVersion = versionCheck.trim();

const localVersionCheck = execSync(`cat "${where}/temp/version.txt"`, { encoding: 'utf-8' })

const localVersion = localVersionCheck.trim();

async function UpdateService() {

    const updatePrompt = execSync(`zenity --question --title "Update Needed" --text "Your app version <b>${localVersion}</b> is not up to date with the repository version <b>${appVersion}</b>" --no-wrap --ok-label "Update" --cancel-label "Dont Update"`, { encoding: 'utf-8' })

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
        executeOnComplete: `${nodeVersion} ${where}/service.js`,
        exitOnComplete: true
    }

    const updater = new AutoGitUpdate(config);

    updater.forceUpdate();

    return;

}

UpdateService();