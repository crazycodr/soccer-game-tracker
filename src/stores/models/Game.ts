import {v4} from "uuid";
import type {Team} from "@/stores/models/Team";
import type {Player} from "@/stores/models/Player";
import type {Event} from "@/stores/models/Event";

export class Game {

    public uuid: string
    public status: GameStatusEnum = GameStatusEnum.PRE_GAME
    public teams: Team[] = []
    public players: Player[] = []
    public events: Event[] = []

    constructor() {
        this.uuid = v4()
    }
}

export enum GameStatusEnum {
    PRE_GAME = 'pre',
    PLAYING = 'playing',
    PAUSED = 'paused',
    COMPLETED = 'completed'
}