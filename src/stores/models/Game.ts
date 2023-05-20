import {v4} from "uuid";

export class Game {
    public uuid: string
    public status: string = 'paused'

    constructor() {
        this.uuid = v4()
    }
}