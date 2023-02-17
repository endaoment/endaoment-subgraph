export function remove<T>(array: Array<T>, element: T): Array<T> {
  const toReturn = new Array<T>()
  for (let i = 0; i < array.length; i++) {
    if (array[i] != element) {
      toReturn.push(array[i])
    }
  }
  return toReturn
}
