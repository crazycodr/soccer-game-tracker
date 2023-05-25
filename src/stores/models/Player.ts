import {v4} from "uuid";

export class Player {

    public uuid: string
    public name: string
    public team: string = ''
    public status: PlayerStatusEnum = PlayerStatusEnum.waiting
    public jersey: string = ''

    public benchingSeconds: number = 0
    public playingSeconds: number = 0
    public goalingSeconds: number = 0

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