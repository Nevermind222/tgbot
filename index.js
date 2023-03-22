const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options.js')
const token = '6071572453:AAGJXBIWUnQHI2LkNNY21YwhI_Rt3ouzlCc'


const bot = new TelegramApi (token, {polling: true})

const chats = {}


const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `I'll pick the number 0-9, you guess.`)
    const randomNumber = Math.floor(Math.random() * 10);
    // console.log(randomNumber)
    chats[chatId] = randomNumber;
    console.log(chats)
    await bot.sendMessage(chatId, `Try to guess the number!`, gameOptions);
} 

const start = () => {

    bot.setMyCommands([
        {command: '/start', description: 'Start bot'},
        {command: '/showmyusname', description: 'Show your username'},
        {command: '/game', description: 'Play super cool game :)'},
    ])

    bot.on("message", async msg => {
        // console.log(msg.text)
        const text = msg.text;
        // console.log(text)
        const chatId = msg.chat.id;
        const firstName = msg.chat.first_name;
        const userName = msg.chat.username;
        
        if (text === '/start') {
            await bot.sendAnimation(chatId,'https://media4.giphy.com/media/vFKqnCdLPNOKc/giphy.gif?cid=ecf05e47b380f85x4f8krxyd6uz2w4688lcs38qkdvye9hgl&rid=giphy.gif&ct=g')
            return bot.sendMessage(chatId, `Welcome ${firstName}`)
        }
    
        if (text === '/showmyusname') {
            return bot.sendMessage(chatId, `Your username is @${userName}`)
        }
        if (text === '/game'){
            return startGame(chatId);
        }
        return bot.sendMessage(chatId, 'Please, use existing commands' )
    })

    bot.on('callback_query', msg => {
        const data = msg.data;
        console.log(data, "data")
        const chatId = msg.message.chat.id;
        if (data === '/again') {
            return startGame(chatId)
        }
        console.log(chats[chatId], "chats[chatId]")
        
        if (parseInt(data) === chats[chatId]) {
            return bot.sendMessage(chatId, `Congratulations, you have guessed correct number ${data}`, againOptions)
        } else {
          return bot.sendMessage(chatId, `Unfortunately it is not correct, it was ${chats[chatId]}`, againOptions)
        }
    })
}

start()


