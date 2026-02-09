import type { Snowflake } from "discord.js";

export interface ClientSecret {
    token: string;
    id: Snowflake;

    admin: SnowflakeList;
    server: Servers;
}

type SnowflakeList = Record<string, Snowflake>;

type Servers = Record<string, {
    id: Snowflake;
    channel: SnowflakeList;
}>;
