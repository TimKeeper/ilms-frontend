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

|名称|位置|类型|必选|中文名|说明|
|---|---|---|---|---|---|
|token|header|string| 否 ||登录时给定的token|
|body|body|object| 否 ||none|
|» oldPassword|body|string| 是 | 老密码|MD5加密|
|» newPassword|body|string| 是 | 新密码|MD5加密|

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

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» status|integer|true|none|状态码|0-代表成功|
|» resMsg|string|true|none|状态描述|none|
|» data|object|false|none||none|

## GET 测试

GET /api/iam/v1/info

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

# station-工位

## GET 获取工位工序流程配置

GET /api/station/v1/flow-config

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
|»» processes|[object]|true|none||none|
|»»» id|integer|true|none|工序id|none|
|»»» label|string|true|none|工序名称|none|
|»»» x|integer|true|none||none|
|»»» y|integer|true|none||none|
|»»» width|integer|true|none||none|
|»»» height|integer|true|none||none|
|»»» order|integer|true|none|工序顺序|none|
|»»» color|string|false|none||none|
|»» stations|[object]|true|none||none|
|»»» id|integer|true|none|工位id|none|
|»»» label|string|true|none|工位名称|none|
|»»» processId|integer|true|none|所属工序id|none|
|»»» code|string|true|none|工位代号|none|
|»»» x|integer|true|none||none|
|»»» y|integer|true|none||none|
|»»» type|integer|true|none|工序类型|0-起点工位 1-过程工位 2-终点工位|
|»» links|[object]|true|none||none|
|»»» from|integer|true|none|起始工位id|none|
|»»» to|integer|true|none|目标工位id|none|
|»» canvas|object|true|none||none|
|»»» width|integer|true|none||none|
|»»» height|integer|true|none||none|
|»»» center|object|false|none||none|
|»»»» x|integer|true|none||none|
|»»»» y|integer|true|none||none|

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

|名称|位置|类型|必选|中文名|说明|
|---|---|---|---|---|---|
|token|header|string| 否 ||none|
|body|body|object| 是 ||none|
|» processes|body|[object]| 是 | 工序|none|
|»» id|body|integer| 是 | 工序id|存在时表示修改，不存在时表示新增|
|»» label|body|string| 是 | 工序名称|唯一|
|»» x|body|integer| 是 ||none|
|»» y|body|integer| 是 ||none|
|»» width|body|integer| 是 ||none|
|»» height|body|integer| 是 ||none|
|»» order|body|integer| 是 | 工序序号|none|
|»» color|body|string| 否 ||none|
|» stations|body|[object]| 是 | 工位|none|
|»» id|body|integer| 否 | 工位ID|存在时表示修改，不存在时表示新增|
|»» label|body|string| 是 | 工位名称|唯一|
|»» process|body|string| 是 | 所属工序名称|注意，传递工序名称，不是工序id|
|»» code|body|string| 是 | 工位代号|none|
|»» x|body|integer| 是 ||none|
|»» y|body|integer| 是 ||none|
|»» type|body|integer| 是 | 工位类型|0-起点工位 1-过程工位 2-终点工位|
|» links|body|[object]| 是 | 连线|none|
|»» from|body|string| 是 | 起始工位名称|注意，传递工位名称，不是工位id|
|»» to|body|string| 是 | 目标工位名称|注意，传递工位名称，不是工位id|
|» canvas|body|object| 是 | 画布|none|
|»» width|body|integer| 是 ||none|
|»» height|body|integer| 是 ||none|
|»» center|body|object| 是 ||none|
|»»» x|body|integer| 是 ||none|
|»»» y|body|integer| 是 ||none|

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

## GET 获取工位识别率报表

GET /api/station/v1/accuracy

### 请求参数

|名称|位置|类型|必选|中文名|说明|
|---|---|---|---|---|---|
|startTime|query|number| 否 ||筛选开始时间，毫秒时间戳|
|endTime|query|number| 否 ||筛选结束时间，毫秒时间戳|
|token|header|string| 否 ||none|

> 返回示例

```json
{
  "status": 0,
  "resMsg": "成功",
  "data": {
    "overallAccuracy": {
      "identifyCount": 6,
      "missCount": 2,
      "chaosCount": 2,
      "errorCount": 4,
      "rate": 0.5
    },
    "stationAccuracyList": [
      {
        "stationLabel": "工位 1",
        "stationCode": 1
      },
      {
        "stationLabel": "工位 2",
        "stationCode": 2,
        "identifyCount": 4,
        "missCount": 0,
        "chaosCount": 1,
        "errorCount": 1,
        "rate": 0.75
      },
      {
        "stationLabel": "工位 3",
        "stationCode": 3,
        "identifyCount": 0,
        "missCount": 2,
        "chaosCount": 0,
        "errorCount": 2,
        "rate": 0
      },
      {
        "stationLabel": "工位 4",
        "stationCode": 4,
        "identifyCount": 0,
        "missCount": 2,
        "chaosCount": 0,
        "errorCount": 2,
        "rate": 0
      },
      {
        "stationLabel": "工位 5",
        "stationCode": 5,
        "identifyCount": 0,
        "missCount": 2,
        "chaosCount": 0,
        "errorCount": 2,
        "rate": 0
      },
      {
        "stationLabel": "工位 6",
        "stationCode": 6,
        "identifyCount": 2,
        "missCount": 0,
        "chaosCount": 1,
        "errorCount": 1,
        "rate": 0.5
      },
      {
        "stationLabel": "工位 7",
        "stationCode": 7
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
|» data|object|true|none||none|
|»» overallAccuracy|object|true|none|整体识别率|none|
|»»» identifyCount|integer|true|none|识别次数|包含正常识别与串读|
|»»» missCount|integer|true|none|漏读次数|none|
|»»» chaosCount|integer|true|none|串读次数|none|
|»»» errorCount|integer|true|none|错误次数|包含漏读与串读|
|»»» rate|number|true|none|识别率|none|
|»» stationAccuracyList|[object]|true|none|工位识别率|none|
|»»» stationLabel|string|true|none|工位名称|none|
|»»» stationCode|integer|true|none|工位代号|none|
|»»» identifyCount|integer|false|none|识别次数|包含正常识别与串读|
|»»» missCount|integer|false|none|漏读次数|none|
|»»» chaosCount|integer|false|none|串读次数|none|
|»»» errorCount|integer|false|none|错误次数|漏读+串读|
|»»» rate|number|false|none|识别率|none|

# alarm-工位告警

## GET 获取工位告警列表

GET /api/station/v1/alarm/list

工位列表内包含报警配置信息，手动控制数据的显示隐藏来区分工位模块和报警配置

### 请求参数

|名称|位置|类型|必选|中文名|说明|
|---|---|---|---|---|---|
|label|query|string| 否 ||工位名称-模糊搜索|
|code|query|string| 否 ||工位代号-模糊搜索|
|processId|query|integer| 否 ||工序id-搜索|
|showTagStatus|query|integer| 否 ||标签状态展示标记 0-不展示 1-展示；传入1用于查询标识器状态的工位过滤|
|page|query|integer| 否 ||none|
|pageSize|query|integer| 否 ||none|
|token|header|string| 否 ||none|

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
|»» total|integer|true|none||none|
|»» items|[object]|true|none||none|
|»»» id|integer|true|none|工位id|none|
|»»» label|string|true|none|工位名称|none|
|»»» code|string|true|none|工位代号|none|
|»»» processId|integer|true|none|所属工序id|none|
|»»» x|integer|true|none||none|
|»»» y|integer|true|none||none|
|»»» type|integer|true|none|工位类型|0-起点工位 1-过程工位 2-终点工位|
|»»» alarmStatus|integer|true|none|滚动报警开关|0-关 1-开|
|»»» alarmA|integer|true|none|预警值A|none|
|»»» alarmB|integer|true|none|预警值B|none|
|»»» alarmC|integer|true|none|预警值C|none|
|»»» showTagStatus|integer|true|none|标签器状态展示开关|0-关 1-开|
|»»» inputTime|integer|true|none||none|

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
  "radarHost": "",
  "radarPort": 22,
  "radarAddress": 1,
  "radarAntenna1StationId": 1,
  "radarAntenna2StationId": 2
}
```

