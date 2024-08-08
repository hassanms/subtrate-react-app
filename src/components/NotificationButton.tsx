import React, { useEffect, useState } from "react";
import { requestForToken, onMessageListener } from "../firebase";

const NotificationButton: React.FC = () => {
  const [notification, setNotification] = useState<any>(null);

  useEffect(() => {
    requestForToken();

    onMessageListener().then(payload => {
      setNotification(payload);
      console.log('Notification received: ', payload);
    }).catch(err => console.log('Failed to receive notifications: ', err));
  }, []);

  const sendNotification = (message: string) => {
    // Here we would typically call a cloud function to send the notification.
    console.log(`Sending notification: ${message}`);
  };

  return (
    <div>
      <button onClick={() => sendNotification("Button 1 clicked")}>Button 1</button>
      <button onClick={() => sendNotification("Button 2 clicked")}>Button 2</button>
      <button onClick={() => sendNotification("Button 3 clicked")}>Button 3</button>

      {notification && (
        <div>
          <h2>Notification</h2>
          <p>{notification.notification.title}</p>
          <p>{notification.notification.body}</p>
        </div>
      )}
    </div>
  );
};

export default NotificationButton;
