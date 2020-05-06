/**
 * 将menuList处理成 path: [menuItem] 的形式
 *
 * @param {Array} 菜单数组
 * @param {Array} 父级的数据
 * @param {Boolean} 是否清空父级数据
 *
 * @return {Object} path: [menuItem]
 */
export function formatData(array, parentData = [], clean = true) {
  let result = {}

  array.forEach(item => {
    let current = {name: item.name, url: item.url}

    item.url && (result[item.url] = [...parentData, current])

    if (item.children) {
      result = Object.assign(
        {},
        result,
        formatData(item.children, [...parentData, current], false)
      )
    }

    clean && (parentData = [])
  })

  return result
}
