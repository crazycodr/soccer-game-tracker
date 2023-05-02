export class Player {

    public readonly name: string
    public team: string = ''
    public status: string = 'playing'
    public gameSeconds: number = 0
    public benchSeconds: number = 0
    public goals: number = 0
    public passes: number = 0

    constructor(name: string) {
        this.name = name
    }
}