export class TeamAlreadyExistsException implements Error {
    public readonly message: string = 'Team name already exists in the game'
    public readonly name: string = 'TeamAlreadyExists'
}