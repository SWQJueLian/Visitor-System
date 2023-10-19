# vistor-frontend
基于Vue3、Vant4开发

必须对接企业微信内部H5应用，因为会自动进行oauth授权并获取用户信息。

**API文档：https://apifox.com/apidoc/shared-f00a58b0-0a96-452e-b4f6-da27bca06835**

## 添加邀请

1. 支持车牌号键盘（已独立组件发布）
2. 发送邀请后后端接受并入库，使用celery异步发送短信通知访客。

## 查看邀请

1. 查看、模糊搜索邀请。
2. 显示状态：已到访、已过期、未到访
3. 下拉刷新。
4. 瀑布流上拉加载更多。

## 修改邀请

1. 支持修改邀请信息，只能修改未到期的邀请。

## 邀请链接

访客通过该链接可查看【二维码】，通过【二维码】进入公司园区。

## 门卫扫码

扫码后，可查看访客详情信息，点击【已到访】，向后端触发celery异步任务，发送应用消息通知邀请人。
![image](https://github.com/SWQJueLian/Visitor-System/assets/2834474/42ef1d60-6bdd-419d-9087-14201018072e)

## 添加邀请
![image](https://github.com/SWQJueLian/Visitor-System/assets/2834474/4eeafac5-a0fc-4bc2-a697-04c4d3d8b801)

![image](https://github.com/SWQJueLian/Visitor-System/assets/2834474/e3604a64-2868-420c-9641-800fc1eca49e)

## 修改邀请
![image](https://github.com/SWQJueLian/Visitor-System/assets/2834474/45f288df-3e66-47a3-9d33-e40d9d47fe5b)

## 查看、搜索邀请
![image](https://github.com/SWQJueLian/Visitor-System/assets/2834474/fc0538bb-8b5a-4cbc-b83f-d9115358b81b)

## 访客链接打开
![image](https://github.com/SWQJueLian/Visitor-System/assets/2834474/f7afd1fb-e154-4ac3-a4a9-58a569cd3169)
## 访客到达（门卫扫码后）
![image](https://github.com/SWQJueLian/Visitor-System/assets/2834474/75787e02-a1c3-46f8-af14-323cca5c8e65)

