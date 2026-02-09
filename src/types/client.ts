import * as Discord from "discord.js";
import type { InteractionTypeInfo, ClientAliases } from "./command.ts";

export interface Client extends Discord.Client {
    aliases: ClientAliases;
}
