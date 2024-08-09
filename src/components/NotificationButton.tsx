import React, { useEffect, useState } from "react";
import { requestForToken, onMessageListener } from "../firebase";
import { httpsCallable } from "firebase/functions";
import { functions } from "../firebase";

const NotificationButton: React.FC = () => {
  const [notification, setNotification] = useState<any>(null);

  useEffect(() => {
    requestForToken(); // No need to await this in useEffect
    onMessageListener().then(payload => {
      setNotification(payload);
      console.log('Notification received: ', payload);
    }).catch(err => console.log('Failed to receive notifications: ', err));
  }, []);

  const sendNotification = async (title: string, body: string) => {
    const sendNotificationFunction = httpsCallable(functions, 'sendNotification');
    const token = await requestForToken(); // Ensure this function returns a valid token

    if (token) {
      try {
        const result = await sendNotificationFunction({ title, body, token });
        console.log('Notification result:', result.data);
      } catch (error) {
        console.log('Error sending notification:', error);
      }
    } else {
      console.log('No token available. Unable to send notification.');
    }
  };

  return (
    <div>
      <button onClick={() => sendNotification("Alpha", "Button 1 clicked")}>Button 1</button>
      <button onClick={() => sendNotification("Beta", "Button 2 clicked")}>Button 2</button>
      <button onClick={() => sendNotification("Gamma", "Button 3 clicked")}>Button 3</button>

      {notification && (
        <div
          style={{
            display: "flex",
          }}
        >
          <p>{notification.title}</p>
          <p>-</p>
          <p>{notification.body}</p>
        </div>
      )}
    </div>
  );
};

export default NotificationButton;
