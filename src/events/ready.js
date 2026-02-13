import { Events } from "discord.js";

export const name = Events.ClientReady;
export const once = true;
export function event(client) {
    console.log(`Logged in as ${client.user.tag}`)
}
