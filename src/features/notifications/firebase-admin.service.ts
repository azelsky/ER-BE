import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';

import * as serviceAccount from './ermessaging-firebase-adminsdk-ntptg-18d4f97d24.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as ServiceAccount)
});

export const firebaseAdmin = admin;
