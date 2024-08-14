

using ChatApplication.DataService;
using ChatApplication.Models;
using Microsoft.AspNetCore.SignalR;

namespace ChatApplication.Hubs
{
    public class ChatHub: Hub
    {

        private readonly SharedDB _shared;

        public ChatHub(SharedDB shared)
        {
            _shared = shared;
        }

        //message to all
        public async Task JoinChat(UserConnection connection)
        {
            await Clients.All //clientProxy
                .SendAsync(method: "ReceiveMessage", arg1: "admin", arg2: $"{connection.UserName} has joined");

        }

        //message to specific group
        public async Task JoinSpecificChatRoom(UserConnection conn)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName: conn.ChatRoom);

            _shared.connections[Context.ConnectionId] = conn;

            await Clients.Group(conn.ChatRoom).SendAsync(method: "ReceiveMessage", arg1: "admin", arg2: $"{conn.UserName} has joined {conn.ChatRoom}");
        }


        //Functionality to send message
        public async Task SendMessage(string msg) //msg by user sent
        {
            if(_shared.connections.TryGetValue(Context.ConnectionId, out UserConnection conn))
            {
                await Clients.Group(conn.ChatRoom)
                    .SendAsync(method: "ReceiveSpecificMessage", arg1: conn.UserName, arg2: msg);
            }
        }

    }
}
