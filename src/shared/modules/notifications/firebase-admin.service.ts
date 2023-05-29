import * as admin from 'firebase-admin';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const serviceAccount = require('../../../ermessaging-firebase-adminsdk-ntptg-18d4f97d24.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export const firebaseAdmin = admin;
