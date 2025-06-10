# DiscordBot-deepseek

调用deepseek-API,智能回复。

## Features

- 通过对最新消息进行识别分析，自动生成回复消息
- 自动识别频道冷却时间

## Prerequisites

- Node.js (version 14 or higher)
- npm (Node package manager)

## Installation

1. **Clone the repository** (or download the script):
    ```bash
    git clone https://github.com/recitativonika/Discord-auto-chat-js.git
    cd Discord-auto-chat-js
    ```

2. **Install the required dependencies**:
    ```bash
    npm install
    ```

3. **Edit  `config.yaml` file** in the same directory as the script with the following structure:
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
    Get the token for your discord account with this, pasten in url bar when you open discord web
    ```
    javascript:var i = document.createElement('iframe');i.onload = function(){var localStorage = i.contentWindow.localStorage;prompt('Your discord token', localStorage.getItem('token').replace(/["]+/g, ''));};document.body.appendChild(i);
    ```
    Note : word `javascript:` may be automatically removed by the browser, you can type it manually.

4. **Edit the `chat.txt` file** with the messages you want the bot to send. Each message should be on a new line.

## Usage

1. **Run the script**:
    ```bash
    npm start
    ```
    or
    ```bash
    node index.js
    ```
2. **Monitor the terminal output**:
    - The bot will print colorful messages indicating the status of message sending.
    - If any errors occur, they will be displayed in red.

3. **Customize your configuration**:
    - You can modify the `config.yaml` file to add more tokens, channel IDs, and adjust delays as needed.
4. **deepseek-api**
    - 在api.key中输入deepseek的api


## Notes

- Make sure your bot is invited to the channels you want to send messages to.
- Ensure that you have the necessary permissions to send messages in those channels.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Acknowledgments

- Inspired by the Discord API documentation.
- Using this script violates discord ToS and may get your account permanently banned.
