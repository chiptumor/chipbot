import type { ClientSecret } from "../types/secret.ts";

export let bot: ClientSecret = {
    token: "your.discord-bots.token",
    id: "0000000000000000000",
  
    admin: {
        "my_username": "0000000000000000000"
    },
    server: {
        "admin": {
            id: "0000000000000000000",
            channel: {
                logs: "0000000000000000000",
                testing: "0000000000000000000"
            }
        },
        "community": {
            id: "0000000000000000000",
            channel: {
                announcements: "0000000000000000000",
                changelogs: "0000000000000000000",
                giveaways: "0000000000000000000",
                tickets: "0000000000000000000"
            }
        }
    }
};
