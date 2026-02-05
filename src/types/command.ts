import * as Discord from "discord.js";

export interface Command {
    /** Data returned to Discord and applicable to the client. */
    meta: {
        /** The main name of the command. */
        name: string;
    
        /**
         * Guild ids to restrict this command to.  
         * If nullish, this command is not restricted.
         */
        guilds?: Discord.Snowflake[] | null;
        /**
         * Whether to restrict this command to admins, or the users to restrict this
         * command to.  
         * If nullish, this command is public.
         */
        admins?: true | Discord.Snowflake[] | null;
    
        /** Applicable types to this command and their data. */
        types: {
            [K in keyof CommandTypeInfo]?: {
                /** String to use when fetching this command from the client. */
                alias: string;
                /** API data used when registering command. */
                data: Omit<CommandTypeInfo[K], "type">;
            };
        };
    };
    /** Functions to handle interactions. */
    methods: Record<string, () => void>;
}

const CommandType = Discord.ApplicationCommandType;

export interface CommandTypeInfo {
    /** {@inheritDoc Discord.ApplicationCommandType.ChatInput} */
    [CommandType.ChatInput        ]: Discord.ChatInputApplicationCommandData;
    /** {@inheritDoc Discord.ApplicationCommandType.User} */
    [CommandType.User             ]: Discord.     UserApplicationCommandData;
    /** {@inheritDoc Discord.ApplicationCommandType.Message} */
    [CommandType.Message          ]: Discord.  MessageApplicationCommandData;
    /** {@inheritDoc Discord.ApplicationCommandType.PrimaryEntryPoint} */
    [CommandType.PrimaryEntryPoint]: Discord.   PrimaryEntryPointCommandData;
    /** A message calling a command by matching a prefix. */
    prefixed: {
        /**
         * A string or list of strings to override the default prefix with.  
         * If nullish, the default prefix is used.
         */
        prefix?: string | string[] | null;
        /** A string or list of strings to use to execute this command. */
        name: string | string[];
    };
}
