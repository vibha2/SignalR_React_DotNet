import { Col, Row, Container } from "react-bootstrap";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import WaitingRoom from "./components/WaitingRoom";
import { useState } from "react";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import ChatRoom from "./components/ChatRoom";

function App() {
  const [conn, setConnection] = useState();
  const [messages, setMessages] = useState([]);

  const joinChatRoom = async (username, chatroom) => {
    try {
      //initiate a connection
      const conn = new HubConnectionBuilder()
        .withUrl("https://localhost:7208/chat")
        .configureLogging(LogLevel.Information)
        .build();

      //setup handler
      // conn.on("ReceiveMessage", (message) => {
      //   console.log("Message received from server:", message);
      //   // Handle the received message
      // });

      // conn.on("JoinSpecificChatRoom", (username, msg) => {
      //   console.log("msg: ", msg);
      // });

      conn.on("ReceiveMessage", (user, message) => {
        const newMessage = `${user}: ${message}`;
        console.log("user=> ", `${user}`);
        console.log("message=> ", `${message}`);

        console.log("msg: ", newMessage);
      });

      conn.on("ReceiveSpecificMessage", (username, msg) => {
        console.log("msgs: ", msg);
        setMessages((messages) => [...messages, { username, msg }]);
      });

      await conn.start();
      await conn.invoke("JoinSpecificChatRoom", { username, chatroom });

      setConnection(conn);
    } catch (e) {
      console.log("err=> ", e);
    }
  };

  return (
    <div>
      <main>
        <Container>
          <Row className="px-5 my-5">
            <Col sm="12">
              <h1 className="font-weight-light">Welcome to the F1 ChatApp</h1>
            </Col>
          </Row>
          {!conn ? (
            <WaitingRoom joinChatRoom={joinChatRoom}></WaitingRoom>
          ) : (
            <ChatRoom messages={messages}></ChatRoom>
          )}
        </Container>
      </main>
    </div>
  );
}

export default App;
