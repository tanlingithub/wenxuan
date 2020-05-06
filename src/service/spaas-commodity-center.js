/*
 * 商品中心接口请求列表
 * @author barret
 * @date 2018
 */
import axios from '@/http'
const apiVersion = '/api/v1'
const serviceType = '/spaas-commodity-center'
const basicUrl = `${serviceType}${apiVersion}`

/**
 * 属性管理 - 添加属性
 * @param {*} param0
 */
export const postCommodityPropertys = ({
  propertyName,
  parentId,
  inputType, //是否必填，0是1否
  inputValues // value1,value2
}) => {
  const url = `${basicUrl}/commodity/properties`
  const params = {
    propertyName,
    parentId,
    inputType,
    inputValues
  }
  return axios.$post(url, params)
}

export const putCommodityPropertys = ({
  id,
  propertyName,
  parentId,
  inputType, //是否必填，0是1否
  inputValues // value1,value2
}) => {
  const url = `${basicUrl}/commodity/properties/${id}`
  const params = {
    propertyName,
    parentId,
    inputType,
    inputValues
  }
  return axios.$put(url, params)
}

/**
 * 属性管理 - 删除属性
 * @param id 属性ID
 */
export const deleteCommodityPropertys = ({id}) => {
  const url = `${basicUrl}/commodity/properties/${id}`
  return axios.$delete(url)
}
/**
 * 属性管理 - 查询属性树
 */
export const getPropertiesTree = () => {
  const url = `${basicUrl}/commodity/properties/trees`
  return axios.$get(url)
}

/**
 * 根据id查询属性
 * @param {id} 属性ID
 */
export const getCommodityPropertysDetail = ({id}) => {
  const url = `${basicUrl}/commodity/properties/${id}`
  return axios.$get(url)
}

/**
 * 根据id查询属性组（ 带属性值）
 * @param {id} 属性组ID
 */
export const getGroupsPropertyDetail = ({id}) => {
  const url = `${basicUrl}/commodity/property/groups/properties/${id}`
  return axios.$get(url)
}
/**
 * 选择属性列表
 * @param {id} param0
 */
export const getCommodityPropertyParents = ({id = ''}) => {
  const url = `${basicUrl}/commodity/properties/parents`
  return axios.$get(url, {
    params: {id}
  })
}

/**
 * 查询属性组列表（ 不带属性列表）
 * @param categoryId 类目ID
 */
export const getPropertyGroups = ({page = -1, size = 999, categoryId}) => {
  const url = `${basicUrl}/commodity/property/groups`
  return axios.$get(url, {
    params: {
      page,
      size,
      categoryId
    }
  })
}

/**
 * 新增属性组
 * @param {*} name
 */
export const postPropertyGroups = ({name, categoryId}) => {
  const url = `${basicUrl}/commodity/property/groups`
  const params = {
    name,
    categoryId
  }
  return axios.$post(url, params)
}

/**
 * 删除属性组
 * @param {} param0
 */
export const deletePropertyGroups = ({id, categoryId}) => {
  const url = `${basicUrl}/commodity/property/groups/${id}`
  return axios.$delete(url, {
    categoryId
  })
}

/**
 * 修改属性组
 * @param id,
 * @param categoryId,
 * @param name
 */
export const putPropertyGroups = ({id, categoryId, name}) => {
  const url = `${basicUrl}/commodity/property/groups/${id}`
  return axios.$put(url, {
    name,
    categoryId
  })
}

// 展示类目
/**
 * 根据类目Id获取关联属性(后台类目)
 * @param {*} id 类目ID
 */
export const getAssociatedPropertyById = ({id}) => {
  const url = `${basicUrl}/commodity/backCategorys/${id}/propertys`
  return axios.$get(url)
}

/**
 * 后台类目管理-根据类目Id批量保存关联属性
 * @param {*} id 类目ID
 * @param {*} arr 属性列表
 * @apiUrl http://39.98.50.163:3000/project/985/interface/api/11825
 */
export const postPropertyBatch = (id, arr) => {
  const url = `${basicUrl}/commodity/backCategorys/${id}/propertys/batch`
  return axios.$post(url, arr)
}

