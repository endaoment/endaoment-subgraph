export enum OnChainNdaoEntityType {
  Org = 1,
  Fund = 2,
}

export const ORG_ENTITY_TYPE = 'Org'
export const FUND_ENTITY_TYPE = 'Fund'
export const UNKNOWN_ENTITY_TYPE = 'Unknown'

export function convertEntityType(entityType: OnChainNdaoEntityType): string {
  switch (entityType) {
    case OnChainNdaoEntityType.Org:
      return ORG_ENTITY_TYPE
    case OnChainNdaoEntityType.Fund:
      return FUND_ENTITY_TYPE
    default:
      return UNKNOWN_ENTITY_TYPE
  }
}
