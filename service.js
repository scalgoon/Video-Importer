const execSync = require('child_process').execSync;

const fs = require('fs');

const { JsonDB, Config } = require('node-json-db');

const AutoGitUpdate = require('auto-git-update');

const whoami = execSync('whoami', { encoding: 'utf-8' })

const who = whoami.trim()

const pwd = execSync('pwd', { encoding: 'utf-8' })

const where = pwd.trim();

const db = new JsonDB(new Config(`${where}/database`, true, false, '/'));

const versionCheck = execSync(`curl -sL https://api.github.com/repos/scalgoon/Videodeck/releases/latest | jq -r ".tag_name"`, { encoding: 'utf-8' })

const appVersion = versionCheck.trim();

const localVersionCheck = execSync(`cat "${where}/temp/version.txt"`, { encoding: 'utf-8' })

const localVersion = localVersionCheck.trim();

async function Service() {

    let data = await db.getData("/");

    const appName = data.appName;

    const folderDir = data.folderDir;

    if (appName === undefined && folderDir === undefined) {

        let app4 = require('./functions/install');

        app4.installService();

        return;

    } else {

        try {

            let data = await db.getData("/");

            const appName = data.appName;

            const folderDir = data.folderDir;

            const START = execSync(`zenity --info --title "${appName}" --text "To begin select which action you want to take." --no-wrap --ok-label "Import Media" --extra-button "Add Workspace Folder" --extra-button "Delete Workspace Folder" --extra-button "Delete Project"`, { encoding: 'utf-8' })

            let app = require('./functions/import');

            app.importMedia();

            return;

        } catch (e) {

            if (e.status === 1 && e.stdout === "Add Workspace Folder\n") {

                let app2 = require('./functions/workspace-add');

                app2.addWorkspace();

                return;

            } else if (e.status === 1 && e.stdout === "Delete Workspace Folder\n") {

                let app2 = require('./functions/workspace-delete');

                app2.deleteWorkspace();

                return;

            } else if (e.status === 1 && e.stdout === "Delete Project\n") {

                let app3 = require('./functions/delete');

                app3.deleteMedia();

                return;

            } else if (e.status === 1) {

                let END = execSync(`zenity --error --title "${appName}" --text "Import process canceled" --no-wrap`, { encoding: 'utf-8' })

            }

            return;

        }

    }

}

async function UpdateCheck() {

    let data = await db.getData("/");

    const updateFeature = data.autoUpdate;

    const appName = data.appName;

    if (updateFeature === undefined) {

        Service();

    } else {

        if (appVersion > localVersion) {

            const getNode = execSync(`which node`, { encoding: 'utf-8' })

            const nodeVersion = getNode.trim();

            const doUpdate = execSync(`konsole -e ${nodeVersion} "${where}/app/updateer.js"`, { encoding: 'utf-8' })

        } else {

            Service();

        }

    }

}

UpdateCheck();
