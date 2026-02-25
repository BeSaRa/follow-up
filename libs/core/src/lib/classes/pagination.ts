export class Pagination<T> {
  declare statusCode: string
  declare result: T
  declare totalElements: number
  declare totalPages: number
  declare numberOfElements: number
}
