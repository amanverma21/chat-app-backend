
import { Server } from 'socket.io';

export default {
  register({ strapi }: { strapi: any }) {
  },

  bootstrap({ strapi }: { strapi: any }) {
    const io = new Server(strapi.server.httpServer, {
      cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });

    io.on('connection', async (socket: any) => {
      console.log('A user connected:', socket.id);
      try {
        const messages = await strapi.entityService.findMany('api::message.message', {
          sort: { timestamp: 'ASC' },
          populate: ['author'],
          limit: 50,
        });
        socket.emit('chatHistory', messages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
      socket.on('message', async (data: any) => {
        console.log('Received message from client:', data);
        try {
          const message = await strapi.entityService.create('api::message.message', {
            data: {
              Text: data.Text, 
              timestamp: new Date(),
              author: data.authorId, 
            },
          });
          const savedMessage = await strapi.entityService.findOne(
            'api::message.message',
            message.id,
            {
              populate: ['author'],
            }
          );
          io.emit('message', savedMessage);
        } catch (error) {
          console.error('Error saving message:', error);
        }
      });

      socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
      });
    });
    strapi.io = io;

    console.log('Socket.io server has been initialized');
  },
};
