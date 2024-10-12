
module.exports = ({ strapi }) => {
    const io = require('socket.io')(strapi.server.httpServer, {
        cors: {
            origin: 'http://localhost:3000/chat',
            methods: ['GET', 'POST'],
            credentials: true,
        },
    });
    console.log('hello');

    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        socket.on('message', (data) => {
            console.log('Received message from client:', data);
            io.emit('message', data);
        });

        socket.on('disconnect', () => {
            console.log('A user disconnected:', socket.id);
        });
    });

    strapi.io = io;
};
