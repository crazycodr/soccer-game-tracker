export class GameNotFoundException implements Error {
    public readonly message: string = 'Game not found'
    public readonly name: string = 'GameNotFound'
}