/**
 * 前台类目管理-根据类目Id批量保存关联属性
 * @param {*} id 类目ID
 * @param {*} arr 属性列表
 * @apiUrl http://39.98.50.163:3000/project/985/interface/api/11825
 */
export const postFrontPropertyBatch = (id, arr) => {
  const url = `${basicUrl}/commodity/frontCategorys/${id}/propertys/batch`
  return axios.$post(url, arr)
}

/**
 * 根据类目Id批量修改属性关系
 * @param {*} id 类目ID
 * @param {*} propertyId 属性ID
 * @param {*} param 传递的数据
 */
export const changePropertyBatch = (id, propertyId, param) => {
  const url = `${basicUrl}/commodity/backCategorys/${id}/propertys/${propertyId}/batch`
  return axios.$put(url, param)
}

/**
 * 后台类目-根据类目id删除属性关系
 * @param {*} id
 * @param {*} propertyId
 */
export const deletePropertyBatch = (
  categoryId,
  propertyIds,
  propertyGroupsIds
) => {
  const url = `${basicUrl}/commodity/backCategorys/${categoryId}/propertys/${propertyIds}/propertyGroups/${propertyGroupsIds}`
  return axios.$delete(url)
}

/**
 * 前台类目-根据类目id删除属性关系
 * @param {*} id
 * @param {*} propertyId
 */
export const deleteFrontPropertyBatch = (id, propertyId) => {
  const url = `${basicUrl}/commodity/frontCategorys/${id}/propertys/${propertyId}`
  return axios.$delete(url)
}

/**
 * @description: 查询展示类目 --前台
 */
export const frontCategorys_List = `${serviceType}${apiVersion}/commodity/frontCategorys`

/**
 * @description: 类目列表获取
 */
export const getFrontCategorysList = () =>
  axios.get(`${serviceType}${apiVersion}/commodity/frontCategorys/tree`)

/**
 * @description: 类目列表修改
 * @param {id} 类目id
 * @param {CategoryForm}  修改内容
 */
export const putFrontCategorys = ({id, CategoryForm}) =>
  axios.put(`${frontCategorys_List}/${id}`, CategoryForm)

/**
 * @description: 类目列表新增
 * @param {CategoryForm}  修改内容
 */
export const postFrontCategorysList = ({CategoryForm}) =>
  axios.post(`${frontCategorys_List}`, CategoryForm)

/**
 * @description: 类目列表删除
 * @param {id}  类目id
 */
export const delFrontCategorysList = ({id}) =>
  axios.delete(`${frontCategorys_List}/${id}`)

/**
 * @description: 设置类目是否启动
 * @param {id}  类目id
 */
export const switchFrontCategorysList = ({id, enabled}) =>
  axios.put(`${frontCategorys_List}/${id}/enabled/${enabled}`)

/**
 * @description: 批量更新类目
 * @param {catagoryList} 类目List
 */
export const putFrontCategorysList = ({catagoryList}) =>
  axios.put(`${frontCategorys_List}/batch`, catagoryList)

/**
 * @description: 查询基础类目类目列表 --后台
 */
export const afterCategorys_List = `${serviceType}${apiVersion}/commodity/backCategorys`

/**
 * @description: 类目列表获取
 */
export const getAfterCategorysList = () =>
  axios.get(`${afterCategorys_List}/tree`)

/**
 * @description: 类目列表修改
 * @param {id} 类目id
 * @param {CategoryForm}  修改内容
 */
export const putAfterCategorys = ({id, CategoryForm}) =>
  axios.put(`${afterCategorys_List}/${id}`, CategoryForm)

/**
 * @description: 类目列表新增
 * @param {CategoryForm}  修改内容
 */
export const postAfterCategorysList = ({CategoryForm}) =>
  axios.post(`${afterCategorys_List}`, CategoryForm)

/**
 * @description: 类目列表删除
 * @param {id}  类目id
 */
export const delAfterCategorysList = ({id}) =>
  axios.delete(`${afterCategorys_List}/${id}`)

/**
 * @description: 设置类目是否启动
 * @param {id}  类目id
 */
export const switchAfterCategorysList = ({id, enabled}) =>
  axios.put(`${afterCategorys_List}/${id}/enabled/${enabled}`)

/**
 * @description: 批量更新类目
 * @param {catagoryList} 类目List
 */
