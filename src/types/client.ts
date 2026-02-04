import * as Discord from "discord.js";
import type { Command, CommandTypeInfo } from "./command.ts";

export interface Client extends Discord.Client {
    commands: Discord.Collection<string, Command>;
    aliases: {
        [K in keyof CommandTypeInfo]: Discord.Collection<string, string>;
    };
}
