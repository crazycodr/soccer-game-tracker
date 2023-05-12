import {v4} from "uuid";

export class Player {

    public uuid: string
    public name: string
    public team: string = ''
    public status: string = 'playing'
    public gameSeconds: number = 0
    public benchSeconds: number = 0
    public goals: number = 0
    public passes: number = 0
    public jacketNumber: string = ''

    constructor(name: string) {
        this.uuid = v4()
        this.name = name
    }
}