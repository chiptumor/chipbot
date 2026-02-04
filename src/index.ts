import * as Discord from "discord.js";
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