### 请求参数

|名称|位置|类型|必选|中文名|说明|
|---|---|---|---|---|---|
|token|header|string| 否 ||none|
|body|body|object| 否 ||none|
|» radarHost|body|string| 是 | 雷达ip|none|
|» radarPort|body|integer| 是 | 雷达端口|none|
|» radarAddress|body|integer| 是 | 雷达地址|DTU绑定地址|
|» radarAntenna1StationId|body|integer| 否 | 天线1工位id|none|
|» radarAntenna2StationId|body|integer| 否 | 天线2工位id|none|

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
|radarHost|query|string| 否 ||雷达ip|
|stationLabel|query|string| 否 ||工位名称-模糊搜索，若一个雷达两个天线绑定了两个工位，该搜索条件会同时搜索这两个天线对应的工位名称|
|stationCode|query|string| 否 ||工位代号-搜索，若一个雷达两个天线绑定了两个工位，该搜索条件会同时搜索这两个天线对应的工位代号|
|processOrder|query|integer| 否 ||工序顺序-搜索，若一个雷达两个天线绑定了两个工位，该搜索条件会同时搜索这两个天线对应的工序|
|page|query|integer| 是 ||none|
|pageSize|query|integer| 是 ||none|
|token|header|string| 否 ||none|

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
|»»» radarAntenna1StationId|integer¦null|false|none|雷达天线1工位id|none|
|»»» radarAntenna1StationLabel|string¦null|false|none|雷达天线1工位名称|none|
|»»» radarAntenna1StationCode|string¦null|false|none|雷达天线1工位代号|none|
|»»» radarAntenna1ProcessOrder|integer¦null|false|none|雷达天线1工位工序|none|
|»»» radarAntenna2StationId|integer¦null|false|none|雷达天线2工位id|none|
|»»» radarAntenna2StationLabel|string¦null|false|none|雷达天线2工位名称|none|
|»»» radarAntenna2StationCode|string¦null|false|none|雷达天线2工位代号|none|
|»»» radarAntenna2ProcessOrder|integer¦null|false|none|雷达天线2工位工序|none|
|»»» radarStatus|integer|true|none|雷达状态|-1-offline（不会再自动重连） 0-connecting 1-online 2-warn 3-readTimeout|
|»»» inputTime|integer|true|none|雷达创建时间|none|
|»»» updateTime|integer|true|none|雷达更新时间|none|

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

|名称|位置|类型|必选|中文名|说明|
|---|---|---|---|---|---|
|id|path|integer| 是 ||雷达id|
|token|header|string| 否 ||none|
|body|body|object| 否 ||none|
|» radarHost|body|string| 是 | 雷达ip|none|
|» radarPort|body|integer| 是 | 雷达端口|none|
|» radarAddress|body|integer| 是 | 雷达地址|none|
|» radarAntenna1StationId|body|integer| 否 | 天线1工位id|none|
|» radarAntenna2StationId|body|integer| 否 | 天线2工位id|none|

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

## GET 获取雷达识别列表-原始数据

GET /api/radar/v1/data

### 请求参数

|名称|位置|类型|必选|中文名|说明|
|---|---|---|---|---|---|
|radarHost|query|string| 是 ||雷达ip|
|radarPort|query|integer| 是 ||雷达端口|
|radarAddress|query|integer| 是 ||雷达地址|
|stationLabel|query|string| 否 ||工位名称-搜索|
|tagType|query|integer| 否 ||标识器类型，0-高温标识器（铁包）/1-常温标识器（车架）|
|tagSn|query|integer| 否 ||标签器ID|
|tagBoundName|query|string| 否 ||铁包号/车架号（名）-搜索|
|startTime|query|integer| 否 ||查询开始时间（毫秒时间戳）|
|endTime|query|integer| 否 ||查询结束时间（毫秒时间戳）|
|page|query|integer| 是 ||none|
|pageSize|query|integer| 是 ||最大200|
|token|header|string| 否 ||none|

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
|»» total|integer|true|none||none|
|»» items|[object]|true|none||none|
|»»» id|integer|true|none|记录id|none|
|»»» radarHost|string|true|none|雷达ip|none|
|»»» radarPort|integer|true|none|雷达端口|none|
|»»» radarAddress|integer|true|none|modbus中雷达地址|none|
|»»» stationLabel|string|false|none|工位名称|none|
|»»» tagType|integer|false|none|标签类型|0-高温标识器（铁包）/1-常温标识器（车架）|
|»»» tagBoundName|string|false|none|铁包/车架名称|none|
|»»» functionCode|integer|true|none|modbus中功能码|none|
|»»» dataLength|integer|true|none|modbus中数据长度|none|
|»»» tagSn|integer|true|none|modbus中标签号|none|
|»»» pulse1|integer|true|none|modbus中pulse1数值|none|
|»»» pulse2|integer|true|none|modbus中pulse2数值|none|
|»»» pulse3|integer|true|none|modbus中pulse3数值|none|
|»»» pulse4|integer|true|none|modbus中pulse4数值|none|
|»»» pulse5|integer|true|none|modbus中pulse5数值|none|
|»»» baseLine|integer|true|none|modbus中基线数值|none|
|»»» pulseFrequency|integer|true|none|modbus中雷达频率|none|
|»»» antennaNumber|integer|true|none|modbus中天线号|none|
|»»» crc16|integer|true|none|modbus中crc16校验码|none|
|»»» inputTime|integer|true|none|插入时间|none|

## GET 获取雷达识别列表-合并

GET /api/radar/v1/dataGroup

