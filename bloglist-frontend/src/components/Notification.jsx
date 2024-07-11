const Notification = ({ message }) => {
  if (message === null) {
    return null;
  }

  const notificationStyle = {
    color: 'black',
    backgroundColor: 'lightgrey',
    fontSize: '20px',
    border: 'solid 1px black',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px',
  };

  return <div style={notificationStyle}>{message}</div>;
};

export default Notification;
