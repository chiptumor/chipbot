import * as Discord from "discord.js";
import {
    InteractionType as I,
    ApplicationCommandType as A,
    ComponentType as C
} from "discord.js";

type CommandReturn = void | Promise<void>;

export interface Command {
    /** Data returned to Discord and applicable to the client. */
    config: {
        /** The main name of the command. */
        name: string;
    
        /**
         * Guild ids or keys under `secret.discord.server` to restrict this
         * command to.  
         * If nullish, this command is not restricted.
         */
        guilds?: (string | Discord.Snowflake)[] | null;
        /**
         * Whether to restrict this command to admins, or the users to restrict
         * this command to.  
         * If nullish, this command is public.
         */
        admins?: true | (string | Discord.Snowflake)[] | null;
    };

    /** Interaction types to apply to this command. */
    interaction: {
        [I.Ping]?: unknown;

        [I.ApplicationCommand]?: {
            [A in keyof InteractionTypeInfo[I.ApplicationCommand]]?: {
                /** String to use when fetching this command from the client. */
                alias: string;
                /** API data used when registering command. */
                data: Omit<InteractionTypeInfo[I.ApplicationCommand][A]["cfg"], "type">;
                /** Function to execute. */
                execute: (i: InteractionTypeInfo[I.ApplicationCommand][A]["int"]) => CommandReturn;
            };
        };

        // /^(.+?):(.+?)(?:(?<=\?)(.+))?$/
        [I.MessageComponent]?: {
            [C in keyof InteractionTypeInfo[I.MessageComponent]]?: {
                [K: string]: {
                    /** String to use when fetching this command from the client. */
                    alias: string;
                    /** Function to execute. */
                    execute?: (i: InteractionTypeInfo[I.MessageComponent][C]["int"], args: string[]) => CommandReturn;
                    /** Nested aliases. */
                    children?: NonNullable<Command["interaction"][I.MessageComponent]>[C];
                };
            };
        };

        [I.ApplicationCommandAutocomplete]?: {
            [K: string]: {
                execute?: (i: InteractionTypeInfo[I.ApplicationCommandAutocomplete]["int"], value: string) => CommandReturn;
            }
        };

        [I.ModalSubmit]: {
            [K: string]: {
                /** String to use when fetching this command from the client. */
                alias: string;
                /** Function to execute. */
                execute?: (i: InteractionTypeInfo[I.ModalSubmit]["int"], args: string[]) => CommandReturn;
                /** Nested aliases. */
                children?: NonNullable<Command["interaction"][I.ModalSubmit]>;
            };
        };
    };
    
    event: {
        [Discord.Events.MessageCreate]: {
            execute?: (i: EventsInfo[Discord.Events.MessageCreate]["int"]) => CommandReturn;
        };
    };
}

export interface InteractionTypeInfo {
    [I.Ping]: unknown;
    [I.ApplicationCommand]: {
        [A.ChatInput]: {
            cfg: Discord.ChatInputApplicationCommandData;
            int: Discord.ChatInputCommandInteraction;
        };
        [A.User]: {
            cfg: Discord.UserApplicationCommandData;
            int: Discord.UserContextMenuCommandInteraction;
        };
        [A.Message]: {
            cfg: Discord.MessageApplicationCommandData;
            int: Discord.MessageContextMenuCommandInteraction;
        };
        [A.PrimaryEntryPoint]: {
            cfg: Discord.PrimaryEntryPointCommandData;
            int: Discord.PrimaryEntryPointCommandInteraction;
        };
    };
    [I.MessageComponent]: {
        [C.Button]:
            { int: Discord.ButtonInteraction; };
        [C.StringSelect]:
            { int: Discord.StringSelectMenuInteraction; };
        [C.UserSelect]:
            { int: Discord.UserSelectMenuInteraction; };
        [C.RoleSelect]:
            { int: Discord.RoleSelectMenuInteraction; };
        [C.MentionableSelect]:
            { int: Discord.MentionableSelectMenuInteraction; };
        [C.ChannelSelect]:
            { int: Discord.ChannelSelectMenuInteraction; };
    };
    [I.ApplicationCommandAutocomplete]:
        { int: Discord.AutocompleteInteraction; };
    [I.ModalSubmit]:
        { int: Discord.ModalSubmitInteraction; };
}

export interface EventsInfo {
    [Discord.Events.MessageCreate]: {
        /** A message calling a command by matching a prefix. */
        cfg: {
            /** A string or list of strings to use to execute this command. */
            name: string | string[];
        };
        int: Discord.Message;
    };
}
