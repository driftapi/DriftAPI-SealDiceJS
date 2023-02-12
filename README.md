# DriftAPI-SealDiceJS

## 食用
***
### 1.申请白名单<Badge type="warning" text="并不是必须" />
如果不申请白名单, 你将只能享受到本插件的查询漂流瓶数量和漂流瓶捞取功能, <font color="#ff4d40"><u>_上传漂流瓶的大门不会向你开放_</u></font>

关于`botId`及白名单申请, 本文档应已在[注意事项](/attention/)页写明

#### 申请之后?
首先，你需要用类似[VSCode](https://code.visualstudio.com/)或者[Sublime-Text](https://www.sublimetext.com/)的文本编辑器打开`星之海-漂流瓶-<版本号>.js` 
:::tip tips:
当然，直接用记事本打开是可以的，只是比较乱
:::
接着, 你会在**开头注释的下面**看到一行比较显眼的代码:
```js  :no-line-numbers
const botId = 114514
```
将`114514`替换为你的`botId(骰娘平台账号)`, 然后保存文件, 即可进行下一步: **插件的安装**
### 2.插件的安装<Badge type="tip" text="迫不及die" />
<center>
<Badge type="info" text="以下功能至少需要v1.1.0(20221231)及以上版本的sealdice主程序。" />
</center>

在你的  WebUI侧栏-扩展功能-JS插件  中点击`添加插件`,选择你修改后的`星之海-漂流瓶-<版本号>.js`上传并**重载**插件, 接着就可以使用`.星之海导游手册`指令获取帮助了  
:::warning 注意:
由于涉及userId等专有参数,请不要在  UI界面-指令测试  中测试此插件,如果这样做,插件可能不会正确运行
:::

### 3.插件作者的话<Badge type="danger" text="看看、看看" />
:::info by 流溪:
我知道自己的代码比较屎山, 所以欢迎任何人来修改这个插件, 有任何建议请联系 **我**(<u>1697252962</u>) 或 加入 **骰子屋**(<u>347679389</u>) 进行反馈, 

但是请不要修改插件作者名后分享, 甚至售卖此插件<Badge type="danger" text="此行为将被DriftAPI永久拉黑" />

我将这个插件在[github](https://github.com/driftapi/DriftAPI-SealDiceJS/)上开源。欢迎可以改进此插件的大佬不吝赐建。 
:::
:::danger  声明:
**此插件 <font color="#22c32e">永久免费</font>**  **如果你看到了任何贩卖或牟利行为，请务必向 我(流溪)(<u>1697252962</u>) 举报，或者加入QQ群 骰子屋(<u>347679389</u>) 进行举报。**
:::
