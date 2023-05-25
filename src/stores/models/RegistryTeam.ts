export class RegistryPlayer {

    public uuid: string
    public name: string
    public jersey: string = ''

    constructor(uuid: string, name: string) {
        this.uuid = uuid
        this.name = name
    }
}