import { createUserWithEmailAndPassword, deleteUser, sendEmailVerification, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile, User } from "firebase/auth";
import { auth, githubProvider, googleProvider } from "@/lib/firebase";

export type RegisterUserData = { name: string; email: string; password: string; };

export async function registerUser({ name, email, password }: RegisterUserData) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(credential.user, { displayName: name });
  await sendEmailVerification(credential.user);
  return credential.user;
}

export async function loginWithEmail(email: string, password: string) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}
export async function loginWithGoogle() { return (await signInWithPopup(auth, googleProvider)).user; }
export async function loginWithGithub() { return (await signInWithPopup(auth, githubProvider)).user; }
export async function signOutUser() { await signOut(auth); }
export async function sendVerificationAgain(user: User) { await sendEmailVerification(user); }
export async function deleteCurrentUserAccount(user: User) { await deleteUser(user); }
