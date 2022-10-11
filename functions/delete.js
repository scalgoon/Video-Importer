const execSync = require('child_process').execSync;

const fs = require('fs');

const { JsonDB, Config } = require('node-json-db');

const whoami = execSync('whoami', { encoding: 'utf-8' })

const who = whoami.trim()

const pwd = execSync('pwd', { encoding: 'utf-8' })

const where = pwd.trim();

const db = new JsonDB(new Config(`${where}/database`, true, false, '/'));

module.exports = {
    deleteMedia: async () => {
      
        let data = await db.getData("/");

        const appName = data.appName;

        const folderDir = data.folderDir;

        try {

            const workspaceOutput = execSync(`for dir in ${folderDir}/*/; do basename "$dir"; done`, { encoding: 'utf-8' });

            let splitChoices = workspaceOutput.split("\n");

            let workspaceChoicesArray = Array.from(splitChoices);

            let workspaceFilteredArray = workspaceChoicesArray.filter(e => e !== "");

            let workspacesUseChoices = workspaceFilteredArray.map((x) => `"*" ${x} \ `);

            const workspaceChoices = execSync(`zenity --list \
            --radiolist --title="Select A Workspace" \
            --column="*" --column="Workspace" \
                ${workspacesUseChoices}`, { encoding: 'utf-8' })

            const workspaceNormalName = workspaceChoices.trim();


            const projectOutput = execSync(`for dir in ${folderDir}/${workspaceNormalName}/*/; do basename "$dir"; done`, { encoding: 'utf-8' });

            let projectSplitChoices = projectOutput.split("\n");

            let projectChoicesArray = Array.from(projectSplitChoices);

            let projectFilteredArray = projectChoicesArray.filter(e => e !== "");

            let projectUseChoices = projectFilteredArray.map((x) => `"*" "${x}" \ `);

            const projectChoices = execSync(`zenity --list \
                --radiolist --title="Select A Project" \
                --column="*" --column="${workspaceNormalName}" \
                    ${projectUseChoices}`, { encoding: 'utf-8' })

            const projectNormalName = projectChoices.trim();

            const projectVerify = execSync(`zenity --question --title "Remove Project" --text "<b>${projectNormalName}</b>\nIs this the correct project?" --no-wrap --ok-label "Yes" --cancel-label "No"`, { encoding: 'utf-8' })

            const deleteDir = execSync(`zenity --password | sudo -S rm -rf "${folderDir}/${workspaceNormalName}/${projectNormalName}"`, { encoding: 'utf-8' })

            let FINAL = execSync(`zenity --info --title "Project Deleted" --text "Project <b>${projectNormalName}</b> has been deleted." --no-wrap`, { encoding: 'utf-8' })

        } catch (e) {

            if (e.status === 1) {
                let END = execSync('zenity --error --title "Process Canceled" --text "Project deletion process canceled" --no-wrap', { encoding: 'utf-8' })
            }

            return;

        }

    }
  }
