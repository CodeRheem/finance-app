import { initializeApp, cert, getApps, App } from 'firebase-admin/app';
import * as path from 'path';

const serviceAccountPath = path.join(
  process.cwd(),
  'src/config/firebase-service-account.json',
);

let firebaseApp: App;

if (!getApps().length) {
  firebaseApp = initializeApp({
    credential: cert(serviceAccountPath),
  });
} else {
  firebaseApp = getApps()[0];
}

export default firebaseApp;