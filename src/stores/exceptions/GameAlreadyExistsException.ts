export class GameAlreadyExistsException implements Error {
    public readonly message: string = 'Game name already exists'
    public readonly name: string = 'GameAlreadyExists'
}