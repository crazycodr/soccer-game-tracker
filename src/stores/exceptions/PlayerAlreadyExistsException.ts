export class PlayerAlreadyExistsException implements Error {
    public readonly message: string = 'Player name already exists in the game'
    public readonly name: string = 'PlayerAlreadyExists'
}