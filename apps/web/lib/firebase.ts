import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
    apiKey: 'AIzaSyCXEftwEGMtEKw9uVUC-4TIyw4Ylq3iYh4',
    authDomain: 'awesomeproject-99335.firebaseapp.com',
    projectId: 'awesomeproject-99335',
    storageBucket: 'awesomeproject-99335.firebasestorage.app',
    messagingSenderId: '139467995077',
    appId: '1:139467995077:web:62e05a6be0580e8a343dac',
    measurementId: 'G-R7KRVYWGLP',
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

