const execSync = require('child_process').execSync;

const fs = require('fs');

const { JsonDB, Config } = require('node-json-db');

const whoami = execSync('whoami', { encoding: 'utf-8' })

const who = whoami.trim()

const db = new JsonDB(new Config(`/home/${who}/Downloads/Videodeck/database`, true, false, '/'));

module.exports = {
    installService: async () => {

        try {

            const START = execSync('zenity --text-info --title "Setup" --filename "./README" --checkbox "I understand the terms above."', { encoding: 'utf-8' })

        } catch (e) {

            if (e.status === 1) {
                let END = execSync('zenity --error --title "Setup Canceled" --text "Setup process canceled" --no-wrap', { encoding: 'utf-8' })
            }

            return;

        }

        try {

            const chooseFolderDirPrompt = execSync(`zenity --info --title "Setup" --text "Click ok to select your projects folder." --no-wrap`, { encoding: 'utf-8' })

            const chooseFolderDir = execSync(`zenity --file-selection --title "Setup Project Folder" --multiple --filename "/home/$USER/" --directory`, { encoding: 'utf-8' })

            const newFolder = chooseFolderDir.trim();

            const folderVerify = execSync(`zenity --question --title "Setup Project Folder" --text "<b>${newFolder}</b>\nIs this the correct directory?" --no-wrap --ok-label "Yes" --cancel-label "No"`, { encoding: 'utf-8' })

            const appName = execSync('zenity --entry --title "App Name" --text "Please enter the your requested name for the app."', { encoding: 'utf-8' })

            const finalAppName = appName.trim();

            const appSettings = execSync(`zenity --list \
            --title="${finalAppName} Settings" --width=600 --height=600 \
            --text "Select which options you want to have." \
            --checklist \
            --column "*" \
            --column "Options" \
            FALSE "Create Desktop Shortcut" \
            FALSE "Project Information File" \
            FALSE "Application Menu Shortcut"`, { encoding: 'utf-8' })

            const trimAppSettings = appSettings.trim();

            const splitAppSettings = trimAppSettings.split("|");

            const arrayAppSettings = Array.from(splitAppSettings);

            const getNode = execSync(`which node`, { encoding: 'utf-8' })

            const nodeVersion = getNode.trim();

            if (arrayAppSettings.includes("Create Desktop Shortcut")) {

                const makeDeskShortcut = execSync(`cd /home/$USER/Desktop && touch "${finalAppName}.desktop"`, { encoding: 'utf-8' })

                const writeDeskCode = execSync(`echo "[Desktop Entry]\nType=Application\nEncoding=UTF-8\nName=${finalAppName}\nIcon=/home/${who}/Downloads/Videodeck/accessories-camera.svg\nExec=${nodeVersion} /home/${who}/Downloads/Videodeck/service.js\nActions=add-workspace;import-media;delete-project;\n\n[Desktop Action add-workspace]\nName=Add Workspace\nExec=${nodeVersion} /home/${who}/Downloads/Videodeck/app/workspace.js\nIcon=/home/${who}/Downloads/Videodeck/accessories-camera.svg\n\n[Desktop Action import-media]\nName=Import Media\nExec=${nodeVersion} /home/${who}/Downloads/Videodeck/app/import.js\nIcon=/home/${who}/Downloads/Videodeck/accessories-camera.svg\n\n[Desktop Action delete-project]\nName=Delete Project\nExec=${nodeVersion} /home/${who}/Downloads/Videodeck/app/delete.js\nIcon=/home/${who}/Downloads/Videodeck/accessories-camera.svg" >> "/home/${who}/Desktop/${finalAppName}.desktop"`, { encoding: 'utf-8' })
            }

            if (arrayAppSettings.includes("Project Information File")) {

                await db.push("/", { appName: finalAppName, folderDir: newFolder, infoFile: "YES" });

            } else {

                await db.push("/", { appName: finalAppName, folderDir: newFolder });

            }

            if (arrayAppSettings.includes("Application Menu Shortcut")) {

                const writeAppCode = execSync(`zenity --password | sudo -S echo "[Desktop Entry]\nType=Application\nEncoding=UTF-8\nName=${finalAppName}\nIcon=/home/${who}/Downloads/Videodeck/accessories-camera.svg\nExec=${nodeVersion} /home/${who}/Downloads/Videodeck/service.js\nActions=add-workspace;import-media;delete-project;\n\n[Desktop Action add-workspace]\nName=Add Workspace\nExec=${nodeVersion} /home/${who}/Downloads/Videodeck/app/workspace.js\nIcon=/home/${who}/Downloads/Videodeck/accessories-camera.svg\n\n[Desktop Action import-media]\nName=Import Media\nExec=${nodeVersion} /home/${who}/Downloads/Videodeck/app/import.js\nIcon=/home/${who}/Downloads/Videodeck/accessories-camera.svg\n\n[Desktop Action delete-project]\nName=Delete Project\nExec=${nodeVersion} /home/${who}/Downloads/Videodeck/app/delete.js\nIcon=/home/${who}/Downloads/Videodeck/accessories-camera.svg" >> "/home/${who}/.local/share/applications/${finalAppName}.desktop"`, { encoding: 'utf-8' })

                try {

                    const restartPrompt = execSync(`zenity --question --title "Restart Prompt" --text "In order for the app to show in your Application menu you must restart the session." --no-wrap --ok-label "Restart now" --cancel-label "Restart later"`, { encoding: 'utf-8' })

                    const restarting = execSync(`reboot`, { encoding: 'utf-8' })
                
                } catch (e) {

                    if (e.status === 1) {
                        let FINAL = execSync(`zenity --info --title "Setup for ${finalAppName}" --text "<b>${finalAppName}</b> is fully set up." --no-wrap`, { encoding: 'utf-8' })
                    }

                    return;

                }

            }

            let FINAL = execSync(`zenity --info --title "Setup for ${finalAppName}" --text "<b>${finalAppName}</b> is fully set up." --no-wrap`, { encoding: 'utf-8' })

        } catch (e) {

            if (e.status === 1) {
                let END = execSync('zenity --error --title "Setup Canceled" --text "Install process canceled" --no-wrap', { encoding: 'utf-8' })
            }

            return;

        }

    }
}
