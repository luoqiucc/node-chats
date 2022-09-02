(function () {
    let d = document,
        w = window,
        p = parseInt,
        dd = d.documentElement,
        db = d.body,
        dc = d.compatMode == 'CSS1Compat',
        dx = dc ? dd : db,
        ec = encodeURIComponent

    w.CHAT = {
        msgObj: d.getElementById('message'),
        screenheight: w.innerHeight ? w.innerHeight : dx.clientHeight,
        username: null,
        userid: null,
        socket: null,
        scrollToBottom: function () {
            w.scrollTo(0, this.msgObj.clientHeight)
        },
        logout: function () {
            location.reload();
        },
        submit: function () {
            let content = d.getElementById('content').value
            if (content != '') {
                let obj = {
                    userid: this.userid,
                    username: this.username,
                    content: content
                }
                this.socket.emit('message', obj)
                d.getElementById('content').value = ''
            }
            return false
        },
        genUid: function () {
            return new Date().getTime() + '' + Math.floor(Math.random() * 899 + 100)
        },
        updateSysMsg: function (o, action) {
            let onlineUsers = o.onlineUsers
            let onlineCount = o.onlineCount
            let user = o.user
            let userhtml = ''
            let separator = ''
            for (let key in onlineUsers) {
                if (onlineUsers.hasOwnProperty(key)) {
                    userhtml += separator + onlineUsers[key]
                    separator = ', '
                }
            }
            d.getElementById('onlinecount').innerHTML = '当前在线: ' + userhtml
            let html = ''
            html += '<div class="msg-system">'
            html += user.username
            html += (action == 'login') ? ' 已加入' : ' 退出'
            html += '</div>'
            let section = d.createElement('section')
            section.className = 'system J-mjrlinkWrap J-cutMsg'
            section.innerHTML = html
            this.msgObj.appendChild(section)
            this.scrollToBottom()
        },
        usernameSubmit: function () {
            let username = d.getElementById('username').value
            if (username != '') {
                d.getElementById('username').value = ''
                d.getElementById('loginbox').style.display = 'none'
                d.getElementById('chatbox').style.display = 'block'
                this.init(username)
            }
            return false
        },
        init: function (username) {
            this.userid = this.genUid()
            this.username = username
            d.getElementById('showusername').innerHTML = this.username
            this.msgObj.style.minHeight = (this.screenheight - db.clientHeight + this.msgObj.clientHeight) + 'px'
            this.scrollToBottom()
            this.socket = io.connect('/')
            this.socket.emit('login', {userid: this.userid, username: this.username})
            this.socket.on('login', function (o) {
                CHAT.updateSysMsg(o, 'login')
            })
            this.socket.on('logout', function (o) {
                CHAT.updateSysMsg(o, 'logout')
            })
            this.socket.on('message', function (obj) {
                let isme = (obj.userid === CHAT.userid)
                let contentDiv = '<div>' + obj.content + '</div>'
                let usernameDiv = '<span>来自' + obj.username + '</span>'
                let section = d.createElement('section')
                if (isme) {
                    section.className = 'user'
                    section.innerHTML = contentDiv + usernameDiv
                } else {
                    section.className = 'service'
                    section.innerHTML =  contentDiv + usernameDiv
                }
                CHAT.msgObj.appendChild(section)
                CHAT.scrollToBottom()
            })
        }
    }
    d.getElementById('username').onkeydown = function (e) {
        e = e || event
        if (e.keyCode === 13) {
            CHAT.submit()
        }
    }
})()