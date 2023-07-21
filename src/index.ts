import type { MCStatusResponse, Env } from './types';

const SERVERS = [
    {
        host: 'smp.nimahost.net',
        players: ['Appetising'],
    },
];

async function sendWebhook(online: boolean, player: string, host: string) {
    await fetch('https://webhook.willow.sh', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            $colour: online ? '#67c157' : '#f26c4b',
            $title: 'Alt Status Changed',
            Status: `\`${online ? 'Online' : 'Offline'}\``,
            Server: `\`${host}\``,
            Alt: `\`${player}\``,
        }),
    });
}

async function isOnline(player: string, host: string) {
    const response = await fetch(
        `https://api.mcstatus.io/v2/status/java/${host}`,
    );

    const data = await response.json<MCStatusResponse>();

    return data.players.list.map((player) => player.name_raw).includes(player);
}

async function getSavedStatus(env: Env, player: string, host: string) {
    const result = await env.STATUS.get(`${host}:${player}`);
    return JSON.parse(result ?? 'false') as boolean;
}

async function check(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    for (const { host, players } of SERVERS) {
        for (const player of players) {
            const savedStatus = await getSavedStatus(env, player, host);
            const online = await isOnline(player, host);

            if (savedStatus != online) {
                await env.STATUS.put(
                    `${host}:${player}`,
                    JSON.stringify(online),
                );

                await sendWebhook(online, player, host);
            }
        }
    }
}

export default {
    scheduled: check,
};
