# 面包屑路由组件

由于页面菜单栏层次较深，为方便用户快速定位点击父级，祖父级页面菜单而设置面包屑导航组件

## 目录

- **[介绍](#介绍)**
- **[文档 API](#文档API)**
- **[Demo](#Demo)**
- **[TODO](#TODO)**
- **[License](#license)**

## 介绍

- 通过树对象和当前路由属性获取正确的链路显示在面包屑组件上
- 通过占位符的方式和 强绑定 vuex 的方式 实现面包屑的灵活配置

## 占位符示例

- 修改 title 为 'breadcrumb_hodlderTxt_0'
- breadcrumb*hodlderTxt* 为占位符标识（不可变），0 代表面包屑第一个位置，可改成其他

```javascript
// config.js
export default {
  id: 1,
  parentId: 0,
  name: 'ProjectManagement',
  path: '/project/list',
  disabled: true,
  title: 'breadcrumb_hodlderTxt_0',
  children: []
}
// index.vue
import config from 'config'
import Tree from 'tree'
export default {
  data(){
    return {treeData: new Tree(config)}
  }
}
```

- 通过 setBreadcrumbPlaceholders 修改占位符的位置文本



## 文档 API

- setBreadcrumbPlaceholders(array) 设置占位符位置文本
  其中 array 数据格式 为 [{index: 0 //占位符位置, replaceTxt: '构建发布' //占位符文本}](或者直接提交 vuex mutation 中的 setBreadcrumbPlaces，参数与上面一致)

- 传入 data 对象结构应为以下结构

| key          | 类型    | 说明                 | 必须  | 备注                                                                               |
| ------------ | ------- | -------------------- | ----- | ---------------------------------------------------------------------------------- |
| id           | Number  | 节点 id              | true  |                                                                                    |
| parentId     | Number  | 父节点 id            | true  | 根节点为 null                                                                      |
| name         | String  | 路由名称             | false |                                                                                    |
| path         | String  | 路由路径             | false | 当没有 path 时 redictPath 必填                                                     |
| redirectName | String  | 重定向路由名称       | false | 重定向名称须和 children 中其中一个 name 相等                                       |
| redirectPath | String  | 重定向路由路径       | false | 当没有填 path 字段时，该字段必填，且重定向路径应为 children 中的其中一个 path 相等 |
| disabled     | Boolean | 是否不可点击         | false | 默认 false                                                                         |
| hide         | Boolean | 面包屑路径是否不显示 | false | 默认 false                                                                         |
| children     | Array   | 该节点的子节点       | false | 数组里每个元素都应包含表格中的字段                                                 |



## Demo

```javascript
// config.js
export default {
  id: 1,
  parentId: 0,
  name: 'ProjectManagement',
  path: '/project/list',
  disabled: true,
  title: '工程管理',
  children: [
    {
      id: 101,
      parentId: 1,
      redictName: 'AppCreateList',
      redictPath: '/project/dev-platform/detail/app',
      title: '开发平台',
      children: [
        {
          id: 10102,
          parentId: 101,
          redictName: 'module-list',
          redictPath: '/project/dev-platform/module-list',
          title: '元编程引擎',
          children: [
            {
              id: 1010101,
              parentId: 10102,
              name: 'module-list',
              path: '/project/dev-platform/module-list',
              title: '元数据管理'
            },
            {
              id: 1010102,
              parentId: 10102,
              name: 'data-source-list',
              path: '/project/dev-platform/data-source-list',
              title: '数据源管理'
            }
          ]
        }
      ]
    }
  ]
}
// index.vue
import config from 'config'
import Tree from 'tree'
export default {
  data(){
    return {treeData: new Tree(config)}
  }
}
```



## TODO

- 设置传入 url 通过后端返回数据树生成 treeData
- 设置自定义使用 path 还是 name 控制路由跳转
- 支持传入本地数据
- 更多其他需要优化的功能点



## License

[MIT](./LICENSE)


