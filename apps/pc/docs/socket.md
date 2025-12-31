# 建立连接

## 1、连接建立

请求`ws://ip:port/ws`即可建立连接

## 2、注册

当连接建立后，立即向服务器发送数据

```
{
    "type":"REGISTER",
    "sender":"xxxxxxxxxx",
    "token":"xxxxx"
}
```

当注册成功后，服务端将开始向客户端推送数据

## 3、心跳维持

服务端将检测连接活跃性，当超过30s没有接收到客户端心跳或其他请求，将主动断开连接，心跳请求如下：

```
{
    "type":"HEARTBEAT",
    "sender":"xxxxxxxxxx",
    "token":"xxxxx"
}
```

# 客户端请求结构体说明

客户端请求使用JSON格式进行交互，参数如下

- type：请求类型
- sender：请求session，当一个ws新建立时，随机生成一个UUID作为session，ws建立过程中不要更改这个session，直到连接断开
- token：请求token，将平台登录接口返回的token带入，ws服务会强制校验token有效性，若token失效将会主动断开连接

其中`type`类型如下表：| type | 说明 | | --- | --- | | REGISTER | 首次连接时需主动请求注册，注册后服务端将开始向客户端推送数据 | | HEARTBEAT | 维持心跳请求，如10s请求一次 | | GET_ALL_RADAR_STATUS | 主动获取所有雷达状态信息 |

# 服务端响应结构体说明

服务端响应使用JSON格式进行交互，如下：

```
{
    "status": 0,
    "resMsg": "success",
    "type":"RESPONSE",
    "data":"xxxxx",
    "timestamp":"xxxxx"
}
```

- status：响应状态码
- resMsg：响应状态描述
- type：响应类型
- data：响应体对象，随`type`不同而不同
- timestamp：响应时间戳

## 其中`type`类型如下表：

| type                | 说明                                          |
| ------------------- | --------------------------------------------- |
| RESPONSE            | 当客户端请求`REGISTER`和`HEARTBEAT`使用此类型 |
| ALL_RADAR_STATUS    | 服务端推送全部雷达状态信息                    |
| UPDATE_RADAR_STATUS | 服务端推送更新雷达状态信息                    |
| ALARM               | 服务端推送标签告警信息                        |

## 其中`data`随type变化类型如下表：

| type                | 对象              | 说明                               |
| ------------------- | ----------------- | ---------------------------------- |
| RESPONSE            | `object`          | 一般情况下此type类型的data无需关注 |
| ALL_RADAR_STATUS    | `List<RadarInfo>` | `雷达状态信息`列表                 |
| UPDATE_RADAR_STATUS | `RadarInfo`       | `雷达状态信息`对象                 |
| ALARM               | `Alarm`           | `标签告警信息`对象                 |

## RadarInfo

```
//表id
private Integer id;
//雷达ip
private String radarHost;
//雷达端口
private Integer radarPort;
//雷达地址
private Integer radarAddress;
//雷达天线1工位id
private Integer radarAntenna1StationId;
//雷达天线1工位名称
private String radarAntenna1StationLabel;
//雷达天线1工位代号
private String radarAntenna1StationCode;
//雷达天线1工位所属工序
private Integer radarAntenna1ProcessOrder;
//雷达天线2工位id
private Integer radarAntenna2StationId;
//雷达天线2工位名称
private String radarAntenna2StationLabel;
//雷达天线2工位代号
private String radarAntenna2StationCode;
//雷达天线2工位所属工序
private Integer radarAntenna2ProcessOrder;
//雷达状态 -1-offline 0-connecting 1-online 2-warn 3-readTimeout
private Integer radarStatus;
//雷达创建时间戳（毫秒）
private Date inputTime;
//雷达更新时间戳（毫秒）
private Date updateTime;
```

## Alarm

```
// 告警id
private String id;
// 告警类型，目前就2种：radar（雷达告警）/tag（标签告警）
private String type;
// 告警信息
private String message;
// 告警时间戳（毫秒）
private Long time;
```

注：若告警id相同，前端则刷新原id内容并置顶，不要添加新的记录。
