import { 
  GoogleAuthProvider, 
  FacebookAuthProvider, 
  signInWithPopup, 
  User,
  setPersistence,
  browserLocalPersistence 
} from "firebase/auth";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "../firebase/firebaseConfig";
import { FirebaseError } from "firebase/app";

const handleFirestoreUserCheck = async (userUid: string, isRegistration: boolean, provider: 'google' | 'facebook', user: User) => {
  try {
    await setPersistence(auth, browserLocalPersistence);
    
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("uid", "==", userUid));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty && isRegistration) {
      const fullName = user.displayName || 'Unnamed User';
      const email = user.email || 'No email available';
      const photoURL = user.photoURL || '';

      await addDoc(usersRef, {
        uid: userUid,
        fullName,
        email,
        photoURL,
        provider,
        createdAt: new Date(),
      });
      return true;
    }
    return !querySnapshot.empty;
  } catch (error) {
    console.error("Error in handleFirestoreUserCheck:", error);
    return false;
  }
};

export const handleSocialAuth = async (provider: 'google' | 'facebook', isRegistration: boolean = false) => {
  try {
    const authProvider = provider === 'google'
      ? new GoogleAuthProvider()
      : new FacebookAuthProvider();

    if (provider === 'google') {
      authProvider.addScope('profile');
      authProvider.addScope('email');
    }

    const result = await signInWithPopup(auth, authProvider);
    const user: User = result.user;

    const userCreated = await handleFirestoreUserCheck(user.uid, isRegistration, provider, user);
    if (!userCreated) {
      console.log("User check failed");
      return null;
    }

    return user;
  } catch (error) {
    if (error instanceof FirebaseError) {
      switch (error.code) {
        case 'auth/popup-closed-by-user':
          console.log("Authentication cancelled by user");
          return null;
        case 'auth/account-exists-with-different-credential':
          console.log("Account exists with different credentials");
          return null;
        case 'auth/user-not-found':
          console.log("User not found");
          return null;
        default:
          console.log("Authentication error:", error.message);
          return null;
      }
    }
    console.error("Unexpected error during authentication:", error);
    return null;
  }
};