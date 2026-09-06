// backend/config/firebaseAdmin.js
import admin from 'firebase-admin';

let initialized = false;

export const getFirebaseAdmin = () => {
  if (initialized) return admin;

  try {
    let credential;

    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      // Full service account JSON provided as a single env var
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      credential = admin.credential.cert(serviceAccount);
    } else if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
      credential = admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // .env files store literal \n, convert back to real newlines
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      });
    } else {
      throw new Error(
        'Firebase Admin credentials missing. Set FIREBASE_SERVICE_ACCOUNT or FIREBASE_PROJECT_ID/FIREBASE_CLIENT_EMAIL/FIREBASE_PRIVATE_KEY in .env'
      );
    }

    admin.initializeApp({ credential });
    initialized = true;
    return admin;
  } catch (error) {
    console.error('❌ Firebase Admin initialization error:', error.message);
    throw error;
  }
};