### 请求参数

|名称|位置|类型|必选|中文名|说明|
|---|---|---|---|---|---|
|radarHost|query|string| 否 ||雷达ip-搜索|
|stationLabel|query|string| 否 ||工位名称-搜索|
|tagType|query|integer| 否 ||标识器类型，0-高温标识器（铁包）/1-常温标识器（车架）|
|tagSn|query|integer| 否 ||标签器ID|
|tagBoundName|query|string| 否 ||铁包号/车架号（名）-搜索|
|startTime|query|integer| 是 ||查询开始时间|
|endTime|query|integer| 是 ||查询结束时间|
|page|query|integer| 是 ||none|
|pageSize|query|integer| 是 ||最大200|
|token|header|string| 否 ||none|

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
|»» items|[object]|false|none||none|
|»»» id|integer|true|none||none|
|»»» radarHost|string|true|none|雷达ip|none|
|»»» radarPort|integer|true|none|雷达端口|none|
|»»» radarAntennaNum|integer|true|none|雷达天线号|none|
|»»» radarAddress|integer|true|none|雷达地址|none|
|»»» stationLabel|string|false|none|工位名称|none|
|»»» tagType|integer|false|none|标签器类型|0-高温标识器（铁包）/1-常温标识器（车架）|
|»»» tagSn|integer|true|none|标签器id|none|
|»»» tagBoundName|string|false|none|铁包/车架名称|none|
|»»» tagMaxPulse|integer|true|none|信号值|none|
|»»» tagReadCount|integer|true|none|读取次数|none|
|»»» startTime|integer|true|none|开始读取时间|none|
|»»» endTime|integer|false|none|结束读取时间|none|
|»»» updateTime|integer|true|none|更新时间|none|
|»»» lastTime|integer|true|none|最后一次读取时间|none|

## GET 下载雷达导入模板

GET /api/radar/v1/template/download

### 请求参数

|名称|位置|类型|必选|中文名|说明|
|---|---|---|---|---|---|
|token|header|string| 否 ||none|

> 返回示例

> 200 Response

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## POST 导入雷达

POST /api/radar/v1/import

只支持.xls或.xlsx文件
导入接口会对文件内的数据进行预检查。
只有检测全部通过才会进行导入。
只要有数据检测不通过，就不会进行导入，接口会返回所有有问题的数据，供用户修改参考。

> Body 请求参数

```yaml
file: ""

```

### 请求参数

|名称|位置|类型|必选|中文名|说明|
|---|---|---|---|---|---|
|token|header|string| 否 ||none|
|body|body|object| 否 ||none|
|» file|body|string(binary)| 否 ||none|

> 返回示例

```json
{
  "status": 0,
  "resMsg": "成功",
  "data": {
    "success": true,
    "totalRows": 2,
    "successCount": 2,
    "failCount": 0,
    "errors": []
  }
}
```

```json
{
  "status": 9000005,
  "resMsg": "参数异常",
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
  "status": 0,
  "resMsg": "成功",
  "data": {
    "success": false,
    "totalRows": 2,
    "successCount": 0,
    "failCount": 2,
    "errors": [
      "第2行: 雷达(IP:8.133.247.229, 端口:5005, 地址:1)已存在",
      "第3行: 雷达(IP:8.133.247.229, 端口:5006, 地址:1)已存在"
    ]
  }
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
|»» success|boolean|true|none|导入状态|none|
|»» totalRows|integer|true|none|数据总行数|文件中的雷达数据总行数|
|»» successCount|integer|true|none|成功导入数|none|
|»» failCount|integer|true|none|失败导入数|none|
|»» errors|[string]|true|none|错误信息|none|

## GET 导出雷达

GET /api/radar/v1/export

### 请求参数

|名称|位置|类型|必选|中文名|说明|
|---|---|---|---|---|---|
|radarHost|query|string| 否 ||none|
|stationLabel|query|string| 否 ||none|
|stationCode|query|string| 否 ||none|
|processOrder|query|integer| 否 ||none|
|token|header|string| 否 ||none|

> 返回示例

> 200 Response

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

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

## GET 下载铁包导入模板

GET /api/iron/v1/template/download

### 请求参数

|名称|位置|类型|必选|中文名|说明|
|---|---|---|---|---|---|
|token|header|string| 否 ||none|

> 返回示例

> 200 Response

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## POST 导入铁包

POST /api/iron/v1/import

只支持.xls或.xlsx文件
导入接口会对文件内的数据进行预检查。
检测通过的会先行导入。
数据检测不通过，就不会进行导入，接口会返回所有有问题的数据，供用户修改参考。

> Body 请求参数

```yaml
file: ""

