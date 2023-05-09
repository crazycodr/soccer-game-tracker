import {v4} from "uuid";

export class Team {

    public uuid: string
    public name: string
    public color: string = 'white'

    constructor(name: string) {
        this.uuid = v4()
        this.name = name
    }
}