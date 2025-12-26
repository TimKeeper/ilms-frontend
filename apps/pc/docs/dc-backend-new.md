---
title: dc-backend-api
language_tabs:
  - shell: Shell
  - http: HTTP
  - javascript: JavaScript
  - ruby: Ruby
  - python: Python
  - php: PHP
  - java: Java
  - go: Go
toc_footers: []
includes: []
search: true
code_clipboard: true
highlight_theme: darkula
headingLevel: 2
generator: '@tarslib/widdershins v4.0.30'
---

# dc-backend-api

Base URLs:

# Authentication

# iam

## POST 登录

POST /api/iam/v1/login

> Body 请求参数

```json
{
  "username": "string",
  "password": "string"
}
```

### 请求参数

| 名称       | 位置 | 类型   | 必选 | 中文名 | 说明                  |
| ---------- | ---- | ------ | ---- | ------ | --------------------- |
| body       | body | object | 否   |        | none                  |
| » username | body | string | 是   | 用户名 | none                  |
| » password | body | string | 是   | 密码   | MD5加密（默认123456） |

> 返回示例

```json
{
  "status": 0,
  "resMsg": "成功",
  "data": {
    "id": 1,
    "username": "admin",
    "showName": "管理员",
    "token": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ7XCJpZFwiOjEsXCJzaG93TmFtZVwiOlwi566h55CG5ZGYXCIsXCJ1c2VybmFtZVwiOlwiYWRtaW5cIn0iLCJpYXQiOjE3NjU1NTMzMjcsImV4cCI6MTc2NTYzOTcyN30.sYgfOMCoByUpv1kMfaC3Pj1gwOrvQpzlW1YtJ01GulMcPJ19I-_T39GCt5lSZ3dDKJnslE4cJorV_VfCmUYc9Q",
    "tokenExpiration": 1765639727011
  }
}
```

```json
{
  "status": 9000008,
  "resMsg": "登陆失败：用户名或密码错误",
  "data": {}
}
```

```json
{
  "status": 9000009,
  "resMsg": "登陆失败：该用户已被禁用",
  "data": {}
}
```

```json
{
  "status": 9009999,
  "resMsg": "未知错误,{0}",
  "data": {}
}
```

### 返回结果

| 状态码 | 状态码含义 | 说明 | 数据模型 |
| --- | --- | --- | --- |
| 200 | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | none | Inline |

### 返回数据结构

状态码 **200**

| 名称               | 类型    | 必选  | 约束 | 中文名       | 说明       |
| ------------------ | ------- | ----- | ---- | ------------ | ---------- |
| » status           | integer | true  | none | 状态码       | 0-代表成功 |
| » resMsg           | string  | true  | none | 状态描述     | none       |
| » data             | object  | false | none | 登录用户信息 | none       |
| »» id              | integer | true  | none | 用户id       | none       |
| »» username        | string  | true  | none | 用户名       | none       |
| »» showName        | string  | true  | none | 展示名称     | none       |
| »» token           | string  | true  | none | 登录token    | none       |
| »» tokenExpiration | integer | true  | none | token有效期  | none       |

## PUT 修改密码

PUT /api/iam/v1/changePwd

> Body 请求参数

```json
{
  "oldPassword": "string",
  "newPassword": "string"
}
```

### 请求参数

| 名称          | 位置   | 类型   | 必选 | 中文名 | 说明              |
| ------------- | ------ | ------ | ---- | ------ | ----------------- |
| token         | header | string | 否   |        | 登录时给定的token |
| body          | body   | object | 否   |        | none              |
| » oldPassword | body   | string | 是   | 老密码 | MD5加密           |
| » newPassword | body   | string | 是   | 新密码 | MD5加密           |

> 返回示例

```json
{
  "status": 0,
  "resMsg": "成功",
  "data": {}
}
```

```json
{
  "status": 9000004,
  "resMsg": "查询异常，该用户ID不存在",
  "data": {}
}
```

```json
{
  "status": 9000005,
  "resMsg": "参数异常，旧密码错误",
  "data": {}
}
```

```json
{
  "status": 9009999,
  "resMsg": "未知错误,{0}",
  "data": {}
}
```

### 返回结果

| 状态码 | 状态码含义 | 说明 | 数据模型 |
| --- | --- | --- | --- |
| 200 | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | none | Inline |

### 返回数据结构

状态码 **200**

| 名称     | 类型    | 必选  | 约束 | 中文名   | 说明       |
| -------- | ------- | ----- | ---- | -------- | ---------- |
| » status | integer | true  | none | 状态码   | 0-代表成功 |
| » resMsg | string  | true  | none | 状态描述 | none       |
| » data   | object  | false | none |          | none       |

## GET 测试

GET /api/iam/v1/info

### 请求参数

| 名称  | 位置   | 类型   | 必选 | 中文名 | 说明 |
| ----- | ------ | ------ | ---- | ------ | ---- |
| token | header | string | 否   |        | none |

> 返回示例

```json
{
  "status": 0,
  "resMsg": "成功",
  "data": {
    "id": 1,
    "username": "admin",
    "showName": "管理员",
    "token": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ7XCJpZFwiOjEsXCJzaG93TmFtZVwiOlwi566h55CG5ZGYXCIsXCJ1c2VybmFtZVwiOlwiYWRtaW5cIn0iLCJpYXQiOjE3NjU1NTMzMjcsImV4cCI6MTc2NTYzOTcyN30.sYgfOMCoByUpv1kMfaC3Pj1gwOrvQpzlW1YtJ01GulMcPJ19I-_T39GCt5lSZ3dDKJnslE4cJorV_VfCmUYc9Q",
    "tokenExpiration": 1765639727011
  }
}
```

```json
{
  "status": 9000008,
  "resMsg": "登陆失败：用户名或密码错误",
  "data": {}
}
```

```json
{
  "status": 9000009,
  "resMsg": "登陆失败：该用户已被禁用",
  "data": {}
}
```

```json
{
  "status": 9009999,
  "resMsg": "未知错误,{0}",
  "data": {}
}
```

### 返回结果

| 状态码 | 状态码含义 | 说明 | 数据模型 |
| --- | --- | --- | --- |
| 200 | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | none | Inline |

### 返回数据结构

状态码 **200**

| 名称               | 类型    | 必选  | 约束 | 中文名       | 说明       |
| ------------------ | ------- | ----- | ---- | ------------ | ---------- |
| » status           | integer | true  | none | 状态码       | 0-代表成功 |
| » resMsg           | string  | true  | none | 状态描述     | none       |
| » data             | object  | false | none | 登录用户信息 | none       |
| »» id              | integer | true  | none | 用户id       | none       |
| »» username        | string  | true  | none | 用户名       | none       |
| »» showName        | string  | true  | none | 展示名称     | none       |
| »» token           | string  | true  | none | 登录token    | none       |
| »» tokenExpiration | integer | true  | none | token有效期  | none       |

# station-工位

## POST 维护工位工序图

POST /api/workstation/v1/graph

# 工位以网格的形式进行组图

