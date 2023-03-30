export interface MCStatusResponse {
    online: boolean;
    host: string;
    port: number;
    eula_blocked: boolean;
    retrieved_at: number;
    expires_at: number;
    version: Version;
    players: Players;
    motd: Motd;
    icon: string;
    mods: any[];
}

export interface Version {
    name_raw: string;
    name_clean: string;
    name_html: string;
    protocol: number;
}

export interface Players {
    online: number;
    max: number;
    list: List[];
}

export interface List {
    uuid: string;
    name_raw: string;
    name_clean: string;
    name_html: string;
}

export interface Motd {
    raw: string;
    clean: string;
    html: string;
}
