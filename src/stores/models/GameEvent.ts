export class GameEvent {

    public readonly type: EventEnum
    public readonly atSeconds: number
    public readonly forTeamUuid: string
    public readonly byPlayerUuid: string

    constructor(type: EventEnum, atSeconds: number, forTeamUuid: string, byPlayerUuid: string) {
        this.type = type;
        this.atSeconds = atSeconds;
        this.forTeamUuid = forTeamUuid;
        this.byPlayerUuid = byPlayerUuid;
    }
}

export enum EventEnum {
    GOAL= 0,
    PASS= 1,
    REVERTED_GOAL= 2,
    REVERTED_PASS= 3
}