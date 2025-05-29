import app from './firebase-init.js';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged as firebaseOnAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
const auth = getAuth(app);

function login(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

function signup(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}

function logout() {
  return signOut(auth);
}

// 이름 충돌 피하기 위해 함수명 바꿈
function onAuthStateChanged(callback) {
  return firebaseOnAuthStateChanged(auth, (user) => {
    if (user) {
      callback(user.uid);
    } else {
      callback(null);
    }
  });
}

// export
export { login, signup, logout, onAuthStateChanged };