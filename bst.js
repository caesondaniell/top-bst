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

  deleteItem (value, node = this.root) {
    if (!this.includes(value, node)) return
    let target = node
    let parent, direction, child
    while (target.data !== value) {
      parent = target
      direction = value < target.data ? 'left' : 'right'
      child = direction + 'Child'
      target = target[child]
    }
    if (target.leftChild === null && target.rightChild === null) {
      parent[child] = null
    } else if (target.leftChild !== null && target.rightChild !== null) {
      const replacementValue = this.valuesInOrder(target.rightChild).at(0)
      let replacementNode = target.rightChild
      while (replacementNode.data !== replacementValue) {
        replacementNode = replacementValue < replacementNode.data
          ? replacementNode.leftChild
          : replacementNode.rightChild
      }
      [target.data, replacementNode.data] = [replacementNode.data, target.data]
      this.deleteItem(value, target.rightChild)
    } else {
      const kid = target.leftChild === null ? target.rightChild : target.leftChild
      parent[child] = kid
    }
  }

  depth (value) {
    if (!this.includes(value)) return
    let level = 0
    let node = this.root
    while (node.data !== value) {
      node = value < node.data ? node.leftChild : node.rightChild
      level++
    }
    return level
  }

  forEachInOrder (callback, node = this.root) {
    if (typeof callback !== 'function') {
      throw new Error('Missing callback function.')
    }
    if (node === null) return
    this.forEachInOrder(callback, node.leftChild)
    callback(node.data)
    this.forEachInOrder(callback, node.rightChild)
  }

  forEachLevelOrder (callback) {
    if (typeof callback !== 'function') {
      throw new Error('Missing callback function.')
    }
    const nodes = [this.root]
    while (nodes.length > 0) {
      if (nodes[0].leftChild !== null) nodes.push(nodes[0].leftChild)
      if (nodes[0].rightChild !== null) nodes.push(nodes[0].rightChild)
      callback(nodes.shift().data)
    }
  }

  forEachPostOrder (callback, node = this.root) {
    if (typeof callback !== 'function') {
      throw new Error('Missing callback function.')
    }
    if (node === null) return
    this.forEachInOrder(callback, node.leftChild)
    this.forEachInOrder(callback, node.rightChild)
    callback(node.data)
  }

  forEachPreOrder (callback, node = this.root) {
    if (typeof callback !== 'function') {
      throw new Error('Missing callback function.')
    }
    if (node === null) return
    callback(node.data)
    this.forEachInOrder(callback, node.leftChild)
    this.forEachInOrder(callback, node.rightChild)
  }

  height (value) {
    if (!this.includes(value)) return
    let node = this.root
    while (node.data !== value) {
      node = value < node.data ? node.leftChild : node.rightChild
    }
    const farLeaf = this.valuesLevelOrder(node).at(-1)
    let height = 0
    while (node.data !== farLeaf) {
      node = farLeaf < node.data ? node.leftChild : node.rightChild
      height++
    }
    return height
  }

  includes (value, start = this.root) {
    let extant = false
    let node = start
    while (node !== null) {
      if (value === node.data) {
        extant = true
        return extant
      } else node = value < node.data ? node.leftChild : node.rightChild
    }
    return extant
  }

  insert (value) {
    if (this.includes(value)) return
    let child, current, direction, next
    while (next !== null) {
      current = current === undefined ? this.root : next
      direction = value < current.data ? 'left' : 'right'
      child = direction + 'Child'
      next = current[child]
    }
    current[child] = new Node(value)
  }

  isBalanced () {
    let balanced = true
    const values = this.valuesLevelOrder()
    values.forEach((value) => {
      let node = this.root
      while (node.data !== value) {
        node = value < node.data ? node.leftChild : node.rightChild
      }
      const heightL = node.leftChild === null
        ? -1
        : this.height(node.leftChild.data)
      const heightR = node.rightChild === null
        ? -1
        : this.height(node.rightChild.data)
      if (Math.abs(heightL - heightR) > 1) balanced = false
    })
    return balanced
  }

  prettyPrint (node, prefix = '', isLeft = true) {
    if (node === null || node === undefined) return
    this.prettyPrint(
      node.rightChild
      , `${prefix}${isLeft ? '│   ' : '    '}`
      , false
    )
    console.log(`${prefix}${isLeft ? '└── ' : '┌── '}${node.data}`)
    this.prettyPrint(
      node.leftChild
      , `${prefix}${isLeft ? '    ' : '│   '}`
      , true
    )
  }

  rebalance () {
    const values = this.valuesInOrder()
    this.root = this.#buildTree(values)
  }

  valuesInOrder (node = this.root, arr = []) {
    if (node === null) return arr
    this.valuesInOrder(node.leftChild, arr)
    arr.push(node.data)
    this.valuesInOrder(node.rightChild, arr)
    return arr
  }
  
  valuesLevelOrder (start = this.root) {
    const nodes = [start]
    const values = []
    while (nodes.length > 0) {
      if (nodes[0].leftChild !== null) nodes.push(nodes[0].leftChild)
      if (nodes[0].rightChild !== null) nodes.push(nodes[0].rightChild)
      values.push(nodes.shift().data)
    }
    return values
  }

  valuesPostOrder (node = this.root, arr = []) {
    if (node === null) return arr
    this.valuesPostOrder(node.leftChild, arr)
    this.valuesPostOrder(node.rightChild, arr)
    arr.push(node.data)
    return arr
  }

  valuesPreOrder (node = this.root, arr = []) {
    if (node === null) return arr
    arr.push(node.data)
    this.valuesPreOrder(node.leftChild, arr)
    this.valuesPreOrder(node.rightChild, arr)
    return arr
  }
}

export { Tree }