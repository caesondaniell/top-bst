class Node {
  constructor (data, left = null, right = null) {
    this.data = data
    this.leftChild = left
    this.rightChild = right
  }
}

class Tree {
  constructor (array) {
    this.root = this.#buildTree(array)
  }

  #buildTree (arr) {
    if (!Array.isArray(arr)) throw new Error('Please enter an array.')
    if (arr.length === 0) return null
    const array = arr.sort((a, b) => a - b)
    array.forEach((item, i) => {
      if (item === array[i + 1]) array.splice(i, 1)
    })
    const mid = Math.floor(array.length / 2)
    const left = array.slice(0, mid)
    const right = array.slice(mid + 1, array.length)
    const node = new Node(
      array[mid]
      , this.#buildTree(left)
      , this.#buildTree(right)
    )
    return node
  }
}

function prettyPrint (node, prefix = '', isLeft = true) {
  if (node === null || node === undefined) return
  prettyPrint(node.rightChild, `${prefix}${isLeft ? '│   ' : '    '}`, false)
  console.log(`${prefix}${isLeft ? '└── ' : '┌── '}${node.data}`)
  prettyPrint(node.leftChild, `${prefix}${isLeft ? '    ' : '│   '}`, true)
}
