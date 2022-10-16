const execSync = require('child_process').execSync;

const fs = require('fs');

const { JsonDB, Config } = require('node-json-db');

const whoami = execSync('whoami', { encoding: 'utf-8' })

const who = whoami.trim()

const pwd = execSync('pwd', { encoding: 'utf-8' })

const where = pwd.trim();

const db = new JsonDB(new Config(`${where}/database`, true, false, '/'));

module.exports = {
    addWorkspace: async () => {
      
       let data = await db.getData("/");

        const appName = data.appName;

        const folderDir = data.folderDir;

        try {

            const name = execSync('zenity --entry --title "Workspace Name" --text "Please enter the name for the workspace."', { encoding: 'utf-8' })

            const workspaceName = name.trim();

            if (!workspaceName) {

                let END = execSync(`zenity --error --title "${appName}" --text "Please specify a workspace name!" --no-wrap`, { encoding: 'utf-8' })

                return;

            }

            const workspaceVerify = execSync(`zenity --question --title "Add Workspace" --text "<b>${workspaceName}</b>\nIs this the correct name?" --no-wrap --ok-label "Yes" --cancel-label "No"`, { encoding: 'utf-8' })

            let dir = `${folderDir}/${workspaceName}/`;

            if (fs.existsSync(dir)) {

                const dirExists = execSync(`zenity --error --title "Workspace Exists" --text "The workspace you specified already exists." --no-wrap`, { encoding: 'utf-8' })

                return;

            } else {

                const makeDir = execSync(`zenity --password | sudo -S mkdir "${folderDir}/${workspaceName}"`, { encoding: 'utf-8' })

                let FINAL = execSync(`zenity --info --title "Workspace Added" --text "Workspace <b>${workspaceName}</b> has been added to <b>${appName}</b>" --no-wrap`, { encoding: 'utf-8' })

                return;

            }

        } catch (e) {

            if (e.status === 1) {
                let END = execSync('zenity --error --title "Process Canceled" --text "Workspace addition process canceled" --no-wrap', { encoding: 'utf-8' })
            }

            return;

        }

    }
  }