export const putAfterCategorysList = ({catagoryList}) =>
  axios.put(`${afterCategorys_List}/batch`, catagoryList)

/**
 * @description: 分页查询品牌列表
 */
export const BRAND_LIST = `${serviceType}${apiVersion}/commodity/brands`

/**
 * @description:  品牌管理修改
 * @param {getId} 品牌id
 * @param {formvalue}品牌信息
 */
export const putBrandManagement = ({id, formvalue}) =>
  axios.put(`${BRAND_LIST}/${id}`, formvalue)

/**
 * @description:  品牌管理新增
 * @param {formvalue}品牌信息
 */
export const postBrandManagement = ({formvalue}) =>
  axios.post(`${BRAND_LIST}`, formvalue)

/**
 * @description:  品牌管理获取
 * @param { id} 品牌信息
 */
export const getBrandManagement = ({id}) => axios.get(`${BRAND_LIST}/${id}`)

/**
 * @description:  品牌管理删除
 * @param {id} 品牌信息
 */
export const delBrandManagement = ({id}) => axios.delete(`${BRAND_LIST}/${id}`)

/**
 * @description: 查询类目管理类目
 */
export const getBrandManagementCategory = ({id}) =>
  axios.get(`${frontCategorys_List}/${id}/back?relation=false`)
/**
 * @description: 删除类目关联类目
 * @param {categoryId} 类目Id
 * @param {id} 关联类目Id
 */
export const delBrandManagementCategory = ({categoryId, id}) =>
  axios.delete(`${frontCategorys_List}/${categoryId}/back/${id}`)

/**
 * @description: 展示类目批量添加类目
 * @param {categoryId} 类目Id
 * @param {categoryList} 类目Id
 */
export const postBrandManagementCategory = ({categoryId, categoryList}) =>
  axios.post(`${frontCategorys_List}/${categoryId}/back/batch`, categoryList)

/**
 * @description: 分页查询类目下关联品牌列表
 */
export const categoryBrandList = `${serviceType}${apiVersion}/commodity`

/**
 * @description: 根据类目ID删除关联品牌(后台类目)
 * @param {id} 类目id
 * @param {brandId} 品牌id
 */
export const delCategoryBrandList = ({id}) =>
  axios.delete(`${categoryBrandList}/backCategorys/brands/${id}`)

/**
 * @description: 根据类目ID删除关联品牌(前台类目)
 * @param {id} 类目id
 * @param {brandId} 品牌id
 */
export const delFrontCategoryBrandList = ({id}) =>
  axios.delete(`${categoryBrandList}/frontCategorys/brands/${id}`)

/**
 * @description: 批量添加关联品牌(后台类目)
 * @param {id} 类目id
 * @param {formValue} 关联内容
 */
export const putCategoryBrandList = ({id, formValue}) =>
  axios.put(
    `${categoryBrandList}/backCategorys/vocational/brands/batch`,
    formValue
  )

/**
 * @description: 批量添加关联品牌（前台类目）
 * @param {id} 类目id
 * @param {formValue} 关联内容
 */
export const putFrontCategoryBrandList = ({id, formValue}) =>
  axios.put(
    `${categoryBrandList}/frontCategorys/vocational/brands/batch`,
    formValue
  )

/**
 * @description: 根据类目ID添加关联品牌(后台类目)
 * @param {id} 类目id
 * @param {formValue} 关联内容
 */
export const putCategoryBrandStatus = ({id, formValue}) =>
  axios.put(`${categoryBrandList}/backCategorys/brands/${id}`, formValue)

/**
 * @description: 根据类目ID添加关联品牌(前台类目)
 * @param {id} 类目id
 * @param {formValue} 关联内容
 */
export const putFrontCategoryBrandStatus = ({id, formValue}) =>
  axios.put(`${categoryBrandList}/frontCategorys/brands/${id}`, formValue)

/**
 * @description: 商品列表
 * @param {type}
 */
export const CommodityList = `${serviceType}${apiVersion}/commodity`

/**
 * @description: 商品列表批量上架
 * @param {id} 商品id
 * @param {commodityStatus}  修改内容
 */
export const putCommodityList = ({id, commodityStatus}) =>
  axios.put(`${CommodityList}/${id}/status`, commodityStatus)

/**
 * @description: 商品列表批量删除
 * @param {id} 商品id
 */
