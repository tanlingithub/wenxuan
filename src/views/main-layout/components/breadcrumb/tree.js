class Node {
  constructor(data) {
    Object.keys(data).forEach(key => {
      this[key] = data[key]
    })
    this.disabled = data.disabled || false
    this.parentNode = null
    this.children = []
  }
}

export default class Tree {
  constructor(treeData) {
    this.insertNode(treeData, null)
  }
  // 插入node字节数据
  insertNode(nodeData, parentNode) {
    const currentNode = new Node(nodeData)
    currentNode.parentNode = parentNode
    const childrenDatas = nodeData.children
    if (parentNode === null) {
      this.root = currentNode
    } else {
      parentNode.children.push(currentNode)
    }
    if (childrenDatas && childrenDatas.length > 0) {
      childrenDatas.forEach(childData => {
        this.insertNode(childData, currentNode)
      })
    }
  }
  // 设置node节点数据
  setNodeData(node, data) {
    Object.keys(data).forEach(key => {
      node[key] = data[key]
      if (key === 'id') {
        node.children.forEach(child => {
          child.parentId = data[key]
        })
      }
    })
  }
  // 删除node节点
  deleteNode(node) {
    if (!node.parentNode) {
      this.root = null
    }
    const parentNode = node.parentNode
    parentNode.children = parentNode.children.filter(child => child !== node)
  }
  // 查找node节点
  findNodeByType(value, type = 'name', currentNode) {
    currentNode = currentNode ? currentNode : this.root
    let childrenNodes = currentNode.children
    if (currentNode[type] === value) {
      return currentNode
    } else if (childrenNodes.length > 0) {
      for (let i = 0; i < childrenNodes.length; i++) {
        const childNode = childrenNodes[i]
        const findResult = this.findNodeByType(value, type, childNode)
        if (findResult) {
          return findResult
        }
      }
      if (currentNode === this.root) {
        return false
      }
    } else {
      return false
    }
  }
  getFullChainByType(value, type = 'name') {
    let currentNode = this.findNodeByType(value, type)
    if (!currentNode) {
      return false
    }
    let chainArr = []
    while (currentNode) {
      chainArr.unshift(currentNode)
      currentNode = currentNode.parentNode
    }
    return chainArr
  }
  setDisabledNode(disabled, value, type = 'name') {
    const disabledNode = this.findNodeByType(value, type)
    disabledNode.disabled = disabled
  }
}
