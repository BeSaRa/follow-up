import { Paginated } from '@follow-up/contracts'

export class Pagination<T> implements Paginated<T> {
  declare statusCode: string
  declare result: T
  declare totalElements: number
  declare totalPages: number
  declare numberOfElements: number
}
