import {v4} from "uuid"
import {GameEventReferences} from "@/stores/models/GameEventReferences";

export class GameEvent {

    /**
     * @deprecated
     */
    public forTeamUuid: string | null = null

    /**
     * @deprecated
     */
    public byPlayerUuid: string | null = null

    /**
     * @deprecated
     */
    public atSeconds: number

    public uuid: string
    public type: EventEnum
    public on: Date | string | null = null
    public references: GameEventReferences = new GameEventReferences()

    constructor(type: EventEnum, on: Date, forTeamUuid: string | null, byPlayerUuid: string | null) {
        this.uuid = v4()
        this.type = type
        this.on = on
        this.atSeconds = 0
        if (forTeamUuid) {
            this.forTeamUuid = forTeamUuid
            this.references.teamUuid = forTeamUuid
        }
        if (byPlayerUuid) {
            this.byPlayerUuid = byPlayerUuid
            this.references.playerUuid = byPlayerUuid
        }
    }
}

export enum EventEnum {
    GOAL= 0,
    PASS= 1,
    REVERTED_GOAL= 2,
    REVERTED_PASS= 3,
    GAME_TIMER_START = 10,
    GAME_TIMER_STOP = 11,
    PLAYER_TO_FIELD = 20,
    PLAYER_TO_GOAL = 21,
    PLAYER_TO_BENCH = 22,
}