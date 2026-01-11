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

# view-图表

## GET 获取标识器寿命图

GET /api/view/v1/tag/lifeChart

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|stationLabel|query|string| 否 |工位名称|
|tagType|query|integer| 否 |标识器类型，0-高温标识器（铁包）/1-常温标识器（车架）|
|tagSn|query|number| 否 |标识器id|
|tagBoundName|query|string| 否 |铁包/车架名称|
|startTime|query|number| 否 |开始时间（毫秒时间戳，但只需要到日）|
|endTime|query|number| 否 |结束时间（毫秒时间戳，但只需要到日）|
|token|header|string| 否 |none|

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

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|type|path|integer| 是 |查询类型。0-铁包 1-车架|
|boundName|query|string| 是 |铁包/车架名称|
|startTime|query|number| 是 |开始时间（毫秒时间戳，精度到秒）|
|endTime|query|number| 是 |结束时间（毫秒时间戳，精度到秒）|
|token|header|string| 否 |none|

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

# util-通用查询

## GET 获取所有铁包或车架名称列表

GET /api/util/v1/boundList

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|type|query|integer| 否 |0-铁包/1-车架|
|token|header|string| 否 |none|

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

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|type|query|integer| 否 |0-高温标签器/1-常温标签器|
|token|header|string| 否 |none|

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

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|token|header|string| 否 |none|

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

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|token|header|string| 否 |none|

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

