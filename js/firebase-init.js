import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";

const firebaseConfig = { // 자신의 값 입력
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
  };

const app = initializeApp(firebaseConfig); //Firebase를 웹 앱에 연결하고 초기화 하는 코드

export default app;