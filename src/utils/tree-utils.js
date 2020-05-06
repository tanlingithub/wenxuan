/**
 * 封装树结构数组
 * @author barret
 * @date 2019/05/20
 */
import _clonedeep from 'lodash.clonedeep'

export const treeToArray = (
  data,
  {parentId = null, level = 0, path = '', children = 'children'} = {},
  noChildren
) => {
  let tmp = []
  data.forEach((item, index) => {
    const _path = path ? `${path}-${item.id}` : item.id
    const newItem = {
      ...item,
      _id: item.id,
      parentId,
      _path,
      _level: level
    }
    tmp.push({
      ...newItem,
      children: noChildren ? [] : item.children
    })
    if (newItem[children] && newItem[children].length > 0) {
      const res = treeToArray(
        newItem[children],
        {
          parentId: item.id,
          path: _path,
          level: level + 1,
          children
        },
        noChildren
      )
      tmp = tmp.concat(res)
    }
  })
  return tmp
}

// 将平级的数组格式转化为tree格式
export const arrayToTree = (
  treeArray,
  {id = 'id', parentId = 'parentId', children = 'children'} = {}
) => {
  const cloneTreeArray = _clonedeep(treeArray)
  let treeList = []
  const tmpMap = new Map([
    ...cloneTreeArray.map(item => {
      return [item[id], item]
    })
  ])
  for (let i = 0; i < cloneTreeArray.length; i++) {
    let key = tmpMap.get(cloneTreeArray[i][parentId])
    //循环每一条数据的pid，假如这个临时对象有这个key值，就代表这个key对应的数据有children，需要Push进去
    if (key) {
      if (!key[children]) {
        key[children] = []
        key[children].push(cloneTreeArray[i])
      } else {
        key[children].push(cloneTreeArray[i])
      }
    } else {
      //如果没有这个Key值，那就代表没有父级,直接放在最外层
      treeList.push(cloneTreeArray[i])
    }
  }
  return treeList
}
