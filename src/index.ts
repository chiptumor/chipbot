import * as Discord from "discord.js";
import YAML from "yaml";
import * as FileSystem from "node:fs/promises";
import * as Path from "node:path";
import type { Client } from "./types/client.ts";

const client = <Client> new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.MessageContent
    ]
});

client.commands = new Discord.Collection();
client.aliases = <Client["aliases"]> Object.fromEntries(
    [
        Discord.ApplicationCommandType.ChatInput,
        Discord.ApplicationCommandType.User,
        Discord.ApplicationCommandType.Message,
        Discord.ApplicationCommandType.PrimaryEntryPoint,
        "prefixed"
    ].map(i => [ i, new Discord.Collection() ])
);

FileSystem.readFile(Path.resolve("./secret.yaml"), "utf8").then(file => {
    client.secret = YAML.parse(file);
});
