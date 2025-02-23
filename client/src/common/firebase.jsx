import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDe6tQmznJ5qn9qPDOXKeLaI7bGuioy7ww",
  authDomain: "blog-56d43.firebaseapp.com",
  projectId: "blog-56d43",
  storageBucket: "blog-56d43.appspot.com",
  messagingSenderId: "19865675398",
  appId: "1:19865675398:web:ee22f4ca67ce977742d307"
};

const app = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();
const auth = getAuth();

export const authWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Google sign-in error: ", error);
    throw error;
  }
};
