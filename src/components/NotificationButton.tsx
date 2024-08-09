import React, { useEffect, useState } from "react";
import { requestForToken, onMessageListener, functions } from "../firebase";
import { httpsCallable } from "firebase/functions";

// Define the structure of the notification payload received from Firebase
interface NotificationPayload {
  notification: {
    title: string;
    body: string;
  };
  data: {
    notificationId: string; // ID of the notification, used to mark it as read
  };
}

// Define the structure of the response from the sendNotification function
interface NotificationResponse {
  success: boolean;
  error?: string;
}

const NotificationButton: React.FC = () => {
  // State to hold the incoming notification
  const [notification, setNotification] = useState<NotificationPayload | null>(null);
  // State to hold the unique ID of the notification, used to mark it as read
  const [notificationId, setNotificationId] = useState<string | null>(null);

  useEffect(() => {
    // Request the FCM token for the device/browser
    requestForToken();
    // Listen for incoming messages from Firebase Cloud Messaging
    onMessageListener().then((payload) => {
      const notificationPayload = payload as NotificationPayload; // Cast payload to expected type
      console.log('Notification received: ', notificationPayload);
      setNotification(notificationPayload); // Store the received notification in state

      // Extract and store the notification ID, if available
      if (notificationPayload.data && notificationPayload.data.notificationId) {
        setNotificationId(notificationPayload.data.notificationId);
      } else {
        setNotificationId(null); // Fallback if notificationId is not present
      }
    }).catch(err => console.log('Failed to receive notifications: ', err));
  }, []);

  // Function to send a notification using Firebase Cloud Functions
  const sendNotification = async (title: string, body: string) => {
    const sendNotificationFunction = httpsCallable<any, NotificationResponse>(functions, 'sendNotification');
    const token = await requestForToken(); // Get the FCM token

    if (token) {
      try {
        const generatedId = generateUniqueNotificationId(); // Generate a unique ID for the notification
        const result = await sendNotificationFunction({
          title,
          body,
          token,
          notificationId: generatedId
        });
        console.log('Notification result:', result.data);
      } catch (error) {
        console.log('Error sending notification:', error);
      }
    } else {
      console.log('No token available. Unable to send notification.');
    }
  };

  // Function to mark the notification as read
  const markNotificationAsRead = async () => {
    if (notificationId) {
      const markAsReadFunction = httpsCallable(functions, 'markNotificationAsRead');
      try {
        const result = await markAsReadFunction({ notificationId });
        console.log(`Notification ${notificationId} marked as read. Result:`, result.data);
        setNotification(null); // Clear notification after marking it as read
      } catch (error) {
        console.log('Error marking notification as read:', error);
      }
    }
  };

  // Function to generate a unique ID for each notification
  const generateUniqueNotificationId = () => {
    return Date.now().toString(); // Use timestamp as a unique ID
  };

  return (
    <div>
      {/* Buttons to send notifications with different titles and bodies */}
      <button onClick={() => sendNotification("Alpha", "Button 1 clicked")}>Button 1</button>
      <button onClick={() => sendNotification("Beta", "Button 2 clicked")}>Button 2</button>
      <button onClick={() => sendNotification("Gamma", "Button 3 clicked")}>Button 3</button>
      {/* Display the received notification */}
      {notification && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid black",
            margin: "20px",
            padding: "5px 20px",
            borderRadius: "10px",
          }}
        >
          <p>{notification.notification.title}</p>
          <p>-</p>
          <p>{notification.notification.body}</p>
          <button onClick={markNotificationAsRead}>Mark as Read</button>
        </div>
      )}
    </div>
  );
};

export default NotificationButton;
