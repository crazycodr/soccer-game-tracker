export class PlayerNotFoundException implements Error {
    public readonly message: string = 'Player not found'
    public readonly name: string = 'PlayerNotFound'
}