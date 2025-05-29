Vanilla JavaScript, Firebase, Airtable를 사용해 만든 간단한 인스타그램 클론 프로젝트입니다.  
이미지는 로컬 경로 또는 직접 이미지 경로 불러오며, 주요 기능들은 아래와 같습니다.

---

## 주요 기능

- 회원가입 / 로그인 기능 (Firebase Authentication)  
- 글 올리기 (게시물 작성)  
- 내 게시물 조회  
- 전체 게시물 조회  
- 댓글 작성 기능

---

### 1. 로그인 페이지  
![로그인 페이지](https://github.com/user-attachments/assets/f7e4eb59-0edd-4cdd-aff0-324973879374)
사용자가 로그인하거나 회원가입할 수 있는 화면입니다.

### 2. 게시물 작성 화면  
![게시물 작성 화면](https://github.com/user-attachments/assets/d4e9fd60-7b89-4677-86c7-a3a575cda4b6)
게시물을 작성하고 업로드할 수 있는 화면입니다.

### 3. 전체 게시물 목록  
![전체 게시물 목록](https://github.com/user-attachments/assets/67a4ef8a-a6da-492c-84a5-022e34ad1491)
다른 사용자의 게시물을 확인할 수 있는 화면입니다.

### 4. 내 게시물 목록  
![내 게시물 목록](https://github.com/user-attachments/assets/572cbf3e-e49f-44ff-bd00-4b3c759c6686)
내가 올린 게시물을 확인할 수 있는 화면입니다.

### 5. 게시물 댓글  
![게시물 댓글](https://github.com/user-attachments/assets/21aff845-5dd0-46b8-b708-07773c8b4941)

게시물의 댓글들을 확인하고 내가 단 댓글들은 삭제할 수 있는 화면입니다.

---

## 프로젝트 구조

- `index.html`: 메인 페이지  
- `sign.html`: 회원가입 페이지  
- `js/`: JavaScript 파일들  
- `img/`: 로컬에 저장된 이미지 파일들  

---

## API 키 설정 방법

본 프로젝트는 별도의 환경변수 파일 없이,  
직접 JavaScript 코드 내에 API 키를 입력하는 방식을 사용합니다.

- `js/posts.js`와 `js/firebaseinit.js`를 열고,  
아래와 같이 본인의 API 키를 직접 입력하세요.

```js/post.js
const airtableToken = "your_api_token_here"; //자신의 값 입력
const baseId = "your_base_id_here"; //자신의 값 입력
const tableName = "your_tableName_here"; //자신의 값 입력

```js/firebase-init.js
const firebaseConfig = { // 자신의 값 입력
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
  };
