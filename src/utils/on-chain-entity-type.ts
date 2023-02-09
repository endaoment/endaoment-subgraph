export enum OnChainNdaoEntityType {
  Org = 1,
  Fund = 2,
}

export function convertEntityType(entityType: OnChainNdaoEntityType): string {
  switch (entityType) {
    case OnChainNdaoEntityType.Org:
      return 'Org'
    case OnChainNdaoEntityType.Fund:
      return 'Fund'
    default:
      return 'Unknown'
  }
}
