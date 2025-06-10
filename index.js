import fs from 'fs';
import axios from 'axios';
import yaml from 'yaml';
import chalk from 'chalk';
import readline from 'readline';

class DiscordBot {
    constructor(token) {
        this.baseUrl = "https://discord.com/api/v10";
        this.headers = { 'Authorization': token };
        this.username = "Initializing...";
        this.userId = null;
        this.lastMessageSentTime = {};
        this.MIN_COOLDOWN = 30000; // 最低冷却30秒
        this.mentionOnReply = false; // 是否在回复中引用发送者
    }

    async init() {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        
        this.mentionOnReply = await new Promise((resolve) => {
            rl.question('随机回复时是否在回复中引用消息发送者？(Y/N): ', (answer) => {
                rl.close();
                resolve(answer.trim().toUpperCase() === 'Y');
            });
        });

        const response = await axios.get(`${this.baseUrl}/users/@me`, { headers: this.headers });
        this.username = `${response.data.username}#${response.data.discriminator}`;
        this.userId = response.data.id;
        console.log(chalk.blue(`🤖 机器人已登录 (ID: ${this.userId})`));
        console.log(chalk.blue(`🔄 随机回复时${this.mentionOnReply ? '会' : '不会'}引用发送者`));
    }

    async sendMessage(channelId, message, originalMessage = null) {
        const cooldown = Math.max(
            this.channelCooldown(channelId) || 0,
            this.MIN_COOLDOWN
        );
        
        if (!this.canSendInChannel(channelId, cooldown)) {
            const waitTime = Math.ceil((this.lastMessageSentTime[channelId] + cooldown - Date.now()) / 1000);
            console.log(chalk.yellow(`⏳ 频道 ${channelId} 冷却中，还需等待 ${waitTime} 秒`));
            return { success: false, reason: '冷却中' };
        }

        try {
            const { data } = await axios.post(
                `${this.baseUrl}/channels/${channelId}/messages`,
                { content: message },
                { headers: this.headers }
            );
            
            this.lastMessageSentTime[channelId] = Date.now();
            
            if (originalMessage) {
                console.log(chalk.green(
                    `🔵 原消息 [${originalMessage.author.username}#${originalMessage.author.discriminator}]: ` +
                    `${originalMessage.content.substring(0, 50)}${originalMessage.content.length > 50 ? '...' : ''}\n` +
                    `🟢 机器人回复: ${message.substring(0, 50)}${message.length > 50 ? '...' : ''}`
                ));
            }
            
            return { success: true };
        } catch (error) {
            if (error.response?.status === 429) {
                const retryAfter = error.response.data?.retry_after || 5;
                console.log(chalk.yellow(`⏳ 等待 ${retryAfter} 秒...`));
                await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
                return this.sendMessage(channelId, message, originalMessage);
            }
            console.error(chalk.red(`❌ 发送失败: ${error.message}`));
            return { success: false };
        }
    }

    async fetchLatestMessages(channelId, limit = 10) {
        try {
            const { data } = await axios.get(
                `${this.baseUrl}/channels/${channelId}/messages?limit=${limit}`,
                { headers: this.headers }
            );
            return data.filter(msg => !msg.author.bot).reverse();
        } catch (error) {
            console.error(chalk.red(`❌ 获取消息失败: ${error.message}`));
            return [];
        }
    }

    canSendInChannel(channelId, cooldown) {
        const lastSent = this.lastMessageSentTime[channelId] || 0;
        return Date.now() - lastSent >= cooldown;
    }

    channelCooldown(channelId) {
        return 5000;
    }
}

class DeepSeekAI {
    constructor(apiKey) {
        this.apiUrl = "https://api.deepseek.com/v1/chat/completions";
        this.headers = {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        };
    }

    async generateReply(messageContent) {
        try {
            const { data } = await axios.post(
                this.apiUrl,
                {
                    model: "deepseek-chat",
                    messages: [
                        { role: "system", content: "用1-2句话直接回复" },
                        { role: "user", content: messageContent }
                    ],
                    max_tokens: 50,
                    temperature: 0.7
                },
                { headers: this.headers }
            );
            return data.choices[0]?.message?.content || null;
        } catch (error) {
            console.error(chalk.red(`❌ 生成回复失败: ${error.message}`));
            return null;
        }
    }
}

async function main() {
    const config = yaml.parse(fs.readFileSync('config.yaml', 'utf8'));
    const bot = new DiscordBot(config.token);
    await bot.init();
    const ai = new DeepSeekAI(fs.readFileSync('api.key', 'utf8').trim());

    while (true) {
        for (const channelId of config.channel_id) {
            const messages = await bot.fetchLatestMessages(channelId);
            if (messages.length > 0) {
                const randomMsg = messages[Math.floor(Math.random() * messages.length)];
                let reply = await ai.generateReply(randomMsg.content);
                
                if (reply) {
                    if (bot.mentionOnReply) {
                        reply = `回复 <@${randomMsg.author.id}>: ${reply}`;
                    }
                    await bot.sendMessage(channelId, reply, randomMsg);
                }
            }
        }
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
}

main().catch(console.error);
