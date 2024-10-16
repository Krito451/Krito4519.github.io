const express = require('express');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// 提供静态文件
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));

let currentState = {
    currentStep: 0,
    selectedSpirits: { blue: [], red: [] },
    bannedSpirits: { blue: [], red: [] },
    teamNames: { blue: '蓝队', red: '红队' }
};

io.on('connection', (socket) => {
    console.log('A user connected');
    
    // 发送当前状态给新连接的用户
    socket.emit('initialState', currentState);

    // 处理选择精灵
    socket.on('selectSpirit', (data) => {
        // 更新服务器端状态
        if (data.action === 'ban') {
            currentState.bannedSpirits[data.team].push(data.spirit);
        } else {
            currentState.selectedSpirits[data.team].push(data.spirit);
        }
        currentState.currentStep++;

        // 广播更新给所有客户端
        io.emit('stateUpdate', currentState);
    });

    // 处理重置选择
    socket.on('resetSelection', () => {
        currentState = {
            currentStep: 0,
            selectedSpirits: { blue: [], red: [] },
            bannedSpirits: { blue: [], red: [] },
            teamNames: currentState.teamNames
        };
        io.emit('stateUpdate', currentState);
    });

    // 处理更新队伍名称
    socket.on('updateTeamName', (data) => {
        currentState.teamNames[data.team] = data.name;
        io.emit('stateUpdate', currentState);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