export const deleteCommodityList = ({id}) =>
  axios.delete(`${CommodityList}/${id}`)
/**
 * 新增商品
 * @param {*} params
 */
export const postCommodityGoods = params =>
  axios.post(`${basicUrl}/commodity`, params)

/**
 * 修改商品
 * @param {*} params
 */
export const putCommodityGoods = (id, params) => {
  const deleteGoodsAttachmentIds =
    params && params.deleteGoodsAttachmentIds
      ? params.deleteGoodsAttachmentIds
      : ''
  const queryParams = deleteGoodsAttachmentIds
    ? `?deleteGoodsAttachmentIds=${deleteGoodsAttachmentIds}`
    : ''
  delete params.deleteGoodsAttachmentIds
  return axios.put(`${basicUrl}/commodity/${id}${queryParams}`, params)
}

/**
 * 获取商品详情
 * @param {*} params
 */
export const getCommodityGoods = ({id}) =>
  axios.get(`${basicUrl}/commodity/${id}`)

/**
 * 获取已关联属性
 * @param {id}
 */
export const getCategoryProperty = ({id}, params) =>
  axios.get(`${basicUrl}/commodity/backCategorys/${id}/propertys`, {params})

/**
 * 校验是否存在关联关系， 存在则不删除， 不存在直接删除
 * @param {String} ids
 */
export const existRelationOrDelete = ids =>
  axios.delete(
    `${basicUrl}/commodity/business/properties/existRelationOrDelete/${ids}`
  )

/**
 * 全部删除属性
 * @param {String} ids
 */
export const deleteProperties = ids =>
  axios.delete(`${basicUrl}/commodity/business/properties/${ids}`)

/**
 * 查询根据名称类目分页或者不分页（后台类目）
 * @param {Object} params
 */
export const getBackCategorys = params => {
  // 当name为空的时候，parentId需要为0；当name不为空的时候，不能传parentId
  const {name, parentId} = params
  if (name) {
    delete params.parentId
  } else {
    params.parentId = parentId || 0
    delete params.name
  }
  return axios
    .get(`${basicUrl}/commodity/backCategorys`, {params})
    .then(res => res.data)
}

/**
 * 查询根据名称类目分页或者不分页（后台类目）
 * @param {Object} params
 */
export const getFrontCategorys = params => {
  // 当name为空的时候，parentId需要为0；当name不为空的时候，不能传parentId
  const {name, parentId} = params
  if (name) {
    delete params.parentId
  } else {
    params.parentId = parentId || 0
    delete params.name
  }
  return axios
    .get(`${basicUrl}/commodity/frontCategorys`, {params})
    .then(res => res.data)
}

/**
 * 根据类目id查询类目树，向上查询(后台类目)
 * @param {Object} params
 */
export const getBackCategorysTreeGeneral = params =>
  axios
    .get(`${basicUrl}/commodity/backCategorys/treeGeneral`, {
      params
    })
    .then(res => res.data)

/**
 * 根据类目id查询类目树，向上查询（前台类目）
 * @param {Object} params
 */
export const getFrontCategorysTreeGeneral = params =>
  axios
    .get(`${basicUrl}/commodity/backCategorys/treeGeneral`, {
      params
    })
    .then(res => res.data)
/**
 * 请求类目节点详情(后台类目)
 * @param {String, Number} id
 */
export const getBackCategorysDetail = id =>
  axios.get(`${basicUrl}/commodity/backCategorys/${id}`).then(res => res.data)

/**
 * 请求类目节点详情(前台类目)
 * @param {String, Number} id
 */
export const getFrontCategorysDetail = id =>
  axios.get(`${basicUrl}/commodity/frontCategorys/${id}`).then(res => res.data)

/**
 * 更改类目详情(后台类目)
 * @param {String, Number} id
 */
export const putBackCategorysDetail = ({id, ...params}) =>
  axios
    .put(`${basicUrl}/commodity/backCategorys/${id}`, params)
    .then(res => res.data)

/**
 * 更改类目详情(前台类目)
 * @param {String, Number} id
 */
export const putFrontCategorysDetail = ({id, ...params}) =>
  axios
    .put(`${basicUrl}/commodity/frontCategorys/${id}`, params)
    .then(res => res.data)
