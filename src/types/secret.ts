import type { Snowflake } from "discord.js";

export interface ClientSecret {
    bot: {
        token: string;
        client: Snowflake;

        admin: SnowflakeList;
        server: Servers;

        user: SnowflakeList;
    };
    discord: {
        user: SnowflakeList;
        server: Servers;
    };
}

type SnowflakeList = Record<string, Snowflake>;

type Servers = Record<string, {
    id: Snowflake;
    channel: SnowflakeList;
}>;
