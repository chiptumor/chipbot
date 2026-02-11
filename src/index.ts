import FileSystem from "node:fs/promises";
import Path from "node:path";
import Module from "node:module";
import * as Discord from "discord.js";
import type { Client } from "./types/client.ts";

const require: (string) => any = Module.createRequire(import.meta.url);

let resolvePath = (...path) => Path.resolve(import.meta.url, ...path);
let getImport = async (...path) => require(resolvePath(...path));

let collectionsFromKeys = (...keys: (keyof any)[]) =>
    Object.fromEntries(keys.map(i => [ i, new Discord.Collection() ]));


const client = <Client> new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.MessageContent
    ]
});

client.commands = new Discord.Collection();
client.aliases = <Client["aliases"]> {
    interaction: {
        [Discord.InteractionType.ApplicationCommand]:
            collectionsFromKeys(
                Discord.ApplicationCommandType.ChatInput,
                Discord.ApplicationCommandType.User,
                Discord.ApplicationCommandType.Message,
                Discord.ApplicationCommandType.PrimaryEntryPoint
            ),
        [Discord.InteractionType.MessageComponent]:
            collectionsFromKeys(
                Discord.ComponentType.Button,
                Discord.ComponentType.StringSelect,
                Discord.ComponentType.UserSelect,
                Discord.ComponentType.RoleSelect,
                Discord.ComponentType.MentionableSelect,
                Discord.ComponentType.ChannelSelect
            ),
        [Discord.InteractionType.ModalSubmit]:
            new Discord.Collection()
    },
    event: {
        [Discord.Events.MessageCreate]:
            new Discord.Collection()
    }
};

(async () => {
    client.secret = await getImport("./config/secret.js");

    // read all files from ./commands/...
    const commandPath = resolvePath("./commands/");
    FileSystem.readdir(commandPath, { recursive: true }).then(files =>
        // only get files named 'command.js'
        files.filter(file => file.match(/command\.js$/)).forEach(file =>
            getImport(commandPath, file).then((
                // T = type of values from Client.commands's Collection
                command: Client['commands'] extends
                    Discord.Collection<string, infer T> ? T : never
            ) => {
                if (command.meta) {
                    // set command entry
                    client.commands.set(command.meta.name, command);
                    Object.entries(command.meta.types).forEach(
                        ([ type, { alias }]) =>
                        client.aliases[type as keyof Client["aliases"]]
                            .set(alias, command.meta.name)
                    )
                }
            })
        )
    );
})();
