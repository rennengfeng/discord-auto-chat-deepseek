# DiscordBot-deepseek

调用deepseek-API,智能回复。

## 特性

- 通过对最新消息进行识别分析，自动生成回复消息
- 自动识别频道冷却时间

## 前提条件

- Node.js (version 14 or higher)
- npm (Node package manager)

## 安装

1. **克隆仓库** (或下载脚本)):
    ```bash
    git clone https://github.com/recitativonika/Discord-auto-chat-js.git
    cd Discord-auto-chat-js
    ```

2. **安装所需的依赖项:**:
    ```bash
    npm install
    ```

3. **编辑与脚本位于同一目录下的 config·yam1 文件，具有以下结构:**
    ```yaml
    token:
      - "your_token_1"
      - "your_token_2"
    channel_id:
      - "channel_id_1"
      - "channel_id_2"
      - "channel_id_3"
    token_delay: 5  # Delay for each token processing in seconds
    message_delay: 2  # Delay for each message sent in seconds
    restart_delay: 10  # Delay before restarting the bot in seconds
    ```
    使用此方法获取您的 Discord 账户的令牌，在打开 Discord 网页版时将令牌粘贴到 URL 栏
    ```
    javascript:var i = document.createElement('iframe');i.onload = function(){var localStorage = i.contentWindow.localStorage;prompt('Your discord token', localStorage.getItem('token').replace(/["]+/g, ''));};document.body.appendChild(i);
    ```
    注意: javascript:字词可能会被浏览器自动删除，您可以手动输入。

4. **Edit the `api.key` 文件** 调用你的deepseek-api.

## 使用方法

1. **运行脚本:**:
    ```bash
    npm start
    ```
    or
    ```bash
    node index.js
    ```
2. **监控终端输出:**:
    - 机器人将打印彩色消息，显示消息发送的状态。
    - 如果出现错误，它们将以红色显示。

3. **自定义你的配置:**:
    - 你可以修改 config.yam1 文件来添加更多token、频道 ID。


## 提示

- 确保您的机器人被邀请到您想要发送消息的频道。
- 确保您拥有在这些频道中发送消息的必要权限。

## 许可证

本项目根据 MIT 许可证授权。更多详情请参阅 LICENSE 文件。.

## 致谢

- 受 Discord API 文档启发。
- 使用此脚本违反 Discord 服务条款，可能会导致您的账号永久封禁。
