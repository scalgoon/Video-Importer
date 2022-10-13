const execSync = require('child_process').execSync;

const fs = require('fs');

const { JsonDB, Config } = require('node-json-db');

const whoami = execSync('whoami', { encoding: 'utf-8' })

const who = whoami.trim()

const pwd = execSync('pwd', { encoding: 'utf-8' })

const where = pwd.trim();

const db = new JsonDB(new Config(`${where}/database`, true, false, '/'));

module.exports = {
    importMedia: async () => {

        let data = await db.getData("/");

        const appName = data.appName;

        const folderDir = data.folderDir;

        const projInfo = data.infoFile;

        try {

            const output = execSync(`for dir in ${folderDir}/*/; do basename "$dir"; done`, { encoding: 'utf-8' });

            let splitChoices = output.split("\n");

            let choicesArray = Array.from(splitChoices);

            let filteredArray = choicesArray.filter(e => e !== "");

            let useChoices = filteredArray.map((x) => `"*" ${x} \ `);

            const choices = execSync(`zenity --list \
        --radiolist --title="File Import" \
        --column="*" --column="Workspace" \
            ${useChoices}`, { encoding: 'utf-8' })

            const normalName = choices.trim();

            let projectName;

            let arrayProjectInfo;

            const projectOutput = execSync(`for dir in ${folderDir}/${normalName}/*/; do basename "$dir"; done`, { encoding: 'utf-8' });

            let projectSplitChoices = projectOutput.split("\n");

            let projectChoicesArray = Array.from(projectSplitChoices);

            let projectFilteredArray = projectChoicesArray.filter(e => e !== "");

            let projectUseChoices = projectFilteredArray.map((x) => `"*" "${x}" \ `);

            try {

                let dir2 = `${folderDir}/${normalName}/`;

                const isEmptyDir = await Fs.isEmptyDir(dir2);

                if (isEmptyDir === true) {

                    if (projInfo === undefined) {

                        const name2 = execSync('zenity --entry --title "Project Name" --text "Please enter the name of your project"', { encoding: 'utf-8' })

                        projectName = name2.trim();

                    } else {

                        const projectInfo2 = execSync(`zenity --forms --title="Import Media" --text="Project Information" \
                    --add-entry="Project Name" \
                    --add-entry="Details" \
                    --add-calendar="Due Date"`, { encoding: 'utf-8' })

                        const trimProjectInfo2 = projectInfo2.trim();

                        const splitProjectInfo2 = trimProjectInfo2.split("|");

                        arrayProjectInfo = Array.from(splitProjectInfo2);

                        projectName = arrayProjectInfo[0];

                    }

                } else {

                    const projectChoices = execSync(`zenity --list \
                --radiolist --title="Select A Project" --width=300 --height=300 \
                --column="*" --extra-button="Create New Project" --column="${normalName}" \
                    ${projectUseChoices}`, { encoding: 'utf-8' })

                    const projectNormalName = projectChoices.trim();

                    projectName = projectNormalName;

                }

            } catch (e) {

                if (e.status === 1 && e.stdout === "Create New Project\n") {

                    if (projInfo === undefined) {

                        const name = execSync('zenity --entry --title "Project Name" --text "Please enter the name of your project"', { encoding: 'utf-8' })
        
                        projectName = name.trim();
        
                    } else {
        
                        const projectInfo = execSync(`zenity --forms --title="Import Media" --text="Project Information" \
                    --add-entry="Project Name" \
                    --add-entry="Details" \
                    --add-calendar="Due Date"`, { encoding: 'utf-8' })
        
                        const trimProjectInfo = projectInfo.trim();
        
                        const splitProjectInfo = trimProjectInfo.split("|");
        
                        arrayProjectInfo = Array.from(splitProjectInfo);
        
                        projectName = arrayProjectInfo[0];
        
                    }

                } else if (e.status === 1) {

                    let END = execSync(`zenity --error --title "${appName}" --text "Import process canceled" --no-wrap`, { encoding: 'utf-8' })
                
                    return;
                }

            }

            const videoFiles = execSync(`zenity --file-selection --title "${normalName}" --multiple --filename "/media/$USER/" --directory`, { encoding: 'utf-8' })

            const newVideo = videoFiles.trim();

            const footageVerify = execSync(`zenity --question --title "Footage Import" --text "<b>${newVideo}</b>\nIs this the correct directory?" --no-wrap --ok-label "Yes" --cancel-label "No"`, { encoding: 'utf-8' })

            let dir = `${folderDir}/${normalName}/${projectName}`;

            if (fs.existsSync(dir)) {
                const dirExists = execSync(`zenity --question --title "Project Exists" --text "The project you specified already exists, would you like to use it?" --no-wrap --ok-label "Yes" --cancel-label "No"`, { encoding: 'utf-8' })
            } else {
                const makeDir = execSync(`zenity --password | sudo -S mkdir "${folderDir}/${normalName}/${projectName}"`, { encoding: 'utf-8' })
            }

            const process = execSync(`(zenity --password | sudo -S cp -r "${newVideo}" "${folderDir}/${normalName}/${projectName}/") | zenity --progress --width 350 --pulsate --auto-close --text "Importing Media..." --title "${appName}" --no-cancel`, { encoding: 'utf-8' })

            if (projInfo !== undefined) {
                const projectDetails = execSync(`zenity --password | sudo -S bash -c 'echo "Project Name: ${projectName}\n\nProject Details: ${arrayProjectInfo[1]}\n\nDue Date: ${arrayProjectInfo[2]}" > "${folderDir}/${normalName}/${projectName}/Project Information"'`, { encoding: 'utf-8' })
            }

            const clearSD = execSync(`zenity --question --title "Clear SD" --text "Footage imported successfully!\nWould you like to clear the SD Card?" --no-wrap --ok-label "Yes" --cancel-label "No"`, { encoding: 'utf-8' })

            const clearingSD = execSync(`zenity --password | sudo -S rm -rf "${newVideo}"`, { encoding: 'utf-8' })

            const FINAL = execSync(`zenity --info --title "${appName}" --text "SD card successfully cleared!" --no-wrap`, { encoding: 'utf-8' })

        } catch (e) {

            console.log(e)

            if (e.status === 1) {
                let END = execSync(`zenity --error --title "${appName}" --text "Import process canceled" --no-wrap`, { encoding: 'utf-8' })
            }

            return;

        }

    }

}
