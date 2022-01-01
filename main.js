const TOKEN = '';
const admins = ['YOUR USERNAME'];


const {spawn} = require('child_process');
const fs = require('fs');
const process = require('process');
const screenshot = require('screenshot-desktop');
const Discord = require("discord.js");
const bot = new Discord.Client({
	intents: [
	Discord.Intents.FLAGS.GUILDS,
	Discord.Intents.FLAGS.GUILD_MESSAGES
	]
});
const prefix = '!';

//The admins are the only users able to execute commands on the machine.

bot.once("ready", () => {
	console.log("The bot is ready...");
});


async function addBotResponses(messages, data){

	let eatenLength = 0;
	let message = '';
	let rawSlice;
	while(eatenLength < data.toString().length){
		rawSlice = data.toString().slice(eatenLength, eatenLength + 1994);
		if(data.toString().length >= 1994){ //The max ammount of text you can send in a message is 2000 characters.
			message = '```' + rawSlice  + '```';
			eatenLength += message.length;
		}
		else{
			message = '```' + data.toString() + '```';

			eatenLength += message.length;
			

		}
		messages.push(message);
	}
}


bot.on("messageCreate", async message => {
	const author = message.author.username + '#' + message.author.discriminator;

	//I haven't find out about slash commands. I know it is possible in python, but this is my first bot in discord.js
	//I will implement a new version when i find a package that allows me to use slash commands in a better way.
	if(!message.content.startsWith(prefix) || !author in admins){
		return false;
	}

	//Slice the message to get 
	const args = message.content.slice(prefix.length).split(/ +/);
 
	//Get the first element of the list, and turn it to lower case so commands arent case sensitive.
	const cmd = args.shift().toLowerCase();
	

	
	if(cmd === 'sh'){
		const consoleCommand = args.join(" ");
		const commandNoArgs = args.shift().toLowerCase();
		console.log(consoleCommand);
		if(commandNoArgs == 'cd'){
			const path = args.join(' '); //I have to join them again to get the path that the user wants to get to.
			try{
				await process.chdir(path);
				await message.reply('```' + process.cwd() + '```');
			}catch(err){
				message.reply('```Could not change the directory.\n'+ err.message +'````');
			}
			return;
		}
		try{
			const output = spawn(consoleCommand, {shell: true});
			let finalOutput = '```' + process.cwd();
			let multiple_messages = false;
			let messages = [];
			output.stdout.on("data", (data) => {addBotResponses(messages, data)});

			output.stderr.on("data", (data) => {addBotResponses(messages, data)});

			output.on("exit", async () => {
				finalOutput += '```';

				for(msg of messages){
					try{
						await message.reply(msg);
					}catch(err){
						message.reply("```There was an error executing the command.\n" + err.message + '```');
					}
					
				}
				
			});
		} catch(err){
			message.reply("```There was an error while executing the command: \n "+ err.message +"```");
		}

		//console.log(consoleCommand);
	}

	else if(cmd == 'screenshot'){
		try{
			//Take the screenshot, send it and delete it.
			await screenshot({format: 'jpg', filename:`${message.author.username}_screenshot.jpg`})
			await message.channel.send({files: [`./${message.author.username}_screenshot.jpg`]});
			await fs.unlinkSync(`${message.author.username}_screenshot.jpg`);

		} catch(err){
			message.reply("```Couldn't take or send the screenshot: \n" + err.message + "```");
		}
		
	}



	
});


bot.login(TOKEN);