```

### 请求参数

|名称|位置|类型|必选|中文名|说明|
|---|---|---|---|---|---|
|token|header|string| 否 ||none|
|body|body|object| 否 ||none|
|» file|body|string(binary)| 否 ||none|

> 返回示例

```json
{
  "status": 0,
  "resMsg": "成功",
  "data": {
    "success": true,
    "totalRows": 2,
    "successCount": 2,
    "failCount": 0,
    "errors": []
  }
}
```

```json
{
  "status": 9000005,
  "resMsg": "参数异常",
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
  "status": 0,
  "resMsg": "成功",
  "data": {
    "success": false,
    "totalRows": 2,
    "successCount": 0,
    "failCount": 2,
    "errors": [
      "第2行：标签器ID【1002】与第3行重复",
      "第3行：标签器ID【1002】与第2行重复"
    ]
  }
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
|»» success|boolean|true|none|导入状态|none|
|»» totalRows|integer|true|none|数据总行数|文件中的雷达数据总行数|
|»» successCount|integer|true|none|成功导入数|none|
|»» failCount|integer|true|none|失败导入数|none|
|»» errors|[string]|true|none|错误信息|none|

## GET 导出铁包

GET /api/iron/v1/export

### 请求参数

|名称|位置|类型|必选|中文名|说明|
|---|---|---|---|---|---|
|ironName|query|string| 否 ||铁包名称|
|tagSn|query|number| 否 ||标签器ID|
|token|header|string| 否 ||none|

> 返回示例

> 200 Response

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

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

## GET 下载车架导入模板

GET /api/frame/v1/template/download

### 请求参数

|名称|位置|类型|必选|中文名|说明|
|---|---|---|---|---|---|
|token|header|string| 否 ||none|

> 返回示例

> 200 Response

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## POST 导入车架

POST /api/frame/v1/import

只支持.xls或.xlsx文件
导入接口会对文件内的数据进行预检查。
检测通过的会先行导入。
数据检测不通过，就不会进行导入，接口会返回所有有问题的数据，供用户修改参考。

> Body 请求参数

```yaml
file: ""

```

### 请求参数

|名称|位置|类型|必选|中文名|说明|
|---|---|---|---|---|---|
|token|header|string| 否 ||none|
|body|body|object| 否 ||none|
|» file|body|string(binary)| 否 ||none|

> 返回示例

```json
{
  "status": 0,
  "resMsg": "成功",
  "data": {
    "success": true,
    "totalRows": 2,
    "successCount": 2,
    "failCount": 0,
    "errors": []
  }
}
```

```json
{
  "status": 9000005,
  "resMsg": "参数异常",
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
  "status": 0,
  "resMsg": "成功",
  "data": {
    "success": false,
    "totalRows": 1,
    "successCount": 0,
    "failCount": 1,
    "errors": [
      "第2行: 已存在相同高温标识器ID【1002】，被【铁包1】铁包绑定"
    ]
  }
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
|»» success|boolean|true|none|导入状态|none|
|»» totalRows|integer|true|none|数据总行数|文件中的雷达数据总行数|
|»» successCount|integer|true|none|成功导入数|none|
|»» failCount|integer|true|none|失败导入数|none|
|»» errors|[string]|true|none|错误信息|none|

## GET 导出车架

GET /api/frame/v1/export

### 请求参数

|名称|位置|类型|必选|中文名|说明|
|---|---|---|---|---|---|
|frameName|query|string| 否 ||车架名称|
|tagSn|query|number| 否 ||标签器ID|
|token|header|string| 否 ||none|

> 返回示例

> 200 Response

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

# tag-标识器

## GET 获取标识器状态

GET /api/tag/v1/status

### 请求参数

|名称|位置|类型|必选|中文名|说明|
|---|---|---|---|---|---|
|stationId|query|integer| 是 ||工位id|
|tagType|query|integer| 否 ||标识器类型，0-高温标识器（铁包）/1-常温标识器（车架）|
|token|header|string| 否 ||none|

> 返回示例

```json
{
  "status": 0,
  "resMsg": "success",
  "data": {
    "items": [
      {
        "rangeType": "A",
        "rangeValue": ">360",
        "rangeData": [
          {
            "boundName": "铁包1号",
            "tagSn": 10086,
            "tagType": 0,
            "tagLastPulse": 366,
            "tagLastRecordTime": 1754017140000
          },
          {
            "boundName": "铁包1号",
            "tagSn": 10087,
            "tagType": 0,
            "tagLastPulse": 387,
            "tagLastRecordTime": 1754017140000
          }
        ]
      },
      {
        "rangeType": "B",
        "rangeValue": ">330",
        "rangeData": [
          {
            "boundName": "铁包2号",
            "tagSn": 10088,
            "tagType": 0,
            "tagLastPulse": 357,
            "tagLastRecordTime": 1754017140000
          },
          {
            "boundName": "铁包2号",
            "tagSn": 10089,
            "tagType": 0,
            "tagLastPulse": 345,
            "tagLastRecordTime": 1754017140000
          }
        ]
      },
      {
        "rangeType": "C",
        "rangeValue": ">300",
        "rangeData": []
      },
      {
        "rangeType": "D",
        "rangeValue": "<300",
        "rangeData": []
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

```json
{
  "status": 9000005,
  "resMsg": "参数异常,未找到工位",
  "data": {}
}
```

```json
{
  "status": 4000001,
  "resMsg": "工位【{0}】，未开启监控标签状态",
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
|»» items|[object]|true|none|高温标识器状态数据|none|
|»»» rangeType|string|true|none|范围类型|状态范围类型区分ABCD四级|
|»»» rangeValue|string|true|none|范围值|展示再改范围应达到的值|
|»»» rangeData|[object]|false|none|范围内的标签数据|none|
|»»»» boundName|string|true|none|铁包/车架名称|none|
|»»»» tagSn|integer|true|none|标识器ID|none|
|»»»» tagType|integer|true|none|标识器类型|0-高温标识器（铁包）/1-常温标识器（车架）|
|»»»» tagLastPulse|integer|true|none|标识器最新记录信号值|none|
|»»»» tagLastRecordTime|number|true|none|标识器最新记录时间|none|

## GET 获取漏读列表

GET /api/tag/v1/miss/list

### 请求参数

|名称|位置|类型|必选|中文名|说明|
|---|---|---|---|---|---|
|boundType|query|number| 否 ||0-铁包 1-车架|
|boundId|query|number| 否 ||铁包/车架id|
|page|query|integer| 是 ||none|
|pageSize|query|integer| 是 ||none|
|token|header|string| 否 ||none|

> 返回示例

```json
{
  "status": 0,
  "resMsg": "成功",
  "data": {
    "total": 17,
    "items": [
      {
        "id": 18,
        "boundType": 1,
        "boundId": 1,
        "boundName": "车架1号",
        "preStationLabel": "工位 2",
        "preStationCode": "2",
        "preStartTime": 1767855717119,
        "afterStationLabel": "工位 6",
        "afterStationCode": "6",
        "afterStartTime": 1767855718374,
        "missPaths": [
          [
            {
              "id": 2,
              "label": "工位 2",
              "code": "2"
            },
            {
              "id": 3,
              "label": "工位 3",
              "code": "3"
            },
            {
              "id": 4,
              "label": "工位 4",
              "code": "4"
            },
            {
              "id": 5,
              "label": "工位 5",
              "code": "5"
            },
            {
              "id": 6,
              "label": "工位 6",
              "code": "6"
            }
          ],
          [
            {
              "id": 2,
              "label": "工位 2",
              "code": "2"
            },
            {
              "id": 3,
              "label": "工位 3",
              "code": "3"
            },
            {
              "id": 4,
              "label": "工位 4",
              "code": "4"
            },
            {
              "id": 6,
              "label": "工位 6",
              "code": "6"
            }
          ],
          [
            {
              "id": 2,
              "label": "工位 2",
              "code": "2"
            },
            {
              "id": 3,
              "label": "工位 3",
              "code": "3"
            },
            {
              "id": 5,
              "label": "工位 5",
              "code": "5"
            },
            {
              "id": 6,
              "label": "工位 6",
              "code": "6"
            }
          ],
          [
            {
              "id": 2,
              "label": "工位 2",
              "code": "2"
            },
            {
              "id": 3,
              "label": "工位 3",
              "code": "3"
            },
            {
              "id": 6,
              "label": "工位 6",
              "code": "6"
            }
          ],
          [
            {
              "id": 2,
              "label": "工位 2",
              "code": "2"
            },
            {
              "id": 4,
              "label": "工位 4",
              "code": "4"
            },
            {
              "id": 5,
              "label": "工位 5",
              "code": "5"
            },
            {
              "id": 6,
              "label": "工位 6",
              "code": "6"
            }
          ],
          [
            {
              "id": 2,
              "label": "工位 2",
              "code": "2"
            },
            {
              "id": 4,
              "label": "工位 4",
              "code": "4"
            },
            {
              "id": 6,
              "label": "工位 6",
              "code": "6"
            }
          ]
        ],
        "missPathsStations": [
          {
            "id": 4,
            "label": "工位 4",
            "code": "4"
          },
          {
            "id": 3,
            "label": "工位 3",
            "code": "3"
          },
          {
            "id": 5,
            "label": "工位 5",
            "code": "5"
          }
        ]
      },
      {
        "id": 17,
        "boundType": 1,
        "boundId": 1,
        "boundName": "车架1号",
        "preStationLabel": "工位 6",
        "preStationCode": "6",
        "preStartTime": 1767855704720,
        "afterStationLabel": "工位 2",
        "afterStationCode": "2",
        "afterStartTime": 1767855707099,
        "missPaths": [
          [
            {
              "id": 6,
              "label": "工位 6",
              "code": "6"
            },
            {
              "id": 3,
              "label": "工位 3",
              "code": "3"
            },
            {
              "id": 2,
              "label": "工位 2",
              "code": "2"
            }
          ],
          [
            {
              "id": 6,
              "label": "工位 6",
              "code": "6"
            },
            {
              "id": 4,
              "label": "工位 4",
              "code": "4"
            },
            {
              "id": 2,
              "label": "工位 2",
              "code": "2"
            }
          ],
          [
            {
              "id": 6,
              "label": "工位 6",
              "code": "6"
            },
            {
              "id": 4,
              "label": "工位 4",
              "code": "4"
            },
            {
              "id": 3,
              "label": "工位 3",
              "code": "3"
            },
            {
              "id": 2,
              "label": "工位 2",
              "code": "2"
            }
          ],
          [
            {
              "id": 6,
              "label": "工位 6",
              "code": "6"
            },
            {
              "id": 5,
              "label": "工位 5",
              "code": "5"
            },
            {
              "id": 3,
              "label": "工位 3",
              "code": "3"
            },
            {
              "id": 2,
              "label": "工位 2",
              "code": "2"
            }
          ],
          [
            {
              "id": 6,
              "label": "工位 6",
              "code": "6"
            },
            {
              "id": 5,
              "label": "工位 5",
              "code": "5"
            },
            {
              "id": 4,
              "label": "工位 4",
              "code": "4"
            },
            {
              "id": 2,
              "label": "工位 2",
              "code": "2"
            }
          ],
          [
            {
              "id": 6,
              "label": "工位 6",
              "code": "6"
            },
            {
              "id": 5,
              "label": "工位 5",
              "code": "5"
            },
            {
              "id": 4,
              "label": "工位 4",
              "code": "4"
            },
            {
              "id": 3,
              "label": "工位 3",
              "code": "3"
            },
            {
              "id": 2,
              "label": "工位 2",
              "code": "2"
            }
          ]
        ],
        "missPathsStations": [
          {
            "id": 4,
            "label": "工位 4",
            "code": "4"
          },
          {
            "id": 3,
            "label": "工位 3",
            "code": "3"
          },
          {
            "id": 5,
            "label": "工位 5",
            "code": "5"
          }
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

```json
{
  "status": 0,
  "resMsg": "成功",
  "data": {
    "total": 0,
    "items": []
  }
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
|»» items|[object]|false|none||none|
|»»» boundType|integer|true|none|类型|0-高温标识器 1-常温标识器|
|»»» boundId|integer|true|none|铁包/车架ID|none|
|»»» boundName|string|true|none|标识器绑定名称|铁包/车架名称|
|»»» preStationLabel|string|true|none|上一个工位名称|none|
|»»» preStationCode|string|true|none|上一个工位代号|该标识器经过这个工位的开始时间|
|»»» preStartTime|integer|true|none|上一个工位时间|none|
|»»» afterStationLabel|string|true|none|下一个工位名称|none|
|»»» afterStationCode|string|true|none|下一个工位代号|该标识器经过这个工位的开始时间|
|»»» afterStartTime|integer|true|none|下一个工位时间|none|
|»»» missPaths|[array]|true|none|漏读工位路径列表|可能的所有漏读路径|
|»»»» id|number|true|none|工位id|none|
|»»»» label|string|true|none|工位名称|none|
|»»»» code|string|true|none|工位代号|none|
|» missPathsStations|[object]|true|none|漏读工位列表|可能的所有漏读工位|
|»» id|number|true|none|工位id|none|
|»» label|string|true|none|工位名称|none|
|»» code|string|true|none|工位代号|none|

## GET 获取串读列表

GET /api/tag/v1/chaos/list

该串读列表记录的是同一个标签在相同的时间段内被2个工位雷达同时扫描到。
会反馈两个工位雷达扫描到的时间节点，以及标签本身信息。

### 请求参数

|名称|位置|类型|必选|中文名|说明|
|---|---|---|---|---|---|
|tagSn|query|number| 否 ||标识器id|
|page|query|integer| 是 ||none|
|pageSize|query|integer| 是 ||none|
|token|header|string| 否 ||none|

> 返回示例

```json
{
  "status": 0,
  "resMsg": "成功",
  "data": {
    "total": 6,
    "items": [
      {
        "id": 20,
        "tagType": 1,
        "tagSn": 5283351,
        "tagBoundName": "车架1号",
        "chaosRadarDataGroupId": 88,
        "chaosStationLabel": "工位 6",
        "normalRadarDataGroupId": 87,
        "normalStationLabel": "工位 2",
        "normalStartTime": 1767858477091,
        "normalEndTime": 1767858479664,
        "chaosPoint": 1767858479119,
        "updateTime": 1767858482000
      },
      {
        "id": 19,
        "tagType": 1,
        "tagSn": 5283351,
        "tagBoundName": "车架1号",
        "chaosRadarDataGroupId": 84,
        "chaosStationLabel": "工位 2",
        "normalRadarDataGroupId": 83,
        "normalStationLabel": "工位 6",
        "normalStartTime": 1767858465017,
        "normalEndTime": 1767858467738,
        "chaosPoint": 1767858467430,
        "updateTime": 1767858468000
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

```json
{
  "status": 0,
  "resMsg": "成功",
  "data": {
    "total": 0,
    "items": []
  }
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
|»» items|[object]|false|none||none|
|»»» id|integer|true|none|记录id|none|
|»»» tagType|integer|true|none|标识器类型|0-高温标识器 1-常温标识器|
|»»» tagSn|integer|true|none|标识器ID|none|
|»»» tagBoundName|string|true|none|标识器绑定名称|铁包/车架名称|
|»»» chaosRadarDataGroupId|integer|true|none|串读雷达数据组id|none|
|»»» chaosStationLabel|string|true|none|串读工位名称|none|
|»»» normalRadarDataGroupId|integer|true|none|应读雷达数据组id|none|
|»»» normalStationLabel|string|true|none|应读工位名称|none|
|»»» normalStartTime|integer|true|none|应读工位读取开始时间|毫秒时间戳|
|»»» normalEndTime|integer|true|none|应读工位读取结束时间|毫秒时间戳|
|»»» chaosPoint|integer|true|none|串读时间交错点|毫秒时间戳|
|»»» updateTime|integer|true|none||none|

# view-图表

## GET 获取标识器寿命图

GET /api/view/v1/tag/lifeChart

### 请求参数

|名称|位置|类型|必选|中文名|说明|
|---|---|---|---|---|---|
|stationLabel|query|string| 否 ||工位名称|
|tagType|query|integer| 否 ||标识器类型，0-高温标识器（铁包）/1-常温标识器（车架）|
|tagSn|query|number| 否 ||标识器id|
|tagBoundName|query|string| 否 ||铁包/车架名称|
|startTime|query|number| 否 ||开始时间（毫秒时间戳，但只需要到日）|
|endTime|query|number| 否 ||结束时间（毫秒时间戳，但只需要到日）|
|token|header|string| 否 ||none|

> 返回示例

```json
{
  "status": 0,
  "resMsg": "成功",
  "data": {
    "xaxis": [
      "2025-12-27",
      "2025-12-28",
      "2025-12-29",
      "2025-12-30"
    ],
    "series": [
      {
        "tagBoundName": "车架1号",
        "data": [
          367,
          367,
          366,
          367
        ],
        "tagSn": 5283351,
        "stationLabel": "新工位 2612",
        "tagType": 1,
        "type": "line"
      },
      {
        "tagBoundName": "车架1号",
        "data": [
          365,
          null,
          null,
          null
        ],
        "tagSn": 5283351,
        "stationLabel": "新工位 7104",
        "tagType": 1,
        "type": "line"
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
|»» xaxis|[string]|false|none|日期列表|none|
|»» series|[object]|false|none|数据列表|none|
|»»» tagBoundName|string|true|none|铁包/车架名|none|
|»»» data|[integer]|true|none|对应日期pulse数值|none|
|»»» tagSn|integer|true|none|标签id|none|
|»»» stationLabel|string|true|none|工位名称|none|
|»»» tagType|integer|true|none|标签类型|0-高温标识器（铁包）/1-常温标识器（车架）|
|»»» type|string|true|none|echarts节点类型|这里固定line|

## GET 获取铁包或车架路径图

GET /api/view/v1/path/{type}

## 实现逻辑说明
  1. 纵坐标区分：
    - 标签器数据点：工位代号 + 100
    - 铁包/车架数据点：工位代号 + 110
    - 这样可以在图表上区分标签器轨迹和整体轨迹
  2. 数据合并：
    - 为每个标签器创建一个独立的 series（折线）
    - 所有标签器的数据点合并后创建铁包/车架的整体 series
  3. Tooltip 信息：
    - 开始时间、结束时间
    - 工位名称、工位代号
    - 标签 SN
    - 读取次数
    - 信号值
  4. Y 轴数据：
    - 提供工位代号、工位名称的映射关系
    - 按工位代号排序（小的在起点，大的在终点）

## 前端 Echarts 使用建议

  前端可以这样配置 echarts：

  ```
  const option = {
    title: { text: '铁包/车架运行轨迹' },
    tooltip: {
      trigger: 'item',
      formatter: function(params) {
        const data = params.data.tooltipData;
        return `
          系列: ${params.seriesName}<br/>
          工位: ${data.stationLabel} (${data.stationCode})<br/>
          标签SN: ${data.tagSn}<br/>
          开始时间: ${data.startTime}<br/>
          结束时间: ${data.endTime}<br/>
          读取次数: ${data.readCount}<br/>
          信号值: ${data.signalValue}
        `;
      }
    },
    xAxis: {
      type: 'time',
      name: '时间'
    },
    yAxis: {
      type: 'value',
      name: '工位',
      axisLabel: {
        formatter: function(value) {
          // 使用 yAxis 数据映射工位名称
          const station = response.data.yAxis.find(s =>
            Math.abs(s.value - (value - 100)) < 0.1 ||
            Math.abs(s.value - (value - 110)) < 0.1
          );
          return station ? station.label : value;
        }
      }
    },
    series: response.data.series.map(s => ({
      ...s,
      data: s.data.map(d => [d.timestamp, d.value, d])
    }))
  };
```

### 请求参数

|名称|位置|类型|必选|中文名|说明|
|---|---|---|---|---|---|
|type|path|integer| 是 ||查询类型。0-铁包 1-车架|
|boundName|query|string| 是 ||铁包/车架名称|
|startTime|query|number| 是 ||开始时间（毫秒时间戳，精度到秒）|
|endTime|query|number| 是 ||结束时间（毫秒时间戳，精度到秒）|
|token|header|string| 否 ||none|

> 返回示例

```json
{
  "status": 0,
  "resMsg": "成功",
  "data": {
    "series": [
      {
        "name": "标签器-5283351",
        "type": "line",
        "data": [
          {
            "timestamp": 1767065374537,
            "value": 102,
            "tooltipData": {
              "startTime": "2025-12-30 11:29:34",
              "endTime": "2025-12-30 11:29:36",
              "stationLabel": "工位 A-2",
              "stationCode": "2",
              "tagSn": 5283351,
              "readCount": 21,
              "signalValue": 366
            }
          },
          {
            "timestamp": 1767065382580,
            "value": 102,
            "tooltipData": {
              "startTime": "2025-12-30 11:29:42",
              "endTime": "2025-12-30 11:29:44",
              "stationLabel": "工位 A-2",
              "stationCode": "2",
              "tagSn": 5283351,
              "readCount": 22,
              "signalValue": 366
            }
          }
        ],
        "smooth": true,
        "symbol": "circle",
        "symbolSize": 6
      },
      {
        "name": "车架1号",
        "type": "line",
        "data": [
          {
            "timestamp": 1767065374537,
            "value": 112,
            "tooltipData": {
              "startTime": "2025-12-30 11:29:34",
              "endTime": "2025-12-30 11:29:36",
              "stationLabel": "工位 A-2",
              "stationCode": "2",
              "tagSn": 5283351,
              "readCount": 21,
              "signalValue": 366
            }
          },
          {
            "timestamp": 1767065382580,
            "value": 112,
            "tooltipData": {
              "startTime": "2025-12-30 11:29:42",
              "endTime": "2025-12-30 11:29:44",
              "stationLabel": "工位 A-2",
              "stationCode": "2",
              "tagSn": 5283351,
              "readCount": 22,
              "signalValue": 366
            }
          }
        ],
        "smooth": true,
        "symbol": "circle",
        "symbolSize": 6
      }
    ],
    "yaxis": [
      {
        "code": "1",
        "label": "工位 A-1",
        "value": 1
      },
      {
        "code": "2",
        "label": "工位 A-2",
        "value": 2
      },
      {
        "code": "3",
        "label": "工位 A-3",
        "value": 3
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

```json
{
  "status": 9000004,
  "resMsg": "查询异常,{0}",
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
|»» series|[object]|true|none|数据实体|none|
|»»» name|string|true|none|图例名称|none|
|»»» type|string|true|none|连线方式|固定line|
|»»» data|[object]|true|none|数据点|none|
|»»»» timestamp|integer|true|none|点位时间|none|
|»»»» value|integer|true|none|y坐标|none|
|»»»» tooltipData|object|true|none|数据点详情|用于鼠标移入后的弹出提示|
|»»»»» startTime|string|true|none|开始时间|标签器首次被读取时间|
|»»»»» endTime|string|true|none|结束时间|标签器读取完毕时间|
|»»»»» stationLabel|string|true|none|读取工位名称|none|
|»»»»» stationCode|string|true|none|读取工位代号|none|
|»»»»» tagSn|integer|true|none|标签器id|none|
|»»»»» readCount|integer|true|none|读取次数|none|
|»»»»» pulseValue|integer|true|none|信号值|none|
|»»» smooth|boolean|true|none|是否平滑曲线|固定true，前端可无视，自行定义|
|»»» symbol|string|true|none|标记形状|默认circle，前端可无视，自行定义|
|»»» symbolSize|integer|true|none|标记大小|默认6，前端可无视，自行定义|
|»» yaxis|[object]|true|none|y轴配置数据|none|
|»»» code|string|true|none|工位代号|none|
|»»» label|string|true|none|工位名称|none|
|»»» value|integer|true|none||none|

# Export-数据导出

## GET 查询导出记录列表

GET /api/export/v1/records

当用户点击导出雷达原始数据，或雷达数据组时，会生成一条导出记录表，系统将在后台执行导出工作。
当后台执行完成后，刷新列表即可看到导出状态，当状态为成功时，代表可以下载，执行下载导出文件接口即可。

注：导出缓存将长期存在，若需要释放空间，则可以调用批量删除导出记录接口，该接口在删除记录时，会一并删除本地缓存文件。

### 请求参数

|名称|位置|类型|必选|中文名|说明|
|---|---|---|---|---|---|
|type|query|integer| 否 ||0-原始数据/1-数据组|
|status|query|integer| 否 ||0-处理中/1-成功/2-失败|
|page|query|integer| 是 ||none|
|pageSize|query|integer| 是 ||none|
|token|header|string| 否 ||none|

> 返回示例

```json
{
  "status": 0,
  "resMsg": "成功",
  "data": {
    "total": 1,
    "items": [
      {
        "id": 1,
        "type": 0,
        "status": 1,
        "fileName": "radar_data_原始数据_20260109_173111.xlsx",
        "fileSize": 76587,
        "createTime": 1767951071000,
        "updateTime": 1767951072000
      }
    ]
  }
}
```

```json
{
  "status": 0,
  "resMsg": "成功",
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
|»» items|[object]|false|none||none|
|»»» id|integer|true|none|表id|none|
|»»» type|integer|true|none|导出类型|0-雷达原始数据 1-雷达数据组|
|»»» status|integer|true|none|状态|0-处理中 1-成功 2-失败|
|»»» fileName|string|false|none|导出文件名|none|
|»»» fileSize|integer|false|none|导出文件大小|字节|
|»»» createTime|integer|true|none||none|
|»»» updateTime|integer|true|none||none|

## DELETE 批量删除导出记录

DELETE /api/export/v1/records

会同时删除数据库记录和对应的Excel文件缓存

> Body 请求参数

```json
{
  "ids": [
    0
  ]
}
```

### 请求参数

|名称|位置|类型|必选|中文名|说明|
|---|---|---|---|---|---|
|token|header|string| 否 ||none|
|body|body|object| 是 ||none|
|» ids|body|[integer]| 是 | 导出记录id数组|none|

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
  "status": 9000003,
  "resMsg": "删除失败，{0}",
  "data": {}
}
```

```json
{
  "status": 9009999,
  "resMsg": "未知错误，{0}",
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

## POST 导出雷达原始数据

POST /api/export/v1/radar-data

> Body 请求参数

```json
{
  "radarHost": "string",
  "radarPort": 0,
  "radarAddress": 0,
  "startTime": 0,
  "endTime": 0,
  "stationLabel": "string",
  "tagType": 0,
  "tagSn": 0,
  "tagBoundName": "string"
}
```

### 请求参数

|名称|位置|类型|必选|中文名|说明|
|---|---|---|---|---|---|
|token|header|string| 否 ||none|
|body|body|object| 是 ||none|
|» radarHost|body|string| 是 | 雷达ip|none|
|» radarPort|body|integer| 是 | 雷达端口|none|
|» radarAddress|body|integer| 是 | 雷达地址|none|
|» startTime|body|number| 是 | 开始时间戳|毫秒时间戳，与结束时间差不超过24小时|
|» endTime|body|number| 是 | 结束时间戳|毫秒时间戳，与开始时间差不超过24小时|
|» stationLabel|body|string| 否 | 工位名称|精确搜索|
|» tagType|body|integer| 否 | 标签类型|0-高温标识器，1-常温标识器|
|» tagSn|body|integer| 否 | 标识器ID|none|
|» tagBoundName|body|string| 否 | 绑定名称|精确搜索，铁包/车架名称|

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
  "status": 9000005,
  "resMsg": "参数异常，{0}",
  "data": {}
}
```

```json
{
  "status": 9009999,
  "resMsg": "未知错误，{0}",
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

## POST 导出雷达数据组

POST /api/export/v1/radar-data-group

> Body 请求参数

```json
{
  "startTime": 0,
  "endTime": 0,
  "stationLabel": "string",
  "tagType": 0,
  "tagSn": 0,
  "tagBoundName": "string"
}
```

### 请求参数

|名称|位置|类型|必选|中文名|说明|
|---|---|---|---|---|---|
|token|header|string| 否 ||none|
|body|body|object| 是 ||none|
|» startTime|body|number| 是 | 开始时间戳|毫秒时间戳，与结束时间差不超过24小时|
|» endTime|body|number| 是 | 结束时间戳|毫秒时间戳，与开始时间差不超过24小时|
|» stationLabel|body|string| 否 | 工位名称|精确搜索|
|» tagType|body|integer| 否 | 标签类型|0-高温标识器，1-常温标识器|
|» tagSn|body|integer| 否 | 标识器ID|none|
|» tagBoundName|body|string| 否 | 绑定名称|精确搜索，铁包/车架名称|

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
  "status": 9000005,
  "resMsg": "参数异常，{0}",
  "data": {}
}
```

```json
{
  "status": 9009999,
  "resMsg": "未知错误，{0}",
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

## GET 下载导出文件

GET /api/export/v1/download/{id}

### 请求参数

|名称|位置|类型|必选|中文名|说明|
|---|---|---|---|---|---|
|id|path|integer| 是 ||导出记录id|
|token|header|string| 否 ||none|

> 返回示例

> 200 Response

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|none|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|none|None|

### 返回数据结构

# config-系统配置

## GET 获取系统配置

GET /api/config/v1/all

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
    "DATA_THINNING": "10",
    "STORAGE_CYCLE": "30",
    "SYSTEM_TITLE": "电磁微声平台"
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
|»» DATA_THINNING|string|true|none|数据抽稀指数|1代表不抽稀，100代表抽稀100倍|
|»» STORAGE_CYCLE|string|true|none|数据存储周期|7代表存储7天，90代表存储90天|
|»» SYSTEM_TITLE|string|true|none|系统展示标题|none|

## PUT 修改系统配置

PUT /api/config/v1/all

> Body 请求参数

```json
{
  "DATA_THINNING": "15",
  "STORAGE_CYCLE": "60",
  "SYSTEM_TITLE": "系统标题"
}
```

### 请求参数

|名称|位置|类型|必选|中文名|说明|
|---|---|---|---|---|---|
|token|header|string| 否 ||none|
|body|body|object| 否 ||none|
|» DATA_THINNING|body|string| 是 | 数据抽稀指数|1代表不抽稀，100代表抽稀100倍，要求非负整型，输入1~100字符串形式的数字|
|» STORAGE_CYCLE|body|string| 是 | 数据存储周期|7代表存储7天，90代表存储90天，要求非负整型，要求输入7~90字符串形式的数字|
|» SYSTEM_TITLE|body|string| 是 | 系统展示标题|不超过50个字符|

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

# util-通用查询

## GET 获取所有铁包或车架名称列表

GET /api/util/v1/boundList

### 请求参数

|名称|位置|类型|必选|中文名|说明|
|---|---|---|---|---|---|
|type|query|integer| 否 ||0-铁包/1-车架|
|token|header|string| 否 ||none|

> 返回示例

```json
{
  "status": 0,
  "resMsg": "成功",
  "data": {
    "boundList": [
      {
        "id": 1,
        "type": 1,
        "boundName": "车架1号"
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
|» data|object|true|none||none|
|»» boundList|[object]|true|none|铁包或车架列表|none|
|»»» id|integer|false|none|铁包或车架id|none|
|»»» type|integer|false|none|类型|0-铁包 1-车架|
|»»» boundName|string|false|none|铁包或车架名称|none|

## GET 获取所有标识器

GET /api/util/v1/tagList

### 请求参数

|名称|位置|类型|必选|中文名|说明|
|---|---|---|---|---|---|
|type|query|integer| 否 ||0-高温标签器/1-常温标签器|
|token|header|string| 否 ||none|

> 返回示例

```json
{
  "status": 0,
  "resMsg": "成功",
  "data": {
    "tagList": [
      {
        "tagSn": 5283351,
        "tagType": 1,
        "tagBoundName": "车架1号"
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
|» data|object|true|none||none|
|»» tagList|[object]|true|none|标识器列表|none|
|»»» tagSn|integer|false|none|标识器ID|none|
|»»» tagType|integer|false|none|标识器类型|0-高温标识器 1-常温标识器|
|»»» tagBoundName|string|false|none|标识器绑定名称|type为0时，则代表绑定的铁包名称，为1时代表绑定的车架名称|

## GET 获取所有工位

GET /api/util/v1/stationList

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
    "stationList": [
      {
        "id": 1,
        "label": "工位 1",
        "code": "1"
      },
      {
        "id": 2,
        "label": "工位 2",
        "code": "2"
      },
      {
        "id": 3,
        "label": "工位 3",
        "code": "3"
      },
      {
        "id": 4,
        "label": "工位 4",
        "code": "4"
      },
      {
        "id": 5,
        "label": "工位 5",
        "code": "5"
      },
      {
        "id": 6,
        "label": "工位 6",
        "code": "6"
      },
      {
        "id": 7,
        "label": "工位 7",
        "code": "7"
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
|» data|object|true|none||none|
|»» stationList|[object]|true|none|工位列表|none|
|»»» id|integer|true|none|工位id|none|
|»»» label|string|true|none|工位名称|none|
|»»» code|string|true|none|工位代号|none|

## GET 获取工位图谱

GET /api/util/v1/stationGraph

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
    "stationGraph": [
      {
        "id": 1,
        "label": "工位 1",
        "code": 1,
        "neighbors": [
          {
            "id": 2,
            "label": "工位 2",
            "code": 2
          }
        ]
      },
      {
        "id": 2,
        "label": "工位 2",
        "code": 2,
        "neighbors": [
          {
            "id": 1,
            "label": "工位 1",
            "code": 1
          },
          {
            "id": 3,
            "label": "工位 3",
            "code": 3
          },
          {
            "id": 4,
            "label": "工位 4",
            "code": 4
          }
        ]
      },
      {
        "id": 3,
        "label": "工位 3",
        "code": 3,
        "neighbors": [
          {
            "id": 2,
            "label": "工位 2",
            "code": 2
          },
          {
            "id": 4,
            "label": "工位 4",
            "code": 4
          },
          {
            "id": 5,
            "label": "工位 5",
            "code": 5
          },
          {
            "id": 6,
            "label": "工位 6",
            "code": 6
          }
        ]
      },
      {
        "id": 4,
        "label": "工位 4",
        "code": 4,
        "neighbors": [
          {
            "id": 2,
            "label": "工位 2",
            "code": 2
          },
          {
            "id": 3,
            "label": "工位 3",
            "code": 3
          },
          {
            "id": 5,
            "label": "工位 5",
            "code": 5
          },
          {
            "id": 6,
            "label": "工位 6",
            "code": 6
          }
        ]
      },
      {
        "id": 5,
        "label": "工位 5",
        "code": 5,
        "neighbors": [
          {
            "id": 3,
            "label": "工位 3",
            "code": 3
          },
          {
            "id": 4,
            "label": "工位 4",
            "code": 4
          },
          {
            "id": 6,
            "label": "工位 6",
            "code": 6
          }
        ]
      },
      {
        "id": 6,
        "label": "工位 6",
        "code": 6,
        "neighbors": [
          {
            "id": 3,
            "label": "工位 3",
            "code": 3
          },
          {
            "id": 4,
            "label": "工位 4",
            "code": 4
          },
          {
            "id": 5,
            "label": "工位 5",
            "code": 5
          },
          {
            "id": 7,
            "label": "工位 7",
            "code": 7
          }
        ]
      },
      {
        "id": 7,
        "label": "工位 7",
        "code": 7,
        "neighbors": [
          {
            "id": 6,
            "label": "工位 6",
            "code": 6
          }
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
|» data|object|true|none||none|
|»» stationGraph|[object]|true|none|工位图|none|
|»»» id|integer|true|none|工位id|none|
|»»» label|string|true|none|工位名称|none|
|»»» code|integer|true|none|工位代号|none|
|»»» neighbors|[object]|true|none|相邻工位|none|
|»»»» id|integer|true|none||none|
|»»»» label|string|true|none||none|
|»»»» code|integer|true|none||none|

# 数据模型

