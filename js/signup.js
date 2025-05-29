import { signup } from './auth.js';
import { getErrorMessage } from './error.js';

document.getElementById("signBtn").addEventListener("click", () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("이메일과 비밀번호를 입력하세요.");
    return;
  }

  signup(email, password)
    .then(() => {
      alert("회원가입 성공! 창을 닫고 로그인하세요.");
      window.close();
    })
    .catch(e => {
      alert("회원가입 실패: " + getErrorMessage(e)); 
    });
});
