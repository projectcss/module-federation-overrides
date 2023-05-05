## 简介
module-map-overrides 是一个浏览器工具，在使用 MF 开发微前端项目时，能够动态的去替换子应用的地址，这允许开发人员在应用开发期间覆盖单个应用以指向其本地主机，而无需启动包含所有其他应用和后端服务器的本地环境，这样的话开发人员可以在已部署的环境中进行开发和调试，而不必启动本地环境。
## 使用教程
- 在html文件中引入开发工具
```javascript
// Make sure to put this BEFORE any <script type="overridable-modulemap"> elements
<script
  type="text/javascript"
  src="https://cdn.jsdelivr.net/npm/module-map-overrides@1.0.0/dist/index.js"
></script>
// The full UI, including the "trigger" button that pops up the UI.
<module-map-overrides-full></module-map-overrides-full>
```
- 在html添加所有子应用的 MF 配置信息
```javascript
<script type="overridable-modulemap">
    [
        {
            "name": "project1",
            "url": "http://11.138.49.21:8156//remoteEntry.js"
        },
        {
            "name": "project2",
            "url": "http://localhost:5000/remoteEntry.js"
        }
    ]
</script>
```
## 开发测试
- 安装依赖 
```javascript 
pnpm i
```
- 打包
```javascript 
pnpm build
```
- 启动服务
```javascript 
pnpm serve-test
```