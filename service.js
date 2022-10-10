const execSync = require('child_process').execSync;

const fs = require('fs');

const { JsonDB, Config } = require('node-json-db');

const AutoGitUpdate = require('auto-git-update');

const whoami = execSync('whoami', { encoding: 'utf-8' })

const who = whoami.trim()

const db = new JsonDB(new Config(`/home/${who}/Downloads/Videodeck/database`, true, false, '/'));

const versionCheck = execSync(`curl -sL https://api.github.com/repos/scalgoon/Videodeck/releases/latest | jq -r ".tag_name"`, { encoding: 'utf-8' })

const appVersion = versionCheck.trim();

const localVersionCheck = execSync(`cat /home/${who}/Downloads/Videodeck/temp/version.txt`, { encoding: 'utf-8' })

const localVersion = localVersionCheck.trim();

async function AppService() {

    let dir = `/home/${who}/Downloads/Videodeck/`;

    if (fs.existsSync(dir)) {

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

        Service();

    } else {

        let END = execSync('zenity --error --title "Setup Failed" --text "Please make sure the app folder is in <b>/home/$USER/Downloads/</b> and is named <b>Videodeck</b>!" --no-wrap', { encoding: 'utf-8' })

    }

}

if (appVersion > localVersion) {

    try {

        const updatePrompt = execSync(`zenity --question --title "Update Needed" --text "Your app version <b>${localVersion}</b> is not up to date with the repository version <b>${appVersion}</b>" --no-wrap --ok-label "Update" --cancel-label "Dont Update"`, { encoding: 'utf-8' })

        const getNode = execSync(`which node`, { encoding: 'utf-8' })

        const nodeVersion = getNode.trim();

        let dir = `/home/${who}/Downloads/Videodeck/temp/temp-folder`;

        if (!fs.existsSync(dir)) {

            const makeTempDir = execSync(`mkdir ${dir}`, { encoding: 'utf-8' })

        }

        const config = {
            repository: 'https://github.com/scalgoon/Videodeck',
            fromReleases: true,
            tempLocation: `/home.${who}/Downloads/Videodeck/temp/temp-folder`,
            ignoreFiles: ['database.json', 'assets/4options.svg', 'README.md',],
            executeOnComplete: `${nodeVersion} /home/${who}/Downloads/Videodeck/service.js`,
            exitOnComplete: true
        }

        const updater = new AutoGitUpdate(config);

        updater.forceUpdate();

        return;

    } catch (e) {

        if (e.status === 1) {

            AppService();

        }

        return;

    }

} else {

    AppService();

}
