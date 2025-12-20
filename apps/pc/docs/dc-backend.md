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
generator: "@tarslib/widdershins v4.0.30"

---

# dc-backend-api

Base URLs:

* <a href="http://nas.bigjin.cc:34090">测试环境: http://nas.bigjin.cc:34090</a>

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

|名称|位置|类型|必选|中文名|说明|
|---|---|---|---|---|---|
|body|body|object| 否 ||none|
|» username|body|string| 是 | 用户名|none|
|» password|body|string| 是 | 密码|MD5加密（默认123456）|

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

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» status|integer|true|none|状态码|0-代表成功|
|» resMsg|string|true|none|状态描述|none|
|» data|object|false|none|登录用户信息|none|
|»» id|integer|true|none|用户id|none|
|»» username|string|true|none|用户名|none|
|»» showName|string|true|none|展示名称|none|
|»» token|string|true|none|登录token|none|
|»» tokenExpiration|integer|true|none|token有效期|none|

# workstation-工位

## POST 维护工位工序图

POST /api/workstation/v1/graph

# 工位以网格的形式进行组图
如图：
![image.png](https://api.apifox.com/api/v1/projects/7475240/resources/604121/image-preview)
> 前端初始化默认画布时，可给定10（X）* 10（Y）大小的画布
> 用户可手动继续扩展

- workstationId：代表工序id，若传入，代表修改该工序，若不传入，代表新增该工序
- workstationName：代表工序名称
- workstationX：代表工序，用户拖动工位组件到坐标，取其X即可
- workstationY：代表工位在工序中的上下位置，用户拖动工位组件到坐标，取其Y即可
- workstationType：代表工位类型，0-起点工位 1-过程工位 2-终点工位
- workstationIndex：代表工位代号，工位代号需前端按图从左到右，从上到下依次编码

# 组图后进行路径规划

按照当前工位能到达的其他工位代号（workstationIndex）进行编排
假设：
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
      "routerIndexs": [
        2
      ]
    },
    {
      "workstationIndex": 2,
      "workstationName": "工位2",
      "workstationType": 1,
      "workstationX": 2,
      "workstationY": 2,
      "routerIndexs": [
        1,
        3,
        4
      ]
    },
    {
      "workstationIndex": 3,
      "workstationName": "工位3",
      "workstationType": 1,
      "workstationX": 3,
      "workstationY": 3,
      "routerIndexs": [
        2,
        5
      ]
    },
    {
      "workstationIndex": 4,
      "workstationName": "工位4",
      "workstationType": 1,
      "workstationX": 3,
      "workstationY": 1,
      "routerIndexs": [
        2,
        5
      ]
    },
    {
      "workstationIndex": 5,
      "workstationName": "工位5",
      "workstationType": 2,
      "workstationX": 4,
      "workstationY": 2,
      "routerIndexs": [
        3,
        4
      ]
    }
  ]
}
```

### 请求参数

|名称|位置|类型|必选|中文名|说明|
|---|---|---|---|---|---|
|token|header|string| 否 ||none|
|body|body|object| 否 ||none|
|» graph|body|[object]| 是 | 图谱对象数组|none|
|»» workstationId|body|integer| 否 | 工位id|若有则代表更新该工位信息，若无则代表新建该工位信息|
|»» workstationIndex|body|integer| 是 | 工位代号|需前端编号传回，从左到右、从上到下依次编号|
|»» workstationName|body|string| 是 | 工位名称|none|
|»» workstationType|body|integer| 是 | 工位类型|0-起点工位 1-过程工位 2-终点工位|
|»» workstationX|body|integer| 是 | 工位横坐标|代表工序|
|»» workstationY|body|integer| 是 | 工位纵坐标|标定同工序下的上下顺序|
|»» routerIndexs|body|[integer]| 否 | 工位路由表|代表这个工位连通哪些其他工位，值为工位代号数组|

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

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» status|integer|true|none|状态码|0-代表成功|
|» resMsg|string|true|none|状态描述|none|
|» data|object|true|none||none|

## GET 获取工位工序图

GET /api/workstation/v1/graph

### 请求参数

|名称|位置|类型|必选|中文名|说明|
|---|---|---|---|---|---|
|token|header|string| 否 ||none|

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
        "routerIndexs": [
          2
        ]
      },
      {
        "workstationIndex": 2,
        "workstationName": "工位2",
        "workstationType": 1,
        "workstationX": 2,
        "workstationY": 2,
        "routerIndexs": [
          1,
          3,
          4
        ]
      },
      {
        "workstationIndex": 3,
        "workstationName": "工位3",
        "workstationType": 1,
        "workstationX": 3,
        "workstationY": 3,
        "routerIndexs": [
          2,
          5
        ]
      },
      {
        "workstationIndex": 4,
        "workstationName": "工位4",
        "workstationType": 1,
        "workstationX": 3,
        "workstationY": 1,
        "routerIndexs": [
          2,
          5
        ]
      },
      {
        "workstationIndex": 5,
        "workstationName": "工位5",
        "workstationType": 2,
        "workstationX": 4,
        "workstationY": 2,
        "routerIndexs": [
          3,
          4
        ]
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

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» status|integer|true|none||none|
|» resMsg|string|true|none||none|
|» data|object|false|none||none|
|»» graph|[object]|true|none||none|
|»»» workstationId|integer|false|none|工位id|none|
|»»» workstationIndex|integer|true|none|工位代号|none|
|»»» workstationName|string|true|none|工位名称|none|
|»»» workstationType|integer|true|none|工位类型|0-起点工位 1-过程工位 2-终点工位|
|»»» workstationX|integer|true|none|工位横坐标|代表工序|
|»»» workstationY|integer|true|none|工位纵坐标|标定同工序下的上下顺序|
|»»» routerIndexs|[integer]|false|none|工位路由表|代表这个工位连通哪些其他工位，值为工位代号数组|

# alarm-工位告警

## GET 获取工位告警列表

GET /api/workstation/v1/alarm/list

工位列表内包含报警配置信息，手动控制数据的显示隐藏来区分工位模块和报警配置

### 请求参数

|名称|位置|类型|必选|中文名|说明|
|---|---|---|---|---|---|
|name|query|string| 否 ||名称-模糊搜索|
|index|query|integer| 否 ||工位代号-搜索|
|x|query|integer| 否 ||工序-搜索|
|showTagStatus|query|integer| 否 ||标签状态展示标记 0-不展示 1-展示；传入1用于查询标识器状态的工位过滤|
|page|query|integer| 是 ||none|
|pageSize|query|integer| 是 ||none|
|token|header|string| 否 ||none|

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
        "workstationName": "工位1",
        "workstationAlarmStatus": 1,
        "workstationAlarmA": ">360",
        "workstationAlarmB": ">330",
        "workstationAlarmC": ">300",
        "workstationAlarmD": "<300",
        "workstationShowTagStatus": 1,
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

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» status|integer|true|none||none|
|» resMsg|string|true|none||none|
|» data|object¦null|false|none||none|
|»» total|integer|true|none||none|
|»» items|[object]¦null|false|none|工位告警数组|none|
|»»» id|integer|true|none|工位id|none|
|»»» workstationName|string|true|none|工位名称|none|
|»»» workstationAlarmStatus|integer|true|none|工位报警开关|0-关 1开|
|»»» workstationAlarmA|integer|true|none|预警值A|none|
|»»» workstationAlarmB|integer|true|none|预警值B|none|
|»»» workstationAlarmC|integer|true|none|预警值C|none|
|»»» workstationShowTagStatus|integer|true|none|标签器状态展示开关|0-关 1开|
|»»» inputTime|integer|true|none||none|
|»»» updateTime|integer|true|none||none|

## PUT 修改工位告警信息

PUT /api/workstation/v1/alarm/{id}

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

|名称|位置|类型|必选|中文名|说明|
|---|---|---|---|---|---|
|id|path|integer| 是 ||工位id|
|token|header|string| 否 ||none|
|body|body|object| 否 ||none|
|» alarmStatus|body|integer| 是 | 滚动报警开关|0-关 1-开，默认关|
|» alarmA|body|integer| 是 | 预警值A|要求大于等于该数值，默认0|
|» alarmB|body|integer| 是 | 预警值B|要求大于等于该数值，小于预警值A，默认0|
|» alarmC|body|integer| 是 | 预警值C|要求大于等于该数值，小于预警值B，默认0|
|» showTagStatus|body|integer| 是 | 标签器状态展示开关|0-关 1开|

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

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» status|integer|true|none||none|
|» resMsg|string|true|none||none|
|» data|object|false|none||none|

# radar-雷达

## POST 添加雷达

POST /api/radar/v1/create

> Body 请求参数

```json
{
  "host": "",
  "port": 22,
  "address": 1,
  "antenna1WorkstationId": 1,
  "antenna2WorkstationId": 2
}
```

### 请求参数

|名称|位置|类型|必选|中文名|说明|
|---|---|---|---|---|---|
|token|header|string| 否 ||none|
|body|body|object| 否 ||none|
|» host|body|string| 是 | 雷达ip|none|
|» port|body|integer| 是 | 雷达端口|none|
|» address|body|integer| 是 | 雷达地址|DTU绑定地址|
|» antenna1WorkstationId|body|integer| 否 | 天线1工位id|none|
|» antenna2WorkstationId|body|integer| 否 | 天线2工位id|none|

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

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» status|integer|true|none|状态码|none|
|» resMsg|string|true|none|状态描述|none|
|» data|object|false|none|数据对象|这里为空|

## GET 获取雷达列表

GET /api/radar/v1/list

### 请求参数

|名称|位置|类型|必选|中文名|说明|
|---|---|---|---|---|---|
|host|query|string| 否 ||雷达ip|
|workstationName|query|string| 否 ||工位名称-模糊搜索，若一个雷达两个天线绑定了两个工位，该搜索条件会同时搜索这两个天线对应的工位名称|
|workstationIndex|query|integer| 否 ||工位代号-搜索，若一个雷达两个天线绑定了两个工位，该搜索条件会同时搜索这两个天线对应的工位代号|
|workstationProcess|query|integer| 否 ||工序-搜索，若一个雷达两个天线绑定了两个工位，该搜索条件会同时搜索这两个天线对应的工序|
|page|query|integer| 是 ||none|
|pageSize|query|integer| 是 ||none|
|token|header|string| 否 ||none|

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
        "radarHost": "192.168.0.1",
        "radarPort": 1,
        "radarAddress": 1,
        "radarAntenna1WorkstationId": 1,
        "radarAntenna1WorkstationName": "工位1",
        "radarAntenna1WorkstationIndex": 1,
        "radarAntenna1WorkstationProcess": 2,
        "radarAntenna2WorkstationId": 2,
        "radarAntenna2WorkstationName": "工位2",
        "radarAntenna2WorkstationIndex": 2,
        "radarAntenna2WorkstationProcess": 2,
        "radarStatus": 1,
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

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» status|integer|true|none||none|
|» resMsg|string|true|none||none|
|» data|object|false|none||none|
|»» total|integer|true|none|数据总量|none|
|»» items|[object]|true|none|当前页数据项|none|
|»»» id|integer|true|none|雷达id|none|
|»»» radarHost|string|true|none|雷达ip|none|
|»»» radarPort|integer|true|none|雷达端口|none|
|»»» radarAddress|integer|true|none|雷达地址|none|
|»»» radarAntenna1WorkstationId|integer¦null|false|none|雷达天线1工位id|none|
|»»» radarAntenna1WorkstationName|string¦null|false|none|雷达天线1工位名称|none|
|»»» radarAntenna1WorkstationIndex|integer¦null|false|none|雷达天线1工位代号|none|
|»»» radarAntenna1WorkstationProcess|integer¦null|false|none|雷达天线1工位工序|none|
|»»» radarAntenna2WorkstationId|integer¦null|false|none|雷达天线2工位id|none|
|»»» radarAntenna2WorkstationName|string¦null|false|none|雷达天线2工位名称|none|
|»»» radarAntenna2WorkstationIndex|integer¦null|false|none|雷达天线2工位代号|none|
|»»» radarAntenna2WorkstationProcess|integer¦null|false|none|雷达天线2工位工序|none|
|»»» radarStatus|integer|true|none|雷达状态|-1-offline（不会再自动重连） 0-connecting 1-online 2-warn|
|»»» inputTime|integer|true|none|雷达创建时间|none|
|»»» updateTime|integer|true|none|雷达更新时间|none|

## PUT 修改雷达信息

PUT /api/radar/v1/{id}

> Body 请求参数

```json
{
  "host": "192.168.0.1",
  "port": 22,
  "antenna1WorkstationId": 1,
  "antenna2WorkstationId": 2
}
```

### 请求参数

|名称|位置|类型|必选|中文名|说明|
|---|---|---|---|---|---|
|id|path|integer| 是 ||雷达id|
|token|header|string| 否 ||none|
|body|body|object| 否 ||none|
|» host|body|string| 是 | 雷达ip|none|
|» port|body|integer| 是 | 雷达端口|none|
|» antenna1WorkstationId|body|integer| 否 | 天线1工位id|none|
|» antenna2WorkstationId|body|integer| 否 | 天线2工位id|none|

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

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» status|integer|true|none||none|
|» resMsg|string|true|none||none|
|» data|object|false|none||这里为空|

## DELETE 删除雷达

DELETE /api/radar/v1/delete

> Body 请求参数

```json
{
  "ids": [
    1,
    2,
    3
  ]
}
```

### 请求参数

|名称|位置|类型|必选|中文名|说明|
|---|---|---|---|---|---|
|token|header|string| 否 ||none|
|body|body|object| 否 ||none|
|» ids|body|[integer]| 是 | 删除雷达id数组|none|

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

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» status|integer|true|none||none|
|» resMsg|string|true|none||none|
|» data|object|false|none||这里为空|

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

|名称|位置|类型|必选|中文名|说明|
|---|---|---|---|---|---|
|token|header|string| 否 ||none|
|body|body|object| 否 ||none|
|» tagSn1|body|integer| 否 | 标识器ID1|none|
|» tagSn2|body|integer| 否 | 标识器ID2|none|
|» ironName|body|string| 是 | 铁包名称|none|

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

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» status|integer|true|none||none|
|» resMsg|string|true|none||none|
|» data|object|false|none||这里为空|

## GET 获取铁包列表

GET /api/iron/v1/list

### 请求参数

|名称|位置|类型|必选|中文名|说明|
|---|---|---|---|---|---|
|ironName|query|string| 否 ||铁包名称-模糊搜索|
|tagSn|query|integer| 否 ||标识器ID-搜索|
|page|query|integer| 是 ||none|
|pageSize|query|integer| 是 ||none|
|token|header|string| 否 ||none|

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

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» status|integer|true|none||none|
|» resMsg|string|true|none||none|
|» data|object|true|none||none|
|»» total|integer|true|none|总数|none|
|»» items|[object]|true|none||none|
|»»» id|integer|true|none|铁包id|none|
|»»» tagSn1|integer¦null|false|none|高温标识器1ID|none|
|»»» tagSn2|integer¦null|false|none|高温标识器2ID|none|
|»»» ironName|string|true|none|铁包名称|none|
|»»» inputTime|integer|true|none||none|
|»»» updateTime|integer|true|none||none|

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

|名称|位置|类型|必选|中文名|说明|
|---|---|---|---|---|---|
|id|path|integer| 是 ||铁包id|
|token|header|string| 否 ||none|
|body|body|object| 否 ||none|
|» tagSn1|body|integer| 否 | 标识器ID1|none|
|» tagSn2|body|integer| 否 | 标识器ID2|none|
|» ironName|body|string| 是 | 铁包名称|none|

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

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» status|integer|true|none||none|
|» resMsg|string|true|none||none|
|» data|object|false|none||这里为空|

## DELETE 删除铁包

DELETE /api/iron/v1/delete

> Body 请求参数

```json
{
  "ids": [
    1,
    2,
    3
  ]
}
```

### 请求参数

|名称|位置|类型|必选|中文名|说明|
|---|---|---|---|---|---|
|token|header|string| 否 ||none|
|body|body|object| 否 ||none|
|» ids|body|[integer]| 是 | 删除铁包id数组|none|

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

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» status|integer|true|none||none|
|» resMsg|string|true|none||none|
|» data|object|false|none||这里为空|

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

|名称|位置|类型|必选|中文名|说明|
|---|---|---|---|---|---|
|token|header|string| 否 ||none|
|body|body|object| 否 ||none|
|» tagSn1|body|integer| 否 | 标识器ID1|none|
|» tagSn2|body|integer| 否 | 标识器ID2|none|
|» tagSn3|body|integer| 否 | 标识器ID3|none|
|» tagSn4|body|integer| 否 | 标识器ID4|none|
|» frameName|body|string| 是 | 车架名称|none|

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

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» status|integer|true|none||none|
|» resMsg|string|true|none||none|
|» data|object|false|none||这里为空|

## GET 获取车架列表

GET /api/frame/v1/list

### 请求参数

|名称|位置|类型|必选|中文名|说明|
|---|---|---|---|---|---|
|frameName|query|string| 否 ||车架名称-模糊搜索|
|tagSn|query|integer| 否 ||标识器ID-搜索|
|page|query|integer| 是 ||none|
|pageSize|query|integer| 是 ||none|
|token|header|string| 否 ||none|

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

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» status|integer|true|none||none|
|» resMsg|string|true|none||none|
|» data|object|true|none||none|
|»» total|integer|true|none||none|
|»» items|[object]|true|none||none|
|»»» id|integer|true|none|车架id|none|
|»»» tagSn1|integer¦null|false|none|常温标识器1ID|none|
|»»» tagSn2|integer¦null|false|none|常温标识器2ID|none|
|»»» tagSn3|integer¦null|false|none|常温标识器3ID|none|
|»»» tagSn4|integer¦null|false|none|常温标识器4ID|none|
|»»» frameName|string|true|none|车架名称|none|
|»»» inputTime|integer|true|none||none|
|»»» updateTime|integer|true|none||none|

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

|名称|位置|类型|必选|中文名|说明|
|---|---|---|---|---|---|
|id|path|integer| 是 ||车架id|
|token|header|string| 否 ||none|
|body|body|object| 否 ||none|
|» tagSn1|body|integer| 否 | 标识器ID1|none|
|» tagSn2|body|integer| 否 | 标识器ID2|none|
|» tagSn3|body|integer| 否 | 标识器ID3|none|
|» tagSn4|body|integer| 否 | 标识器ID4|none|
|» frameName|body|string| 是 | 车架名称|none|

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

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» status|integer|true|none||none|
|» resMsg|string|true|none||none|
|» data|object|false|none||none|

## DELETE 删除车架

DELETE /api/frame/v1/delete

> Body 请求参数

```json
{
  "ids": [
    1,
    2,
    3
  ]
}
```

### 请求参数

|名称|位置|类型|必选|中文名|说明|
|---|---|---|---|---|---|
|token|header|string| 否 ||none|
|body|body|object| 否 ||none|
|» ids|body|[integer]| 是 | 删除车架id数组|none|

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

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» status|integer|true|none||none|
|» resMsg|string|true|none||none|
|» data|object|false|none||none|

# 数据模型

