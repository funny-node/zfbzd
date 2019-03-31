# zfbzd

**zfbzd -> 支付宝账单**

获取指定时间段支付宝账单详情，可以根据时间区间进行筛选，可以过滤关键字，指定价格区间等

## Install

```bash
$ npm install zfbzd
```

## Usage

```js
const getBills = require('zfbzd')

;(async function() {
  let bills = await getBills({
    startDate: '2018.11.1',
    endDate: '2019.1.3',
  })
})()
```

## getBills(options)

必填项只有 `startDate` 和 `endDate`，用来指定账单时间区间，默认返回指定时间区间内全部记录

* `options` `{Object}`
  * `startDate` `{String}` 必填，账单区间开始时间，格式为 `yyyy.mm.dd` 
  * `endDate` `{String}` 必填，账单区间结束时间，格式为 `yyyy.mm.dd` 
  * `puppeteerOptions` `{Object}` 选填，该值会被传递给 [zfbdl](https://github.com/funny-node/zfbdl#api)，详见其文档
  * `loginMethod` `{String}` 选填，模拟登录方式
    * `'scan'` 默认值，扫码登录
    * `'cookies'` cookies 登录，需要配置 `cookierc.js` 文件，详见 [这里](https://github.com/funny-node/zfbdl#loginbycookiesoptions)
    * `'pwd'` 账号密码登录
  * `username` `{String}` 选填，如果 `loginMethod` 配置了 `'pwd'`，则必须配置此项
  * `password` `{String}` 选填，如果 `loginMethod` 配置了 `'pwd'`，则必须配置此项
  * `turnPageDelay` `{Number}` 选填，翻页时间间隔，默认 `8000` 毫秒（其实默认的翻页时间间隔还得加上 `slowMo`，该值在 `puppeteerOptions` 中配置，默认 `500`）
  * `clickDatePickerDelay` `{Number}` 选填，模拟点击时间选择器的时间间隔，默认 `800` 毫秒（其实默认的点击时间间隔还得加上 `slowMo`，同上）
  * `billStartTime` `{String}` 选填，设置单天账单时间区间起始值，格式 `hh:mm`，默认值 `00:00`
  * `billEndTime` `{String}` 选填，设置单天账单时间区间结束值，格式 `hh:mm`，默认值 `24:00`
  * `minAmount` `{Number}` 选填，设置账单价格区间起始值，默认值 `Number.NEGATIVE_INFINITY`
  * `maxAmount` `{Number}` 选填，设置账单价格区间结束值，默认值 `Number.POSITIVE_INFINITY`
  * `billExcludes` `{Array}` 选填，过滤账单关键字
  * `sorting` `{String}` 选填，设置返回账单排序规则
    * `'desc'` 默认值，倒序返回
    * `'asc'` 正序返回
* return: `<Promise<Array<Object>>>`
  * `date` `{String}` 该条账单日期，格式 `yyyy-mm-dd` 
  * `time` `{String}` 该条账单时间，格式 `hh:mm`
  * `year` `{Number}` 年
  * `month` `{Number}` 月
  * `day` `{Number}` 日
  * `timestamp` `{Number}` 该条消费记录时间戳
  * `amoumt` `{Number}` 该条账单具体账目
  * `outHTML` `{String}` 该条账单 HTML 字符串

## License

MIT

