export class TeamNotFoundException implements Error {
    public readonly message: string = 'Team not found'
    public readonly name: string = 'TeamNotFound'
}