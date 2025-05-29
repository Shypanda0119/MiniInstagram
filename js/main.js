import { login } from './auth.js';
import { getErrorMessage } from './error.js';
  // DOM 요소
  const loginBtn = document.getElementById("loginBtn");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  
  
  // 로그인 버튼 이벤트
  loginBtn.addEventListener("click", () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    if (!email || !password) {
      alert("이메일과 비밀번호를 입력하세요.");
      return;
    }
    login(email, password)
      .then(() => {
        alert("로그인 성공!")
        window.location.replace("main.html");
      })
      .catch(e => alert(getErrorMessage(e)));
  });
