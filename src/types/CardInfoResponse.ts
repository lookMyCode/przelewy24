export interface CardInfoResponse {
  refId: string,
  bin: number | string,
  mask: string,
  cardType: string,
  cardDate: string,
  hash: string
}