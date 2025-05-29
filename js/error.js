export function getErrorMessage(error) {
  switch (error.code) {
    case 'auth/user-not-found':
      return "등록되지 않은 이메일입니다.";
    case 'auth/wrong-password':
      return "비밀번호가 틀렸습니다.";
    case 'auth/invalid-email':
      return "잘못된 이메일 형식입니다.";
    case 'auth/user-disabled':
      return "사용자가 비활성화되어 있습니다.";
    case 'auth/email-already-in-use':
      return "이미 사용 중인 이메일입니다.";
    case 'auth/weak-password':
      return "비밀번호를 6자리 이상 설정해주세요.";
    case 'auth/invalid-login-credentials':
      return "이메일 또는 비밀번호가 올바르지 않습니다.";
    default:
      return "에러: " + error.message;
  }
}