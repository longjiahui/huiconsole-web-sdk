# HUI Console Web SDK

用于和 `HUIConsole`后管系统进行通信。

```js
import { HUIConsole } from '@anfo/huiconsole-web-sdk'

let huiconsole = new HUIConsole
huiconsole.getToken().then(token=>utils.setLocal('token', token))

/*
服务器可以准备一个login接口，将token传入
服务端使用token 调用huiconsole后台接口 /api/user/decode 可以得到用户信息
根据用户信息 管理接口权限
*/

export default huiconsole
```