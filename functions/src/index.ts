import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Initialize the Firebase Admin SDK
admin.initializeApp();

// Firestore reference for storing notifications
const firestore = admin.firestore();

// Interface to enforce the shape of the incoming data
interface SendNotificationData {
  title: string;
  body: string;
  token: string;
  notificationId: string;
}

// Cloud Function to send notifications
export const sendNotification = functions.https.onCall(async (data: SendNotificationData, context) => {
  // Ensure the user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
  }

  const { title, body, token, notificationId } = data;

  // Define the payload structure for the notification
  const payload = {
    notification: {
      title: title,
      body: body,
    },
    data: {
      notificationId: notificationId, // Include the notification ID for tracking
    },
  };

  try {
    // Send the notification via Firebase Cloud Messaging (FCM)
    const response = await admin.messaging().send({
      token: token,
      ...payload
    });
    console.log("Notification sent successfully:", response);

    // Store the notification details in Firestore with the read status set to false
    await firestore.collection('notifications').doc(notificationId).set({
      title: title,
      body: body,
      read: false, // Mark as unread initially
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    // Type the error as Error
    if (error instanceof Error) {
      console.error('Error sending notification:', error.message);
      return { success: false, error: error.message };
    } else {
      // Handle the case where error is not of type Error
      console.error('Unknown error sending notification:', error);
      return { success: false, error: 'Unknown error occurred' };
    }
  }
});

// Cloud Function to mark a notification as read
export const markNotificationAsRead = functions.https.onCall(async data => {
  const { notificationId } = data;

  try {
    const notificationRef = firestore.collection('notifications').doc(notificationId);
    const doc = await notificationRef.get();
    if (doc.exists) {
      await notificationRef.update({ read: true });
      return { success: true };
    } else {
      console.error(`Notification with ID ${notificationId} does not exist.`);
      return { success: false, error: "Notification does not exist." };
    }
  } catch (error) {
    // Type the error as Error
    if (error instanceof Error) {
      console.error('Error marking notification as read:', error.message);
      return { success: false, error: error.message };
    } else {
      // Handle the case where error is not of type Error
      console.error('Unknown error sending notification:', error);
      return { success: false, error: 'Unknown error occurred' };
    }
  }
});