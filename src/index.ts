import * as Discord from "discord.js";
import YAML from "yaml";
import FileSystem from "node:fs/promises";
import Path from "node:path";
import type { Client } from "./types/client.ts";

const client = <Client> new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.MessageContent
    ]
});

client.commands = new Discord.Collection();
client.aliases = <Client["aliases"]> Object.fromEntries([
    Discord.ApplicationCommandType.ChatInput,
    Discord.ApplicationCommandType.User,
    Discord.ApplicationCommandType.Message,
    Discord.ApplicationCommandType.PrimaryEntryPoint,
    "prefixed"
].map(i => [ i, new Discord.Collection() ]));

(async () => {
    await FileSystem.readFile(
        Path.resolve("./config/secret.yaml"), "utf8"
    ).then(file => {
        client.secret = YAML.parse(file);
    });

    const commandPath = Path.resolve("./dist/command/");
    FileSystem.readdir(commandPath, { recursive: true }).then(files =>
        files.filter(file => file.match(/command\.js$/)).forEach(file =>
            getImport(commandPath, file).then((
                command: Client['commands'] extends
                    Discord.Collection<string, infer T> ? T : never
            ) => {
                if (command.meta) {
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

async function getImport(dir: string, file: string) {
    const path = Path.join(dir, file);
    const url = new URL("file://" + path).href;
    // TODO: adjust url until as simple as possible
    return await import(url);
}
