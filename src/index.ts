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
        component: new Discord.Collection(),
        [Discord.InteractionType.ApplicationCommand]:
            collectionsFromKeys(
                Discord.ApplicationCommandType.ChatInput,
                Discord.ApplicationCommandType.User,
                Discord.ApplicationCommandType.Message,
                Discord.ApplicationCommandType.PrimaryEntryPoint
            )
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
    FileSystem.readdir(commandPath, { recursive: true })
    // only get files named 'command.js'
    .then(files => files.filter(file => file.match(/command\.js$/))
        .forEach(file => getImport(commandPath, file).then((
            // T = type of values from Client.commands's collections
            command: Client["commands"] extends
                Discord.Collection<string, infer T> ? T : never
        ) => {
            if (command.config && (command.config.enabled ?? true)) {
                // set command entry
                client.commands.set(name = command.config.name, command);

                client.aliases.interaction.component.set(command.config.componentAlias, name);

                // interactions
                Object.entries(i = command.interaction).forEach(([ key, value ]) => {
                    switch (key) {
                        case t = Discord.InteractionType.ApplicationCommand:
                        Object.entries(value).forEach(([ a, value ]) =>
                            client.aliases.interaction[t][a].set(i[t][a].data.name, name)
                        ); break;
                        case t = Discord.InteractionType.MessageComponent:
                        Object.entries(value).forEach(([ c, value ]) =>
                            Object.entries(value).forEach(([ key, value ]) => {

                            })
                        ); break;
                    }
                });
                Object.entries(command.meta.types).forEach(
                    ([ type, { alias }]) =>
                    client.aliases[type as keyof Client["aliases"]]
                        .set(alias, command.meta.name)
                );
            }
        }))
    );
})();
