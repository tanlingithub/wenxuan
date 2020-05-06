/**
 * 关于树的操作
 */
class TreeDate {
  constructor(data) {
    if (!data) return
    this.treeArray = this.treeToArray(data)
    this.treeMap = new Map([
      ...this.treeArray.map(item => {
        return [item.id, item]
      })
    ])
  }

  /**
   * 将树结构扁平成一维数组
   * @param {*} data
   * @param {*} children
   */
  treeToArray(
    data,
    {parentId = null, level = 0, path = '', children = 'children'} = {}
  ) {
    let tmp = []
    data.forEach((item, index) => {
      const _path = path ? `${path}-${item.id}` : item.id
      const newItem = {
        ...item,
        _id: item.id,
        _parentId: parentId,
        _path,
        _level: level
      }
      tmp.push(newItem)
      if (newItem[children] && newItem[children].length > 0) {
        const res = this.treeToArray(newItem[children], {
          parentId: item.id,
          path: _path,
          level: level + 1,
          children
        })
        tmp = tmp.concat(res)
      }
    })
    return tmp
  }
  /**
   * 根据节点ID查找node节点
   * @param {} nodeId
   */
  getNodeByNodeId(nodeId) {
    return this.treeMap.get(nodeId)
  }
  /**
   * 根据节点ID数组查找node节点列表
   * @param {*} nodesId
   */
  getNodesByNodesId(nodesId) {
    return nodesId.map(id => this.getNodeByNodeId(id))
  }
  /**
   * 根据节点ID数组查找树结构
   * @param {*} nodesId
   */
  getTreeByNodesId(nodesId) {
    const nodesList = this.getNodesByNodesId(nodesId)
    const pathList = nodesList.map(info => info._path)
    return this.getTreeByPathsId(pathList)
  }
  /**
   * 根据节点path查找树结构
   * @param {*} pathsId
   */
  getTreeByPathsId(pathsId) {
    const topPaths = this.filterChildPath(pathsId)
    let wholeNodes = []
    topPaths.forEach(path => {
      const nodesId = path.split('-')
      nodesId.forEach((nodeId, index) => {
        const node = this.getNodeByNodeId(nodeId)
        if (!node) return
        if (nodesId.length === index + 1) {
          wholeNodes.push(node)
        } else {
          wholeNodes.push({
            ...node,
            children: []
          })
        }
      })
    })
    return this.arrayToTree(wholeNodes)
  }
  /**
   * 过滤子路径
   * @param {} paths
   */
  filterChildPath(paths) {
    // 获取最顶级的node节点，并且去重
    // 两两比较code
    // 如果code开始值相同，则比较长度，长度较大的值置为null
    // 去除null值
    for (let i = 0; i < paths.length - 1; i++) {
      for (let j = i + 1; j < paths.length; j++) {
        const beforeItem = paths[i]
        const nextItem = paths[j]
        // 两两比较code
        if (
          beforeItem.indexOf(nextItem) === 0 ||
          nextItem.indexOf(beforeItem) === 0
        ) {
          if (beforeItem.split('-').length > nextItem.split('-').length) {
            paths[i] = null
          } else {
            paths[j] = null
          }
        }
      }
    }
    // 去除空的null值
    return paths.filter(item => item)
  }

  // 将平级的数组格式转化为tree格式
  arrayToTree(treeArray, {id = 'id', parentId = 'parentId'} = {}) {
    let treeList = []
    const tmpMap = new Map([
      ...treeArray.map(item => {
        return [item[id], item]
      })
    ])
    for (let i = 0; i < treeArray.length; i++) {
      let key = tmpMap.get(treeArray[i][parentId])

      //循环每一条数据的pid，假如这个临时对象有这个key值，就代表这个key对应的数据有children，需要Push进去
      if (key) {
        if (!key['children']) {
          key['children'] = []
          key['children'].push(treeArray[i])
        } else {
          key['children'].push(treeArray[i])
        }
      } else {
        //如果没有这个Key值，那就代表没有父级,直接放在最外层
        treeList.push(treeArray[i])
      }
    }
    return treeList
  }
}

export default TreeDate
