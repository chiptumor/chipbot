import * as Discord from "discord.js";
import type { InteractionTypeInfo } from "./command.ts";

export interface Client extends Discord.Client {
    aliases: {
        interaction: {
            [Discord.InteractionType.ApplicationCommand]: {
                [K in InteractionTypeInfo[Discord.InteractionType.ApplicationCommand]]:
                    Discord.Collection<string, string>;
            };
            [Discord.InteractionType.MessageComponent]: {
                [K in InteractionTypeInfo[Discord.InteractionType.MessageComponent]]:
                    Discord.Collection<string, string>;
            };
            [Discord.InteractionType.ModalSubmit]:
                Discord.Collection<string, string>;
        };
        event: {
            [Discord.Events.MessageCreate]:
                Discord.Collection<string, string>;
        };
    };
}
