const mongoose = require('mongoose')

const dbURI = process.env.MONGODB_URI

mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGODB_URI,{useNewUrlParser: true})

mongoose.connection.on('connected',function(){
    console.log('Mongoose connected to ' + process.env.MONGODB_URI)
})

mongoose.connection.on('error',function(err){
    console.log('Mongoose connection error: ' + err)
})

mongoose.connection.on('disconnected',function(){
    console.log('Mongoose disconnected')
})

var gracefulShutdown = function(msg, callback){
    mongoose.connection.close(function(){
        console.log('Mongoose disconnected through ' + msg)
        callback()
    })
}

process.once('SIGUSR2',function(){
    gracefulShutdown('nodemon restart',function(){
        process.kill(process.pid, 'SIGUSR2')
    })
})

process.on('SIGINT',function(){
    gracefulShutdown('app termination', function(){
        process.exit(0)
    })
})

process.on('SIGTERM',function(){
    gracefulShutdown('Heroku app shutdown', function(){
        process.exit(0)
    })
})

require('./locations')

require('./users')


//2018265019 김승민