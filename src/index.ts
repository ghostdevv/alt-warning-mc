import { MCStatusResponse } from './types';

const ALTS = ['Appetising', 'sectum_sempra'];
const SERVER = '157.90.3.16:25661';

async function sendWebhook(alt: string) {
    await fetch('https://webhook.willow.sh', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            Status: 'Alt Missing',
            Server: SERVER,
            Alt: alt,
        }),
    });
}

async function check() {
    const response = await fetch(
        `https://api.mcstatus.io/v2/status/java/${SERVER}`,
    );

    const data = await response.json<MCStatusResponse>();

    const players = data.players.list.map((player) => player.name_raw);

    for (const alt of ALTS) {
        if (!players.includes(alt)) {
            await sendWebhook(alt);
        }
    }
}

export default {
    scheduled: check,
};
