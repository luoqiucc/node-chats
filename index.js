const express = require("express")
const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)

app.use(express.static('public'));

let onlineUsers = {}
let onlineCount = {}

io.on('connection', function (socket) {
    console.log('a user connected')
    socket.on('login', function (obj) {
        socket.name = obj.userid
        if (!onlineUsers.hasOwnProperty(obj.userid)) {
            onlineUsers[obj.userid] = obj.username
            onlineCount++
        }
        io.emit('login', {onlineUsers:onlineUsers, onlineCount:onlineCount, user: obj})
        console.log(obj.username + ' 已加入')
    })
    socket.on('disconnect', function () {
        if (onlineUsers.hasOwnProperty(socket.name)) {
            let obj = {userid: socket.name, username: onlineUsers[socket.name]}
            delete onlineUsers[socket.name]
            onlineCount--

            io.emit('logout', {onlineUsers:onlineUsers, onlineCount:onlineCount, user: obj})
            console.log(obj.username + ' 退出')
        }
    })
    socket.on('message', function (obj) {
        io.emit('message', obj)
        console.log(obj.username + '说' + obj.content)
    })
})

http.listen(8080, function () {
    console.log("success")
})

