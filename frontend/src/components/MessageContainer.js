const MessageContainer = ({ messages }) => {
  return (
    <div>
      {messages.map((msg, index) => (
        <table key={index} className="table table-striped table-bordered">
          <tbody>
            <tr>
             
              <td>
                {msg.message} - {msg.user}
              </td>
            </tr>
          </tbody>
        </table>
      ))}
    </div>
  );
};

export default MessageContainer;
