// Dependencies
const { init } = require('./src/index')
const cTable = require('console.table')

const asciiArt = `
 _____                 _                       
| ____|_ __ ___  _ __ | | ___  _   _  ___  ___ 
|  _| | '_ \` _ \\| '_ \\| |/ _ \\| | | |/ _ \\/ _ \\
| |___| | | | | | |_) | | (_) | |_| |  __/  __/
|_____|_|_|_| |_| .__/|_|\\___/ \\__, |\\___|\\___|
      |_   _| __|_| _  ___| | _|___/_ __       
        | || '__/ _\` |/ __| |/ / _ \\ '__|      
        | || | | (_| | (__|   <  __/ |         
        |_||_|  \\__,_|\\___|_|\\_\\___|_|         
`
console.log(asciiArt)

// Initiates application
init()