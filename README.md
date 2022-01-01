# Discord Remote Administration tool.


I created a remote administration discord bot to learn node.js and discord.js



Use ```!sh [command]``` to execute a command in the shell, and use ```!screenshot``` to see what's in the monitor.


## Installation

Go to the folder where you downloaded the script and use the following commands:

```
npm init -y
```

```
npm install discord.js
```

```
npm install screenshot-desktop
```

After that you will have to edit the first two lines in main.js, these are:

```
const TOKEN = '';
const admins = ['YOUR USERNAME'];
```

inside of ```TOKEN``` paste a discord token of your own, and in ```admins``` copy your discord username, it should look like this ```your_name#1234```


