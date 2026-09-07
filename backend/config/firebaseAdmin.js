// backend/config/firebaseAdmin.js
// Verifies Firebase ID tokens directly (Google's documented manual-verification
// method) instead of using firebase-admin's Auth module. firebase-admin's Auth
// module transitively depends on jwks-rsa -> jose, and jwks-rsa's CommonJS code
// tries to require() a pure-ESM jose build, which crashes under Vercel's Node
// runtime (ERR_REQUIRE_ESM). This avoids that broken dependency chain entirely.
import jwt from 'jsonwebtoken';

const CERTS_URL =
  'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com';

let certsCache = null;
let certsCacheExpiry = 0;

const getProjectId = () => {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT).project_id;
  }
  return process.env.FIREBASE_PROJECT_ID;
};

const fetchCerts = async () => {
  if (certsCache && Date.now() < certsCacheExpiry) return certsCache;

  const res = await fetch(CERTS_URL);
  if (!res.ok) {
    throw new Error(`Failed to fetch Firebase public certs: ${res.status}`);
  }
  certsCache = await res.json();
  certsCacheExpiry = Date.now() + 60 * 60 * 1000; // cache 1 hour
  return certsCache;
};

const verifyIdToken = async (idToken) => {
  const projectId = getProjectId();
  if (!projectId) {
    throw new Error(
      'Firebase project ID missing. Set FIREBASE_SERVICE_ACCOUNT or FIREBASE_PROJECT_ID in .env'
    );
  }

  const decodedHeader = jwt.decode(idToken, { complete: true });
  if (!decodedHeader?.header?.kid) {
    throw new Error('Invalid Google sign-in token: missing key id');
  }

  const certs = await fetchCerts();
  const cert = certs[decodedHeader.header.kid];
  if (!cert) {
    throw new Error('Invalid Google sign-in token: unknown signing key');
  }

  const payload = jwt.verify(idToken, cert, {
    algorithms: ['RS256'],
    audience: projectId,
    issuer: `https://securetoken.google.com/${projectId}`,
  });

  if (!payload.sub) {
    throw new Error('Invalid Google sign-in token: missing subject');
  }

  return {
    uid: payload.sub,
    email: payload.email,
    name: payload.name,
    picture: payload.picture,
  };
};

export const getFirebaseAdmin = () => ({
  auth: () => ({ verifyIdToken }),
});
