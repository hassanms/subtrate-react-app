import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

export const sendNotification = functions.https.onCall(async (data) => {
  const { title, body, token } = data;

  // Construct the payload for the notification
  const payload = {
    notification: {
      title: title,
      body: body,
    },
    token: token,
  };

  try {
    const response = await admin.messaging().send(payload);
    console.log('Notification sent successfully:', response);
    return {
      success: true,
      title,
      body,
    };
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
