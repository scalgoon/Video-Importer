const execSync = require('child_process').execSync;

const fs = require('fs');

const { JsonDB, Config } = require('node-json-db');

const whoami = execSync('whoami', { encoding: 'utf-8' })

const who = whoami.trim()

const pwd = execSync('pwd', { encoding: 'utf-8' })

const where = pwd.trim();

const db = new JsonDB(new Config(`${where}/database`, true, false, '/'));

module.exports = {
    deleteWorkspace: async () => {

       let data = await db.getData("/");

        const appName = data.appName;

        const folderDir = data.folderDir;

        try {

            const output = execSync(`for dir in ${folderDir}/*/; do basename "$dir"; done`, { encoding: 'utf-8' });

            let splitChoices = output.split("\n");

            let choicesArray = Array.from(splitChoices);

            let filteredArray = choicesArray.filter(e => e !== "");

            let useChoices = filteredArray.map((x) => `"*" ${x} \ `);

            const choices = execSync(`zenity --list \
        --radiolist --title="Delete Workspace" \
        --column="*" --column="Workspace" \
            ${useChoices}`, { encoding: 'utf-8' })

            if (!choices) {

                let END = execSync(`zenity --error --title "Setup Canceled" --text "Please select a workspace!" --no-wrap`, { encoding: 'utf-8' })

                return;

            }

            const workspaceName = choices.trim();

            const workspaceVerify = execSync(`zenity --question --title "Delete Workspace" --text "<b>${workspaceName}</b>\nIs this the correct workspace?" --no-wrap --ok-label "Yes" --cancel-label "No"`, { encoding: 'utf-8' })

            const deleteDir = execSync(`zenity --password | sudo -S rm -rf "${folderDir}/${workspaceName}"`, { encoding: 'utf-8' })

            let FINAL = execSync(`zenity --info --title "Workspace Deleted" --text "Workspace <b>${workspaceName}</b> has been deleted." --no-wrap`, { encoding: 'utf-8' })


        } catch (e) {

            if (e.status === 1) {
                let END = execSync('zenity --error --title "Process Canceled" --text "Workspace deletion process canceled" --no-wrap', { encoding: 'utf-8' })
            }

            return;

        }

    }
}
