import {ROUTE_INFO} from '@/const/route-info'

export default {
  id: 0,
  parentId: null,
  name: 'root',
  path: '/',
  disabled: true, // 禁止点击
  hide: true, // 是否需要隐藏该路径，不需要在面包屑中显示
  title: '商品中心',
  children: [...ROUTE_INFO]
}