如图： ![image.png](https://api.apifox.com/api/v1/projects/7475240/resources/604121/image-preview)

> 前端初始化默认画布时，可给定10（X）\* 10（Y）大小的画布用户可手动继续扩展

- workstationId：代表工序id，若传入，代表修改该工序，若不传入，代表新增该工序
- workstationName：代表工序名称
- workstationX：代表工序，用户拖动工位组件到坐标，取其X即可
- workstationY：代表工位在工序中的上下位置，用户拖动工位组件到坐标，取其Y即可
- workstationType：代表工位类型，0-起点工位 1-过程工位 2-终点工位
- workstationIndex：代表工位代号，工位代号需前端按图从左到右，从上到下依次编码

# 组图后进行路径规划

按照当前工位能到达的其他工位代号（workstationIndex）进行编排假设：

- 1能到达2，那么1的routerIndexs为[2]
- 2能到达1、3、4，那么2的routerIndexs为[1,3,4]
- 3能到达2、5，那么3的routerIndexs为[2,5]
- 4能到达2、6，那么4的routerIndexs为[2,6]
- 5能到达3、7，那么5的routerIndexs为[3,7]
- 6能到达4、7，那么6的routerIndexs为[4,7]
- 7能到达5、6、8，那么7的routerIndexs为[5,6,8]
- 8能到达7，那么8的routerIndexs为[7]

由此组成的图谱如下：

![image.png](https://api.apifox.com/api/v1/projects/7475240/resources/604122/image-preview)

> Body 请求参数

```json
{
  "graph": [
    {
      "workstationId": 1,
      "workstationIndex": 1,
      "workstationName": "工位1",
      "workstationType": 0,
      "workstationX": 1,
      "workstationY": 2,
      "routerIndexs": [2]
    },
    {
      "workstationIndex": 2,
      "workstationName": "工位2",
      "workstationType": 1,
      "workstationX": 2,
      "workstationY": 2,
      "routerIndexs": [1, 3, 4]
    },
    {
      "workstationIndex": 3,
      "workstationName": "工位3",
      "workstationType": 1,
      "workstationX": 3,
      "workstationY": 3,
      "routerIndexs": [2, 5]
    },
    {
      "workstationIndex": 4,
      "workstationName": "工位4",
      "workstationType": 1,
      "workstationX": 3,
      "workstationY": 1,
      "routerIndexs": [2, 5]
    },
    {
      "workstationIndex": 5,
      "workstationName": "工位5",
      "workstationType": 2,
      "workstationX": 4,
      "workstationY": 2,
      "routerIndexs": [3, 4]
    }
  ]
}
```

### 请求参数

| 名称 | 位置 | 类型 | 必选 | 中文名 | 说明 |
| --- | --- | --- | --- | --- | --- |
| token | header | string | 否 |  | none |
| body | body | object | 否 |  | none |
| » graph | body | [object] | 是 | 图谱对象数组 | none |
| »» workstationId | body | integer | 否 | 工位id | 若有则代表更新该工位信息，若无则代表新建该工位信息 |
| »» workstationIndex | body | integer | 是 | 工位代号 | 需前端编号传回，从左到右、从上到下依次编号 |
| »» workstationName | body | string | 是 | 工位名称 | none |
| »» workstationType | body | integer | 是 | 工位类型 | 0-起点工位 1-过程工位 2-终点工位 |
| »» workstationX | body | integer | 是 | 工位横坐标 | 代表工序 |
| »» workstationY | body | integer | 是 | 工位纵坐标 | 标定同工序下的上下顺序 |
| »» routerIndexs | body | [integer] | 否 | 工位路由表 | 代表这个工位连通哪些其他工位，值为工位代号数组 |

> 返回示例

```json
{
  "status": 0,
  "resMsg": "成功",
  "data": {}
}
```

```json
{
  "status": 9009999,
  "resMsg": "未知错误,{0}",
  "data": {}
}
```

```json
{
  "status": 4000001,
  "resMsg": "工位【工位1】，已被雷达【192.168.0.1】天线1,2绑定，请解除雷达天线绑定后再试",
  "data": {}
}
```

### 返回结果

| 状态码 | 状态码含义 | 说明 | 数据模型 |
| --- | --- | --- | --- |
| 200 | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | none | Inline |

### 返回数据结构

状态码 **200**

| 名称     | 类型    | 必选 | 约束 | 中文名   | 说明       |
| -------- | ------- | ---- | ---- | -------- | ---------- |
| » status | integer | true | none | 状态码   | 0-代表成功 |
| » resMsg | string  | true | none | 状态描述 | none       |
| » data   | object  | true | none |          | none       |

## GET 获取工位工序图

GET /api/workstation/v1/graph

### 请求参数

| 名称  | 位置   | 类型   | 必选 | 中文名 | 说明 |
| ----- | ------ | ------ | ---- | ------ | ---- |
| token | header | string | 否   |        | none |

> 返回示例

```json
{
  "status": 0,
  "resMsg": "成功",
  "data": {
    "graph": [
      {
        "workstationId": 1,
        "workstationIndex": 1,
        "workstationName": "工位1",
        "workstationType": 0,
        "workstationX": 1,
        "workstationY": 2,
        "routerIndexs": [2]
      },
      {
        "workstationIndex": 2,
        "workstationName": "工位2",
        "workstationType": 1,
        "workstationX": 2,
        "workstationY": 2,
        "routerIndexs": [1, 3, 4]
      },
      {
        "workstationIndex": 3,
        "workstationName": "工位3",
        "workstationType": 1,
        "workstationX": 3,
        "workstationY": 3,
        "routerIndexs": [2, 5]
      },
      {
        "workstationIndex": 4,
        "workstationName": "工位4",
        "workstationType": 1,
        "workstationX": 3,
        "workstationY": 1,
        "routerIndexs": [2, 5]
      },
      {
        "workstationIndex": 5,
        "workstationName": "工位5",
        "workstationType": 2,
        "workstationX": 4,
        "workstationY": 2,
        "routerIndexs": [3, 4]
      }
    ]
  }
}
```

```json
{
  "status": 9009999,
  "resMsg": "未知错误,{0}",
  "data": {}
}
```

### 返回结果

| 状态码 | 状态码含义 | 说明 | 数据模型 |
| --- | --- | --- | --- |
| 200 | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | none | Inline |

### 返回数据结构

状态码 **200**

| 名称 | 类型 | 必选 | 约束 | 中文名 | 说明 |
| --- | --- | --- | --- | --- | --- |
| » status | integer | true | none |  | none |
| » resMsg | string | true | none |  | none |
| » data | object | false | none |  | none |
| »» graph | [object] | true | none |  | none |
| »»» workstationId | integer | false | none | 工位id | none |
| »»» workstationIndex | integer | true | none | 工位代号 | none |
| »»» workstationName | string | true | none | 工位名称 | none |
| »»» workstationType | integer | true | none | 工位类型 | 0-起点工位 1-过程工位 2-终点工位 |
| »»» workstationX | integer | true | none | 工位横坐标 | 代表工序 |
| »»» workstationY | integer | true | none | 工位纵坐标 | 标定同工序下的上下顺序 |
| »»» routerIndexs | [integer] | false | none | 工位路由表 | 代表这个工位连通哪些其他工位，值为工位代号数组 |

## GET 获取工位工序流程配置

GET /api/station/v1/flow-config

### 请求参数

| 名称  | 位置   | 类型   | 必选 | 中文名 | 说明 |
| ----- | ------ | ------ | ---- | ------ | ---- |
| token | header | string | 否   |        | none |

> 返回示例

```json
{
  "status": 0,
  "resMsg": "成功",
  "data": {
    "processes": [
      {
        "id": 10,
        "label": "机加工序",
        "x": 50,
        "y": 80,
        "width": 320,
        "height": 240,
        "order": 1
      }
    ],
    "stations": [
      {
        "id": 16,
        "label": "工位 A-1",
        "processId": 10,
        "code": "1",
        "x": 80,
        "y": 130,
        "type": 0
      },
      {
        "id": 17,
        "label": "工位 A-2",
        "processId": 10,
        "code": "2",
        "x": 80,
        "y": 130,
        "type": 1
      }
    ],
    "links": [
      {
        "from": 16,
        "to": 17
      }
    ],
    "canvas": {
      "width": 1200,
      "height": 800,
      "center": {
        "x": 600,
        "y": 400
      }
    }
  }
}
```

```json
{
  "status": 9009999,
  "resMsg": "未知错误,{0}",
  "data": {}
}
```

### 返回结果

| 状态码 | 状态码含义 | 说明 | 数据模型 |
| --- | --- | --- | --- |
| 200 | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | none | Inline |

### 返回数据结构

状态码 **200**

| 名称 | 类型 | 必选 | 约束 | 中文名 | 说明 |
| --- | --- | --- | --- | --- | --- |
| » status | integer | true | none |  | none |
| » resMsg | string | true | none |  | none |
| » data | object | true | none |  | none |
| »» processes | [object] | true | none |  | none |
| »»» id | integer | true | none | 工序id | none |
| »»» label | string | true | none | 工序名称 | none |
| »»» x | integer | true | none |  | none |
| »»» y | integer | true | none |  | none |
| »»» width | integer | true | none |  | none |
| »»» height | integer | true | none |  | none |
| »»» order | integer | true | none | 工序顺序 | none |
| »»» color | string | false | none |  | none |
| »» stations | [object] | true | none |  | none |
| »»» id | integer | true | none | 工位id | none |
| »»» label | string | true | none | 工位名称 | none |
| »»» processId | integer | true | none | 所属工序id | none |
| »»» code | string | true | none | 工位代号 | none |
| »»» x | integer | true | none |  | none |
| »»» y | integer | true | none |  | none |
| »»» type | integer | true | none | 工序类型 | 0-起点工位 1-过程工位 2-终点工位 |
| »» links | [object] | true | none |  | none |
| »»» from | integer | true | none | 起始工位id | none |
| »»» to | integer | true | none | 目标工位id | none |
| »» canvas | object | true | none |  | none |
| »»» width | integer | true | none |  | none |
| »»» height | integer | true | none |  | none |
| »»» center | object | false | none |  | none |
| »»»» x | integer | true | none |  | none |
| »»»» y | integer | true | none |  | none |

## POST 维护工位工序流程配置

POST /api/station/v1/flow-config

> Body 请求参数

```json
{
  "processes": [
    {
      "id": 1,
      "label": "机加工序",
      "x": 50,
      "y": 80,
      "width": 320,
      "height": 240,
      "order": 1
    }
  ],
  "stations": [
    {
      "id": 1,
      "label": "工位 A-1",
      "process": "process_01",
      "code": "1",
      "x": 80,
      "y": 130,
      "type": 0
    }
  ],
  "links": [],
  "canvas": {
    "width": 1200,
    "height": 800,
    "center": {
      "x": 600,
      "y": 400
    }
  }
}
```

### 请求参数

| 名称 | 位置 | 类型 | 必选 | 中文名 | 说明 |
| --- | --- | --- | --- | --- | --- |
| token | header | string | 否 |  | none |
| body | body | object | 是 |  | none |
| » processes | body | [object] | 是 | 工序 | none |
| »» id | body | integer | 是 | 工序id | 存在时表示修改，不存在时表示新增 |
| »» label | body | string | 是 | 工序名称 | 唯一 |
| »» x | body | integer | 是 |  | none |
| »» y | body | integer | 是 |  | none |
| »» width | body | integer | 是 |  | none |
| »» height | body | integer | 是 |  | none |
| »» order | body | integer | 是 | 工序序号 | none |
| »» color | body | string | 否 |  | none |
| » stations | body | [object] | 是 | 工位 | none |
| »» id | body | integer | 否 | 工位ID | 存在时表示修改，不存在时表示新增 |
| »» label | body | string | 是 | 工位名称 | 唯一 |
| »» process | body | string | 是 | 所属工序名称 | 注意，传递工序名称，不是工序id |
| »» code | body | string | 是 | 工位代号 | none |
| »» x | body | integer | 是 |  | none |
| »» y | body | integer | 是 |  | none |
| »» type | body | integer | 是 | 工位类型 | 0-起点工位 1-过程工位 2-终点工位 |
| » links | body | [object] | 是 | 连线 | none |
| »» from | body | string | 是 | 起始工位名称 | 注意，传递工位名称，不是工位id |
| »» to | body | string | 是 | 目标工位名称 | 注意，传递工位名称，不是工位id |
| » canvas | body | object | 是 | 画布 | none |
| »» width | body | integer | 是 |  | none |
| »» height | body | integer | 是 |  | none |
| »» center | body | object | 是 |  | none |
| »»» x | body | integer | 是 |  | none |
| »»» y | body | integer | 是 |  | none |

> 返回示例

```json
{
  "status": 0,
  "resMsg": "success",
  "data": {}
}
```

```json
{
  "status": 9000005,
  "resMsg": "参数异常,{0}",
  "data": {}
}
```

```json
{
  "status": 9009999,
  "resMsg": "未知错误,{0}",
  "data": {}
}
```

### 返回结果

| 状态码 | 状态码含义 | 说明 | 数据模型 |
| --- | --- | --- | --- |
| 200 | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | none | Inline |

### 返回数据结构

状态码 **200**

| 名称     | 类型    | 必选  | 约束 | 中文名 | 说明 |
| -------- | ------- | ----- | ---- | ------ | ---- |
| » status | integer | true  | none |        | none |
| » resMsg | string  | true  | none |        | none |
| » data   | object  | false | none |        | none |

# alarm-工位告警

## GET 获取工位告警列表

GET /api/station/v1/alarm/list

工位列表内包含报警配置信息，手动控制数据的显示隐藏来区分工位模块和报警配置

### 请求参数

| 名称 | 位置 | 类型 | 必选 | 中文名 | 说明 |
| --- | --- | --- | --- | --- | --- |
| label | query | string | 否 |  | 工位名称-模糊搜索 |
| code | query | string | 否 |  | 工位代号-模糊搜索 |
| processId | query | integer | 否 |  | 工序id-搜索 |
| showTagStatus | query | integer | 否 |  | 标签状态展示标记 0-不展示 1-展示；传入1用于查询标识器状态的工位过滤 |
| page | query | integer | 是 |  | none |
| pageSize | query | integer | 是 |  | none |
| token | header | string | 否 |  | none |

> 返回示例

```json
{
  "status": 0,
  "resMsg": "成功",
  "data": {
    "total": 2,
    "items": [
      {
        "id": 1,
        "label": "工位 A-1",
        "code": "1",
        "processId": 1,
        "x": 80,
        "y": 130,
        "type": 0,
        "alarmStatus": 0,
        "alarmA": 0,
        "alarmB": 0,
        "alarmC": 0,
        "showTagStatus": 0,
        "inputTime": 1766631601000
      },
      {
        "id": 2,
        "label": "工位 A-2",
        "code": "2",
        "processId": 1,
        "x": 80,
        "y": 130,
        "type": 1,
        "alarmStatus": 0,
        "alarmA": 0,
        "alarmB": 0,
        "alarmC": 0,
        "showTagStatus": 0,
        "inputTime": 1766631601000
      }
    ]
  }
}
```

```json
{
  "status": 0,
  "resMsg": "success",
  "data": {
    "total": 1,
    "items": []
  }
}
```

```json
{
  "status": 9009999,
  "resMsg": "未知错误,{0}",
  "data": {}
}
```

### 返回结果

| 状态码 | 状态码含义 | 说明 | 数据模型 |
| --- | --- | --- | --- |
| 200 | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | none | Inline |

### 返回数据结构

状态码 **200**

| 名称 | 类型 | 必选 | 约束 | 中文名 | 说明 |
| --- | --- | --- | --- | --- | --- |
| » status | integer | true | none |  | none |
| » resMsg | string | true | none |  | none |
| » data | object | false | none |  | none |
| »» total | integer | true | none |  | none |
| »» items | [object] | true | none |  | none |
| »»» id | integer | true | none | 工位id | none |
| »»» label | string | true | none | 工位名称 | none |
| »»» code | string | true | none | 工位代号 | none |
| »»» processId | integer | true | none | 所属工序id | none |
| »»» x | integer | true | none |  | none |
| »»» y | integer | true | none |  | none |
| »»» type | integer | true | none | 工位类型 | 0-起点工位 1-过程工位 2-终点工位 |
| »»» alarmStatus | integer | true | none | 滚动报警开关 | 0-关 1-开 |
| »»» alarmA | integer | true | none | 预警值A | none |
| »»» alarmB | integer | true | none | 预警值B | none |
| »»» alarmC | integer | true | none | 预警值C | none |
| »»» showTagStatus | integer | true | none | 标签器状态展示开关 | 0-关 1-开 |
| »»» inputTime | integer | true | none |  | none |

## PUT 修改工位告警信息

PUT /api/station/v1/alarm/{id}

> Body 请求参数

```json
{
  "alarmStatus": 1,
  "alarmA": 360,
  "alarmB": 330,
  "alarmC": 300,
  "showTagStatus": 1
}
```

### 请求参数

| 名称 | 位置 | 类型 | 必选 | 中文名 | 说明 |
| --- | --- | --- | --- | --- | --- |
| id | path | integer | 是 |  | 工位id |
| token | header | string | 否 |  | none |
| body | body | object | 否 |  | none |
| » alarmStatus | body | integer | 是 | 滚动报警开关 | 0-关 1-开，默认关 |
| » alarmA | body | integer | 是 | 预警值A | 要求大于等于该数值，默认0 |
| » alarmB | body | integer | 是 | 预警值B | 要求大于等于该数值，小于预警值A，默认0 |
| » alarmC | body | integer | 是 | 预警值C | 要求大于等于该数值，小于预警值B，默认0 |
| » showTagStatus | body | integer | 是 | 标签器状态展示开关 | 0-关 1开 |

> 返回示例

```json
{
  "status": 0,
  "resMsg": "success",
  "data": {}
}
```

```json
{
  "status": 9009999,
  "resMsg": "未知错误,{0}",
  "data": {}
}
```

### 返回结果

| 状态码 | 状态码含义 | 说明 | 数据模型 |
| --- | --- | --- | --- |
| 200 | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | none | Inline |

### 返回数据结构

状态码 **200**

| 名称     | 类型    | 必选  | 约束 | 中文名 | 说明 |
| -------- | ------- | ----- | ---- | ------ | ---- |
| » status | integer | true  | none |        | none |
| » resMsg | string  | true  | none |        | none |
| » data   | object  | false | none |        | none |

# radar-雷达

## POST 添加雷达

POST /api/radar/v1/create

> Body 请求参数

```json
{
  "radarHost": "",
  "radarPort": 22,
  "radarAddress": 1,
  "radarAntenna1StationId": 1,
  "radarAntenna2StationId": 2
}
```

### 请求参数

| 名称 | 位置 | 类型 | 必选 | 中文名 | 说明 |
| --- | --- | --- | --- | --- | --- |
| token | header | string | 否 |  | none |
| body | body | object | 否 |  | none |
| » radarHost | body | string | 是 | 雷达ip | none |
| » radarPort | body | integer | 是 | 雷达端口 | none |
| » radarAddress | body | integer | 是 | 雷达地址 | DTU绑定地址 |
| » radarAntenna1StationId | body | integer | 否 | 天线1工位id | none |
| » radarAntenna2StationId | body | integer | 否 | 天线2工位id | none |

> 返回示例

```json
{
  "status": 0,
  "resMsg": "成功",
  "data": {}
}
```

```json
{
  "status": 2000001,
  "resMsg": "已存在相同IP+端口的雷达",
  "data": {}
}
```

```json
{
  "status": 9009999,
  "resMsg": "未知错误,{0}",
  "data": {}
}
```

### 返回结果

| 状态码 | 状态码含义 | 说明 | 数据模型 |
| --- | --- | --- | --- |
| 200 | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | none | Inline |

### 返回数据结构

状态码 **200**

| 名称     | 类型    | 必选  | 约束 | 中文名   | 说明     |
| -------- | ------- | ----- | ---- | -------- | -------- |
| » status | integer | true  | none | 状态码   | none     |
| » resMsg | string  | true  | none | 状态描述 | none     |
| » data   | object  | false | none | 数据对象 | 这里为空 |

## GET 获取雷达列表

GET /api/radar/v1/list

### 请求参数

| 名称 | 位置 | 类型 | 必选 | 中文名 | 说明 |
| --- | --- | --- | --- | --- | --- |
| radarHost | query | string | 否 |  | 雷达ip |
| stationLabel | query | string | 否 |  | 工位名称-模糊搜索，若一个雷达两个天线绑定了两个工位，该搜索条件会同时搜索这两个天线对应的工位名称 |
| stationCode | query | string | 否 |  | 工位代号-搜索，若一个雷达两个天线绑定了两个工位，该搜索条件会同时搜索这两个天线对应的工位代号 |
| processOrder | query | integer | 否 |  | 工序顺序-搜索，若一个雷达两个天线绑定了两个工位，该搜索条件会同时搜索这两个天线对应的工序 |
| page | query | integer | 是 |  | none |
| pageSize | query | integer | 是 |  | none |
| token | header | string | 否 |  | none |

> 返回示例

```json
{
  "status": 0,
  "resMsg": "成功",
  "data": {
    "total": 2,
    "items": [
      {
        "id": 5,
        "radarHost": "8.133.247.229",
        "radarPort": 5006,
        "radarAddress": 1,
        "radarAntenna1StationId": 17,
        "radarAntenna1StationLabel": "工位 A-2",
        "radarAntenna1StationCode": "2",
        "radarAntenna1ProcessOrder": 1,
        "radarStatus": 1,
        "inputTime": 1766570410000,
        "updateTime": 1766570410000
      },
      {
        "id": 4,
        "radarHost": "8.133.247.229",
        "radarPort": 5005,
        "radarAddress": 1,
        "radarAntenna1StationId": 16,
        "radarAntenna1StationLabel": "工位 A-1",
        "radarAntenna1StationCode": "1",
        "radarAntenna1ProcessOrder": 1,
        "radarStatus": 1,
        "inputTime": 1766570401000,
        "updateTime": 1766570401000
      }
    ]
  }
}
```

```json
{
  "status": 0,
  "resMsg": "success",
  "data": {
    "total": 0,
    "items": []
  }
}
```

```json
{
  "status": 9009999,
  "resMsg": "未知错误,{0}",
  "data": {}
}
```

### 返回结果

| 状态码 | 状态码含义 | 说明 | 数据模型 |
| --- | --- | --- | --- |
| 200 | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | none | Inline |

### 返回数据结构

状态码 **200**

| 名称 | 类型 | 必选 | 约束 | 中文名 | 说明 |
| --- | --- | --- | --- | --- | --- |
| » status | integer | true | none |  | none |
| » resMsg | string | true | none |  | none |
| » data | object | false | none |  | none |
| »» total | integer | true | none | 数据总量 | none |
| »» items | [object] | true | none | 当前页数据项 | none |
| »»» id | integer | true | none | 雷达id | none |
| »»» radarHost | string | true | none | 雷达ip | none |
| »»» radarPort | integer | true | none | 雷达端口 | none |
| »»» radarAddress | integer | true | none | 雷达地址 | none |
| »»» radarAntenna1StationId | integer¦null | false | none | 雷达天线1工位id | none |
| »»» radarAntenna1StationLabel | string¦null | false | none | 雷达天线1工位名称 | none |
| »»» radarAntenna1StationCode | string¦null | false | none | 雷达天线1工位代号 | none |
| »»» radarAntenna1ProcessOrder | integer¦null | false | none | 雷达天线1工位工序 | none |
| »»» radarAntenna2StationId | integer¦null | false | none | 雷达天线2工位id | none |
| »»» radarAntenna2StationLabel | string¦null | false | none | 雷达天线2工位名称 | none |
| »»» radarAntenna2StationCode | string¦null | false | none | 雷达天线2工位代号 | none |
| »»» radarAntenna2ProcessOrder | integer¦null | false | none | 雷达天线2工位工序 | none |
| »»» radarStatus | integer | true | none | 雷达状态 | -1-offline（不会再自动重连） 0-connecting 1-online 2-warn |
| »»» inputTime | integer | true | none | 雷达创建时间 | none |
| »»» updateTime | integer | true | none | 雷达更新时间 | none |

## PUT 修改雷达信息

PUT /api/radar/v1/{id}

> Body 请求参数

```json
{
  "host": "192.168.0.1",
  "port": 22,
  "address": 1,
  "antenna1StationId": 1,
  "antenna2StationId": 2
}
```

### 请求参数

| 名称                     | 位置   | 类型    | 必选 | 中文名      | 说明   |
| ------------------------ | ------ | ------- | ---- | ----------- | ------ |
| id                       | path   | integer | 是   |             | 雷达id |
| token                    | header | string  | 否   |             | none   |
| body                     | body   | object  | 否   |             | none   |
| » radarHost              | body   | string  | 是   | 雷达ip      | none   |
| » radarPort              | body   | integer | 是   | 雷达端口    | none   |
| » radarAddress           | body   | integer | 是   | 雷达地址    | none   |
| » radarAntenna1StationId | body   | integer | 否   | 天线1工位id | none   |
| » radarAntenna2StationId | body   | integer | 否   | 天线2工位id | none   |

> 返回示例

```json
{
  "status": 0,
  "resMsg": "success",
  "data": {}
}
```

```json
{
  "status": 2000001,
  "resMsg": "已存在相同IP雷达",
  "data": {}
}
```

```json
{
  "status": 9009999,
  "resMsg": "未知错误,{0}",
  "data": {}
}
```

### 返回结果

| 状态码 | 状态码含义 | 说明 | 数据模型 |
| --- | --- | --- | --- |
| 200 | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | none | Inline |

### 返回数据结构

状态码 **200**

| 名称     | 类型    | 必选  | 约束 | 中文名 | 说明     |
| -------- | ------- | ----- | ---- | ------ | -------- |
| » status | integer | true  | none |        | none     |
| » resMsg | string  | true  | none |        | none     |
| » data   | object  | false | none |        | 这里为空 |

## DELETE 删除雷达

DELETE /api/radar/v1/delete

> Body 请求参数

```json
{
  "ids": [1, 2, 3]
}
```

### 请求参数

| 名称  | 位置   | 类型      | 必选 | 中文名         | 说明 |
| ----- | ------ | --------- | ---- | -------------- | ---- |
| token | header | string    | 否   |                | none |
| body  | body   | object    | 否   |                | none |
| » ids | body   | [integer] | 是   | 删除雷达id数组 | none |

> 返回示例

```json
{
  "status": 0,
  "resMsg": "success",
  "data": {}
}
```

```json
{
  "status": 9009999,
  "resMsg": "未知错误,{0}",
  "data": {}
}
```

### 返回结果

| 状态码 | 状态码含义 | 说明 | 数据模型 |
| --- | --- | --- | --- |
| 200 | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | none | Inline |

### 返回数据结构

状态码 **200**

| 名称     | 类型    | 必选  | 约束 | 中文名 | 说明     |
| -------- | ------- | ----- | ---- | ------ | -------- |
| » status | integer | true  | none |        | none     |
| » resMsg | string  | true  | none |        | none     |
| » data   | object  | false | none |        | 这里为空 |

## GET 获取雷达识别列表-原始数据

GET /api/radar/v1/data

### 请求参数

| 名称 | 位置 | 类型 | 必选 | 中文名 | 说明 |
| --- | --- | --- | --- | --- | --- |
| radarHost | query | string | 是 |  | 雷达ip |
| radarPort | query | integer | 是 |  | 雷达端口 |
| radarAddress | query | integer | 是 |  | 雷达地址 |
| stationLabel | query | string | 否 |  | 工位名称-搜索 |
| tagType | query | integer | 否 |  | 标识器类型，0-高温标识器（铁包）/1-常温标识器（车架） |
| tagSn | query | integer | 否 |  | 标签器ID |
| tagBoundName | query | string | 否 |  | 铁包号/车架号（名）-搜索 |
| startTime | query | integer | 否 |  | 查询开始时间（毫秒时间戳） |
| endTime | query | integer | 否 |  | 查询结束时间（毫秒时间戳） |
| page | query | integer | 是 |  | none |
| pageSize | query | integer | 是 |  | 最大200 |
| token | header | string | 否 |  | none |

> 返回示例

```json
{
  "status": 0,
  "resMsg": "成功",
  "data": {
    "total": 13473,
    "items": [
      {
        "radarHost": "8.133.247.229",
        "radarPort": 5005,
        "radarAddress": 1,
        "id": 1,
        "inputTime": 1766634253496,
        "stationLabel": "工位 A-1",
        "functionCode": 3,
        "dataLength": 20,
        "tagSn": 0,
        "pulse1": 0,
        "pulse2": 0,
        "pulse3": 0,
        "pulse4": 204,
        "pulse5": 0,
        "baseLine": 150,
        "pulseFrequency": 0,
        "antennaNumber": 1,
        "crc16": 48943
      },
      {
        "radarHost": "8.133.247.229",
        "radarPort": 5005,
        "radarAddress": 1,
        "id": 2,
        "inputTime": 1766634253581,
        "stationLabel": "工位 A-1",
        "functionCode": 3,
        "dataLength": 20,
        "tagSn": 0,
        "pulse1": 0,
        "pulse2": 0,
        "pulse3": 0,
        "pulse4": 205,
        "pulse5": 0,
        "baseLine": 151,
        "pulseFrequency": 0,
        "antennaNumber": 1,
        "crc16": 61215
      }
    ]
  }
}
```

```json
{
  "status": 0,
  "resMsg": "success",
  "data": {
    "total": 0,
    "items": []
  }
}
```

```json
{
  "status": 9009999,
  "resMsg": "未知错误,{0}",
  "data": {}
}
```

```json
{
  "status": 9000005,
  "resMsg": "参数异常,{0}",
  "data": {}
}
```

### 返回结果

| 状态码 | 状态码含义 | 说明 | 数据模型 |
| --- | --- | --- | --- |
| 200 | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | none | Inline |

### 返回数据结构

状态码 **200**

| 名称 | 类型 | 必选 | 约束 | 中文名 | 说明 |
| --- | --- | --- | --- | --- | --- |
| » status | integer | true | none |  | none |
| » resMsg | string | true | none |  | none |
| » data | object | false | none |  | none |
| »» total | integer | true | none |  | none |
| »» items | [object] | true | none |  | none |
| »»» id | integer | true | none | 记录id | none |
| »»» radarHost | string | true | none | 雷达ip | none |
| »»» radarPort | integer | true | none | 雷达端口 | none |
| »»» radarAddress | integer | true | none | modbus中雷达地址 | none |
| »»» stationLabel | string | false | none | 工位名称 | none |
| »»» tagType | integer | false | none | 标签类型 | 0-高温标识器（铁包）/1-常温标识器（车架） |
| »»» tagBoundName | string | false | none | 铁包/车架名称 | none |
| »»» functionCode | integer | true | none | modbus中功能码 | none |
| »»» dataLength | integer | true | none | modbus中数据长度 | none |
| »»» tagSn | integer | true | none | modbus中标签号 | none |
| »»» pulse1 | integer | true | none | modbus中pulse1数值 | none |
| »»» pulse2 | integer | true | none | modbus中pulse2数值 | none |
| »»» pulse3 | integer | true | none | modbus中pulse3数值 | none |
| »»» pulse4 | integer | true | none | modbus中pulse4数值 | none |
| »»» pulse5 | integer | true | none | modbus中pulse5数值 | none |
| »»» baseLine | integer | true | none | modbus中基线数值 | none |
| »»» pulseFrequency | integer | true | none | modbus中雷达频率 | none |
| »»» antennaNumber | integer | true | none | modbus中天线号 | none |
| »»» crc16 | integer | true | none | modbus中crc16校验码 | none |
| »»» inputTime | integer | true | none | 插入时间 | none |

## GET 获取雷达识别列表-合并

GET /api/radar/v1/dataGroup

### 请求参数

| 名称 | 位置 | 类型 | 必选 | 中文名 | 说明 |
| --- | --- | --- | --- | --- | --- |
| radarHost | query | string | 否 |  | 雷达ip-搜索 |
| stationLabel | query | string | 否 |  | 工位名称-搜索 |
| tagType | query | integer | 否 |  | 标识器类型，0-高温标识器（铁包）/1-常温标识器（车架） |
| tagSn | query | integer | 否 |  | 标签器ID |
| tagBoundName | query | string | 否 |  | 铁包号/车架号（名）-搜索 |
| startTime | query | integer | 是 |  | 查询开始时间 |
| endTime | query | integer | 是 |  | 查询结束时间 |
| page | query | integer | 是 |  | none |
| pageSize | query | integer | 是 |  | 最大200 |
| token | header | string | 否 |  | none |

> 返回示例

```json
{
  "status": 0,
  "resMsg": "成功",
  "data": {
    "total": 2,
    "items": [
      {
        "id": 18,
        "radarHost": "8.133.247.229",
        "radarPort": 5005,
        "radarAntennaNum": 1,
        "radarAddress": 1,
        "stationLabel": "工位 A-1",
        "tagType": 1,
        "tagSn": 5283351,
        "tagBoundName": "车架1号",
        "tagMaxPulse": 321,
        "tagReadCount": 38,
        "startTime": 1766644119122,
        "endTime": 1766644123188,
        "updateTime": 1766644124000,
        "lastTime": 1766644123188
      },
      {
        "id": 16,
        "radarHost": "8.133.247.229",
        "radarPort": 5006,
        "radarAntennaNum": 1,
        "radarAddress": 1,
        "stationLabel": "工位 A-2",
        "tagType": 1,
        "tagSn": 5283351,
        "tagBoundName": "车架1号",
        "tagMaxPulse": 364,
        "tagReadCount": 46,
        "startTime": 1766644116091,
        "endTime": 1766644120354,
        "updateTime": 1766644121000,
        "lastTime": 1766644120354
      }
    ]
  }
}
```

```json
{
  "status": 0,
  "resMsg": "success",
  "data": {
    "total": 0,
    "items": []
  }
}
```

```json
{
  "status": 9009999,
  "resMsg": "未知错误,{0}",
  "data": {}
}
```

```json
{
  "status": 9000005,
  "resMsg": "参数异常,{0}",
  "data": {}
}
```

### 返回结果

| 状态码 | 状态码含义 | 说明 | 数据模型 |
| --- | --- | --- | --- |
| 200 | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | none | Inline |

### 返回数据结构

状态码 **200**

| 名称 | 类型 | 必选 | 约束 | 中文名 | 说明 |
| --- | --- | --- | --- | --- | --- |
| » status | integer | true | none |  | none |
| » resMsg | string | true | none |  | none |
| » data | object | true | none |  | none |
| »» total | integer | true | none |  | none |
| »» items | [object] | false | none |  | none |
| »»» id | integer | true | none |  | none |
| »»» radarHost | string | true | none | 雷达ip | none |
| »»» radarPort | integer | true | none | 雷达端口 | none |
| »»» radarAntennaNum | integer | true | none | 雷达天线号 | none |
| »»» radarAddress | integer | true | none | 雷达地址 | none |
| »»» stationLabel | string | false | none | 工位名称 | none |
| »»» tagType | integer | false | none | 标签器类型 | 0-高温标识器（铁包）/1-常温标识器（车架） |
| »»» tagSn | integer | true | none | 标签器id | none |
| »»» tagBoundName | string | false | none | 铁包/车架名称 | none |
| »»» tagMaxPulse | integer | true | none | 信号值 | none |
| »»» tagReadCount | integer | true | none | 读取次数 | none |
| »»» startTime | integer | true | none | 开始读取时间 | none |
| »»» endTime | integer | false | none | 结束读取时间 | none |
| »»» updateTime | integer | true | none | 更新时间 | none |
| »»» lastTime | integer | true | none | 最后一次读取时间 | none |

# iron-铁包（高温标识器）

## POST 添加铁包

POST /api/iron/v1/create

> Body 请求参数

```json
{
  "ironName": "铁包1号",
  "tagSn1": 10086,
  "tagSn2": 10087
}
```

### 请求参数

| 名称       | 位置   | 类型    | 必选 | 中文名    | 说明 |
| ---------- | ------ | ------- | ---- | --------- | ---- |
| token      | header | string  | 否   |           | none |
| body       | body   | object  | 否   |           | none |
| » tagSn1   | body   | integer | 否   | 标识器ID1 | none |
| » tagSn2   | body   | integer | 否   | 标识器ID2 | none |
| » ironName | body   | string  | 是   | 铁包名称  | none |

> 返回示例

```json
{
  "status": 0,
  "resMsg": "成功",
  "data": {}
}
```

```json
{
  "status": 3000001,
  "resMsg": "已存在相同高温标识器ID",
  "data": {}
}
```

```json
{
  "status": 3000002,
  "resMsg": "已存在相同铁包号",
  "data": {}
}
```

```json
{
  "status": 9009999,
  "resMsg": "未知错误,{0}",
  "data": {}
}
```

```json
{
  "status": 3000003,
  "resMsg": "已存在相同常温标识器ID",
  "data": {}
}
```

### 返回结果

| 状态码 | 状态码含义 | 说明 | 数据模型 |
| --- | --- | --- | --- |
| 200 | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | none | Inline |

### 返回数据结构

状态码 **200**

| 名称     | 类型    | 必选  | 约束 | 中文名 | 说明     |
| -------- | ------- | ----- | ---- | ------ | -------- |
| » status | integer | true  | none |        | none     |
| » resMsg | string  | true  | none |        | none     |
| » data   | object  | false | none |        | 这里为空 |

## GET 获取铁包列表

GET /api/iron/v1/list

### 请求参数

| 名称     | 位置   | 类型    | 必选 | 中文名 | 说明              |
| -------- | ------ | ------- | ---- | ------ | ----------------- |
| ironName | query  | string  | 否   |        | 铁包名称-模糊搜索 |
| tagSn    | query  | integer | 否   |        | 标识器ID-搜索     |
| page     | query  | integer | 是   |        | none              |
| pageSize | query  | integer | 是   |        | none              |
| token    | header | string  | 否   |        | none              |

> 返回示例

```json
{
  "status": 0,
  "resMsg": "success",
  "data": {
    "total": 1,
    "items": [
      {
        "id": 1,
        "tagSn1": 78093,
        "tagSn2": 14445,
        "ironName": "铁包1号",
        "inputTime": 1754017140000,
        "updateTime": 1754017140000
      }
    ]
  }
}
```

```json
{
  "status": 0,
  "resMsg": "success",
  "data": {
    "total": 0,
    "items": []
  }
}
```

```json
{
  "status": 9009999,
  "resMsg": "未知错误,{0}",
  "data": {}
}
```

### 返回结果

| 状态码 | 状态码含义 | 说明 | 数据模型 |
| --- | --- | --- | --- |
| 200 | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | none | Inline |

### 返回数据结构

状态码 **200**

| 名称           | 类型         | 必选  | 约束 | 中文名        | 说明 |
| -------------- | ------------ | ----- | ---- | ------------- | ---- |
| » status       | integer      | true  | none |               | none |
| » resMsg       | string       | true  | none |               | none |
| » data         | object       | true  | none |               | none |
| »» total       | integer      | true  | none | 总数          | none |
| »» items       | [object]     | true  | none |               | none |
| »»» id         | integer      | true  | none | 铁包id        | none |
| »»» tagSn1     | integer¦null | false | none | 高温标识器1ID | none |
| »»» tagSn2     | integer¦null | false | none | 高温标识器2ID | none |
| »»» ironName   | string       | true  | none | 铁包名称      | none |
| »»» inputTime  | integer      | true  | none |               | none |
| »»» updateTime | integer      | true  | none |               | none |

## PUT 修改铁包信息

PUT /api/iron/v1/{id}

> Body 请求参数

```json
{
  "ironName": "铁包1号",
  "tagSn1": 10086,
  "tagSn2": 10087
}
```

### 请求参数

| 名称       | 位置   | 类型    | 必选 | 中文名    | 说明   |
| ---------- | ------ | ------- | ---- | --------- | ------ |
| id         | path   | integer | 是   |           | 铁包id |
| token      | header | string  | 否   |           | none   |
| body       | body   | object  | 否   |           | none   |
| » tagSn1   | body   | integer | 否   | 标识器ID1 | none   |
| » tagSn2   | body   | integer | 否   | 标识器ID2 | none   |
| » ironName | body   | string  | 是   | 铁包名称  | none   |

> 返回示例

```json
{
  "status": 0,
  "resMsg": "成功",
  "data": {}
}
```

```json
{
  "status": 3000001,
  "resMsg": "已存在相同高温标识器ID",
  "data": {}
}
```

```json
{
  "status": 3000002,
  "resMsg": "已存在相同铁包号",
  "data": {}
}
```

```json
{
  "status": 9009999,
  "resMsg": "未知错误,{0}",
  "data": {}
}
```

```json
{
  "status": 9000002,
  "resMsg": "更新异常,铁包不存在",
  "data": {}
}
```

```json
{
  "status": 3000003,
  "resMsg": "已存在相同常温标识器ID",
  "data": {}
}
```

### 返回结果

| 状态码 | 状态码含义 | 说明 | 数据模型 |
| --- | --- | --- | --- |
| 200 | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | none | Inline |

### 返回数据结构

状态码 **200**

| 名称     | 类型    | 必选  | 约束 | 中文名 | 说明     |
| -------- | ------- | ----- | ---- | ------ | -------- |
| » status | integer | true  | none |        | none     |
| » resMsg | string  | true  | none |        | none     |
| » data   | object  | false | none |        | 这里为空 |

## DELETE 删除铁包

DELETE /api/iron/v1/delete

> Body 请求参数

```json
{
  "ids": [1, 2, 3]
}
```

### 请求参数

| 名称  | 位置   | 类型      | 必选 | 中文名         | 说明 |
| ----- | ------ | --------- | ---- | -------------- | ---- |
| token | header | string    | 否   |                | none |
| body  | body   | object    | 否   |                | none |
| » ids | body   | [integer] | 是   | 删除铁包id数组 | none |

> 返回示例

```json
{
  "status": 0,
  "resMsg": "成功",
  "data": {}
}
```

```json
{
  "status": 9009999,
  "resMsg": "未知错误,{0}",
  "data": {}
}
```

### 返回结果

| 状态码 | 状态码含义 | 说明 | 数据模型 |
| --- | --- | --- | --- |
| 200 | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | none | Inline |

### 返回数据结构

状态码 **200**

| 名称     | 类型    | 必选  | 约束 | 中文名 | 说明     |
| -------- | ------- | ----- | ---- | ------ | -------- |
| » status | integer | true  | none |        | none     |
| » resMsg | string  | true  | none |        | none     |
| » data   | object  | false | none |        | 这里为空 |

# frame-车架（常温标识器）

## POST 添加车架

POST /api/frame/v1/create

> Body 请求参数

```json
{
  "frameName": "车架1号",
  "tagSn1": 10086,
  "tagSn2": 10087,
  "tagSn3": 10088,
  "tagSn4": 10089
}
```

### 请求参数

| 名称        | 位置   | 类型    | 必选 | 中文名    | 说明 |
| ----------- | ------ | ------- | ---- | --------- | ---- |
| token       | header | string  | 否   |           | none |
| body        | body   | object  | 否   |           | none |
| » tagSn1    | body   | integer | 否   | 标识器ID1 | none |
| » tagSn2    | body   | integer | 否   | 标识器ID2 | none |
| » tagSn3    | body   | integer | 否   | 标识器ID3 | none |
| » tagSn4    | body   | integer | 否   | 标识器ID4 | none |
| » frameName | body   | string  | 是   | 车架名称  | none |

> 返回示例

```json
{
  "status": 0,
  "resMsg": "成功",
  "data": {}
}
```

```json
{
  "status": 3000003,
  "resMsg": "已存在相同常温标识器ID",
  "data": {}
}
```

```json
{
  "status": 3000004,
  "resMsg": "已存在相同车架号",
  "data": {}
}
```

```json
{
  "status": 9009999,
  "resMsg": "未知错误,{0}",
  "data": {}
}
```

```json
{
  "status": 3000001,
  "resMsg": "已存在相同高温标识器ID",
  "data": {}
}
```

### 返回结果

| 状态码 | 状态码含义 | 说明 | 数据模型 |
| --- | --- | --- | --- |
| 200 | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | none | Inline |

### 返回数据结构

状态码 **200**

| 名称     | 类型    | 必选  | 约束 | 中文名 | 说明     |
| -------- | ------- | ----- | ---- | ------ | -------- |
| » status | integer | true  | none |        | none     |
| » resMsg | string  | true  | none |        | none     |
| » data   | object  | false | none |        | 这里为空 |

## GET 获取车架列表

GET /api/frame/v1/list

### 请求参数

| 名称      | 位置   | 类型    | 必选 | 中文名 | 说明              |
| --------- | ------ | ------- | ---- | ------ | ----------------- |
| frameName | query  | string  | 否   |        | 车架名称-模糊搜索 |
| tagSn     | query  | integer | 否   |        | 标识器ID-搜索     |
| page      | query  | integer | 是   |        | none              |
| pageSize  | query  | integer | 是   |        | none              |
| token     | header | string  | 否   |        | none              |

> 返回示例

```json
{
  "status": 0,
  "resMsg": "success",
  "data": {
    "total": 1,
    "items": [
      {
        "id": 1,
        "tagSn1": 78093,
        "tagSn2": 14445,
        "tagSn3": 454136,
        "tagSn4": 958952,
        "frameName": "车架1号",
        "inputTime": 1754017140000,
        "updateTime": 1754017140000
      }
    ]
  }
}
```

```json
{
  "status": 0,
  "resMsg": "success",
  "data": {
    "total": 0,
    "items": []
  }
}
```

```json
{
  "status": 9009999,
  "resMsg": "未知错误,{0}",
  "data": {}
}
```

### 返回结果

| 状态码 | 状态码含义 | 说明 | 数据模型 |
| --- | --- | --- | --- |
| 200 | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | none | Inline |

### 返回数据结构

状态码 **200**

| 名称           | 类型         | 必选  | 约束 | 中文名        | 说明 |
| -------------- | ------------ | ----- | ---- | ------------- | ---- |
| » status       | integer      | true  | none |               | none |
| » resMsg       | string       | true  | none |               | none |
| » data         | object       | true  | none |               | none |
| »» total       | integer      | true  | none |               | none |
| »» items       | [object]     | true  | none |               | none |
| »»» id         | integer      | true  | none | 车架id        | none |
| »»» tagSn1     | integer¦null | false | none | 常温标识器1ID | none |
| »»» tagSn2     | integer¦null | false | none | 常温标识器2ID | none |
| »»» tagSn3     | integer¦null | false | none | 常温标识器3ID | none |
| »»» tagSn4     | integer¦null | false | none | 常温标识器4ID | none |
| »»» frameName  | string       | true  | none | 车架名称      | none |
| »»» inputTime  | integer      | true  | none |               | none |
| »»» updateTime | integer      | true  | none |               | none |

## PUT 修改车架信息

PUT /api/frame/v1/{id}

> Body 请求参数

```json
{
  "frameName": "车架1号",
  "tagSn1": 10086,
  "tagSn2": 10087,
  "tagSn3": 10088,
  "tagSn4": 10089
}
```

### 请求参数

| 名称        | 位置   | 类型    | 必选 | 中文名    | 说明   |
| ----------- | ------ | ------- | ---- | --------- | ------ |
| id          | path   | integer | 是   |           | 车架id |
| token       | header | string  | 否   |           | none   |
| body        | body   | object  | 否   |           | none   |
| » tagSn1    | body   | integer | 否   | 标识器ID1 | none   |
| » tagSn2    | body   | integer | 否   | 标识器ID2 | none   |
| » tagSn3    | body   | integer | 否   | 标识器ID3 | none   |
| » tagSn4    | body   | integer | 否   | 标识器ID4 | none   |
| » frameName | body   | string  | 是   | 车架名称  | none   |

> 返回示例

```json
{
  "status": 0,
  "resMsg": "成功",
  "data": {}
}
```

```json
{
  "status": 3000003,
  "resMsg": "已存在相同常温标识器ID",
  "data": {}
}
```

```json
{
  "status": 3000004,
  "resMsg": "已存在相同车架号",
  "data": {}
}
```

```json
{
  "status": 9009999,
  "resMsg": "未知错误,{0}",
  "data": {}
}
```

```json
{
  "status": 9000002,
  "resMsg": "更新异常,车架不存在",
  "data": {}
}
```

```json
{
  "status": 3000001,
  "resMsg": "已存在相同高温标识器ID",
  "data": {}
}
```

### 返回结果

| 状态码 | 状态码含义 | 说明 | 数据模型 |
| --- | --- | --- | --- |
| 200 | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | none | Inline |

### 返回数据结构

状态码 **200**

| 名称     | 类型    | 必选  | 约束 | 中文名 | 说明 |
| -------- | ------- | ----- | ---- | ------ | ---- |
| » status | integer | true  | none |        | none |
| » resMsg | string  | true  | none |        | none |
| » data   | object  | false | none |        | none |

## DELETE 删除车架

DELETE /api/frame/v1/delete

> Body 请求参数

```json
{
  "ids": [1, 2, 3]
}
```

### 请求参数

| 名称  | 位置   | 类型      | 必选 | 中文名         | 说明 |
| ----- | ------ | --------- | ---- | -------------- | ---- |
| token | header | string    | 否   |                | none |
| body  | body   | object    | 否   |                | none |
| » ids | body   | [integer] | 是   | 删除车架id数组 | none |

> 返回示例

```json
{
  "status": 0,
  "resMsg": "成功",
  "data": {}
}
```

```json
{
  "status": 9009999,
  "resMsg": "未知错误,{0}",
  "data": {}
}
```

### 返回结果

| 状态码 | 状态码含义 | 说明 | 数据模型 |
| --- | --- | --- | --- |
| 200 | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | none | Inline |

### 返回数据结构

状态码 **200**

| 名称     | 类型    | 必选  | 约束 | 中文名 | 说明 |
| -------- | ------- | ----- | ---- | ------ | ---- |
| » status | integer | true  | none |        | none |
| » resMsg | string  | true  | none |        | none |
| » data   | object  | false | none |        | none |

# 数据模型
