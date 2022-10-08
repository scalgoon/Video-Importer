const execSync = require('child_process').execSync;

const fs = require('fs');

const { JsonDB, Config } = require('node-json-db');

const whoami = execSync('whoami', { encoding: 'utf-8' })

const who = whoami.trim()

const db = new JsonDB(new Config(`/home/${who}/Downloads/Videodeck/database`, true, false, '/'));

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

                const START = execSync(`zenity --info --title "${appName}" --text "To begin select which action you want to take." --no-wrap --ok-label "Import Media" --extra-button "Add Workspace Folder" --extra-button "Delete Project"`, { encoding: 'utf-8' })

                let app = require('./functions/import');

                app.importMedia();

                return;

            } catch (e) {

                if (e.status === 1 && e.stdout === "Add Workspace Folder\n") {

                    let app2 = require('./functions/workspace');

                    app2.addWorkspace();

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
