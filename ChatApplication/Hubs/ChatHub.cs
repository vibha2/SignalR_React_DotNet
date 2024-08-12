

using ChatApplication.Models;
using Microsoft.AspNetCore.SignalR;

namespace ChatApplication.Hubs
{
    public class ChatHub: Hub
    {
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

            await Clients.Group(conn.ChatRoom).SendAsync(method: "ReceiveMessage", arg1: "admin", arg2: $"{conn.UserName} has joined {conn.ChatRoom}");
        }

    }
}
