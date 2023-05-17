import {v4} from "uuid";
import type {Team} from "@/stores/models/Team";
import type {Player} from "@/stores/models/Player";
import type {GameEvent} from "@/stores/models/GameEvent";

export class RegistryGame {

    public uuid: string
    public status: string = 'paused'
    public seconds: number = 0
    public teams: Team[] = []
    public players: Player[] = []
    public events: GameEvent[] = []

    constructor() {
        this.uuid = v4()
    }
}