import {v4} from "uuid";

export class Player {

    public uuid: string
    public name: string
    public team: string = ''
    public status: PlayerStatusEnum = PlayerStatusEnum.waiting
    public jacketNumber: string = ''

    constructor(name: string) {
        this.uuid = v4()
        this.name = name
    }
}

export enum PlayerStatusEnum {
    waiting = 'waiting',
    benching = 'benching',
    playing = 'playing',
    goaling = 'goaling',

}