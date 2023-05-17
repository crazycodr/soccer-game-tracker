import {v4} from "uuid";

export class Game {
    public uuid: string
    public status: string = 'paused'
    public seconds: number = 0

    constructor() {
        this.uuid = v4()
    }
}