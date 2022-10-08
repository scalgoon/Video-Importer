const execSync = require('child_process').execSync;

const fs = require('fs');

const { JsonDB, Config } = require('node-json-db');

const whoami = execSync('whoami', { encoding: 'utf-8' })

const who = whoami.trim()

const db = new JsonDB(new Config(`/home/${who}/Downloads/Import/database`, true, false, '/'));

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

            await db.push("/", { appName: finalAppName, folderDir: newFolder });

            try {

                const desktopShortcut = execSync(`zenity --question --title "Setup for ${finalAppName}" --text "Do you want a desktop shortcut for <b>${finalAppName}</b>?" --no-wrap --ok-label "Yes" --cancel-label "No"`, { encoding: 'utf-8' })

                const makeShortcut = execSync(`cd /home/$USER/Desktop && touch "${finalAppName}.desktop"`, { encoding: 'utf-8' })

                const getNode = execSync(`which node`, { encoding: 'utf-8' })

                const nodeVersion = getNode.trim();
                
                const writeCode = execSync(`echo "[Desktop Entry]\nType=Application\nEncoding=UTF-8\nName=${finalAppName}\nIcon=/home/${who}/Downloads/Import/accessories-camera.svg\nExec=${nodeVersion} /home/${who}/Downloads/Import/service.js" >> "/home/${who}/Desktop/${finalAppName}.desktop"`, { encoding: 'utf-8' })

                let FINAL = execSync(`zenity --info --title "Setup for ${finalAppName}" --text "<b>${finalAppName}</b> is fully set up." --no-wrap`, { encoding: 'utf-8' })

            } catch (e) {

                if (e.status === 1) {
                    let FINAL = execSync(`zenity --info --title "Setup for ${finalAppName}" --text "<b>${finalAppName}</b> is fully set up." --no-wrap`, { encoding: 'utf-8' })
                }

                return;

            }

        } catch (e) {

            if (e.status === 1) {
                let END = execSync('zenity --error --title "Setup Canceled" --text "Install process canceled" --no-wrap', { encoding: 'utf-8' })
            }

            return;

        }

    }
  }
