export class NotFound extends Error {
  constructor() {
    super('Link not found.')
  }
}
