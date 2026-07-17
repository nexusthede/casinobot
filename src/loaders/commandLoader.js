const fs = require("fs");
const path = require("path");

function loadCommands(client) {

    const commandsPath = path.join(
        __dirname,
        "..",
        "commands"
    );

    if (!fs.existsSync(commandsPath)) {
        console.log("[Commands] Folder not found.");
        return;
    }


    const folders = fs.readdirSync(commandsPath);


    for (const folder of folders) {

        const folderPath = path.join(
            commandsPath,
            folder
        );


        if (!fs.statSync(folderPath).isDirectory()) {
            continue;
        }


        const files = fs.readdirSync(folderPath)
            .filter(file => file.endsWith(".js"));


        for (const file of files) {

            const command = require(
                path.join(folderPath, file)
            );


            if (!command.name) {
                console.log(
                    `[Commands] Skipped ${file} (missing name)`
                );
                continue;
            }


            client.commands.set(
                command.name.toLowerCase(),
                command
            );


            if (command.aliases && Array.isArray(command.aliases)) {

                for (const alias of command.aliases) {

                    client.commands.set(
                        alias.toLowerCase(),
                        command
                    );

                }

            }


            console.log(
                `[Commands] Loaded ${command.name}`
            );

        }

    }


    console.log(
        `[Commands] Total loaded: ${client.commands.size}`
    );

}


module.exports = loadCommands;
