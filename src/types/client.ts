import * as Discord from "discord.js";

export interface Client extends Discord.Client {
    aliases: {
        interaction: {
            [Discord.InteractionType.ApplicationCommand]: {
                [K in Discord.ApplicationCommandType]: Discord.Collection<string, string>;
            };
            [Discord.InteractionType.MessageComponent]: {};
        };
        // [K in keyof InteractionTypeInfo]: Discord.Collection<string, string>;
    };
    secret: { [K: string]: any; } & {
        discord: {
            token: string;
            client: Discord.Snowflake;
            admin: { [K: string]: Discord.Snowflake; };
            server: {
                [K: string]: {
                    id: Discord.Snowflake;
                    channel: { [K: string]: Discord.Snowflake; };
                };
            };
            user: { [K: string]: Discord.Snowflake; };
        };
    };
}
