const Notification = ({ message, type }) => {
    if (!message) return null; // Don't render anything if the message is null or empty

    const notificationStyle = type === 'error' ? 'notification error' : 'notification success';

    return (
      <div className={notificationStyle}>
        {message}
      </div>
    )
}

export default Notification