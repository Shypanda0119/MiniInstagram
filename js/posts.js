import { logout, onAuthStateChanged } from './auth.js';
import { setupCommentFeature } from './comments.js';

const airtableToken = "your_api_token_here"; //자신의 값 입력
const baseId = "your_base_id_here"; //자신의 값 입력
const tableName = "your_tableName_here"; //자신의 값 입력

let currentUserUid = null;

// 게시물 추가
async function addPost(caption, imageUrl, username, userId) {
  const res = await fetch(`https://api.airtable.com/v0/${baseId}/${tableName}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${airtableToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ fields: { caption, imageUrl, username, userId } })
  });
  if (!res.ok) throw new Error(`Error: ${res.status} ${res.statusText}`);
  return await res.json();
}

// 모든 게시물 불러오기 (생성일 내림차순)
async function getPosts() {
  const res = await fetch(
    `https://api.airtable.com/v0/${baseId}/${tableName}?sort[0][field]=createdAt&sort[0][direction]=desc`,
    {
      headers: { Authorization: `Bearer ${airtableToken}` }
    }
  );
  if (!res.ok) throw new Error("게시물 불러오기 실패");
  const data = await res.json();
  return data.records;
}

// 게시물 일부 필드 수정
export async function patchPost(postId, fields) {
  const res = await fetch(`https://api.airtable.com/v0/${baseId}/${tableName}/${postId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${airtableToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ fields })
  });
  if (!res.ok) throw new Error(`Error: ${res.status} ${res.statusText}`);
  return await res.json();
}

// 게시물 삭제 함수 (Airtable API DELETE 요청)
export async function deletePost(postId) {
  const res = await fetch(`https://api.airtable.com/v0/${baseId}/${tableName}/${postId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${airtableToken}`
    }
  });
  if (!res.ok) throw new Error(`삭제 실패: ${res.status} ${res.statusText}`);
  return await res.json();
}

document.addEventListener("DOMContentLoaded", () => {
  const postForm = document.getElementById("postForm");
  const postList = document.getElementById("postList");
  const tabAddBtn = document.getElementById("tabAddBtn");
  const tabListBtn = document.getElementById("tabListBtn");
  const tabMyPostsBtn = document.getElementById("tabMyPostsBtn");
  const postsList = document.getElementById("postsList");

  // 내 게시물 보기 UI
  const storyView = document.getElementById("storyView");
  const storyPostsContainer = document.getElementById("storyPostsContainer");

  const modal = document.getElementById("modal");
  const modalImage = document.getElementById("modalImage");
  const modalCaption = document.getElementById("modalCaption");
  const modalUsername = document.getElementById("modalUsername");
  const modalClose = document.getElementById("modalClose");

  // 댓글 관련 UI
  const commentList = document.getElementById("commentList");
  const commentInput = document.getElementById("commentInput");
  const commentAuthorInput = document.getElementById("commentAuthorInput");
  const addCommentBtn = document.getElementById("addCommentBtn");

  let currentPostId = null;

  // 댓글 기능 초기화
  const { loadComments } = setupCommentFeature(
    () => currentPostId,
    async (postId) => {
      const res = await fetch(`https://api.airtable.com/v0/${baseId}/${tableName}/${postId}`, {
        headers: { Authorization: `Bearer ${airtableToken}` }
      });
      if (!res.ok) throw new Error("게시물 불러오기 실패");
      return await res.json();
    },
    {
      commentList,
      commentInput,
      commentAuthorInput,
      addCommentBtn
    },
    () => currentUserUid
  );

  function setActiveTab(tab) {
    if (tab === "add") {
      postForm.style.display = "flex";
      postList.style.display = "none";
      storyView.style.display = "none";
      tabAddBtn.classList.add("active");
      tabListBtn.classList.remove("active");
      tabMyPostsBtn.classList.remove("active");
    } else if (tab === "list") {
      postForm.style.display = "none";
      postList.style.display = "flex";
      storyView.style.display = "none";
      tabAddBtn.classList.remove("active");
      tabListBtn.classList.add("active");
      tabMyPostsBtn.classList.remove("active");
    } else if (tab === "myPosts") {
      postForm.style.display = "none";
      postList.style.display = "none";
      storyView.style.display = "block";
      tabAddBtn.classList.remove("active");
      tabListBtn.classList.remove("active");
      tabMyPostsBtn.classList.add("active");
    }
  }

  setActiveTab("add");

  tabAddBtn.addEventListener("click", () => setActiveTab("add"));

  tabListBtn.addEventListener("click", () => {
    setActiveTab("list");
    loadPosts();
  });

  tabMyPostsBtn.addEventListener("click", async () => {
    if (!currentUserUid) {
      alert("로그인 후 이용해주세요.");
      return;
    }

    try {
      const posts = await getPosts();
      const myPosts = posts.filter(post => post.fields.userId === currentUserUid);

      if (myPosts.length === 0) {
        storyPostsContainer.innerHTML = "<p>내 게시물이 없습니다.</p>";
      } else {
        storyPostsContainer.innerHTML = ""; // 초기화

        myPosts.forEach(post => {
          const postItem = document.createElement("li");
          postItem.classList.add("post-item");

          const thumbnailDiv = document.createElement("div");
          thumbnailDiv.classList.add("post-thumbnail");

          const img = document.createElement("img");
          img.src = post.fields.imageUrl;
          img.alt = "내 게시물 이미지";

          thumbnailDiv.appendChild(img);

          postItem.appendChild(thumbnailDiv);

          const deleteBtn = document.createElement("button");
          deleteBtn.textContent = "삭제";
          deleteBtn.classList.add("modal-comment-delete-btn");  // 모달용 클래스로 추가
          deleteBtn.addEventListener("click", async (e) => {
            e.stopPropagation(); // 이미지 클릭 이벤트 방지
            if (confirm("이 게시물을 삭제하시겠습니까?")) {
              try {
                await deletePost(post.id);
                alert("게시물이 삭제되었습니다.");
                postItem.remove(); // UI에서도 제거
              } catch (error) {
                alert("삭제 실패: " + error.message);
              }
            }
          });
          postItem.appendChild(deleteBtn);
          
          
          postItem.addEventListener("click", async () => {
            try {
              const res = await fetch(`https://api.airtable.com/v0/${baseId}/${tableName}/${post.id}`, {
                headers: { Authorization: `Bearer ${airtableToken}` }
              });
              if (!res.ok) throw new Error("게시물 상세 불러오기 실패");
              const data = await res.json();

              modalImage.src = data.fields.imageUrl;
              modalCaption.textContent = data.fields.caption || "";
              modalUsername.textContent = `작성자: ${data.fields.username || "익명"}`;
              currentPostId = post.id;

              modal.style.display = "flex";
              loadComments(data.fields.comments);

            } catch (error) {
              alert(error.message);
            }
          });

          storyPostsContainer.appendChild(postItem);
        });
      }

      setActiveTab("myPosts");
      loadPosts();
    } catch (error) {
      alert("내 게시물 불러오기 실패: " + error.message);
    }
  });

  document.getElementById("addBtn").addEventListener("click", async () => {
    const caption = document.getElementById("captionInput").value.trim();
    const image = document.getElementById("imageUrlInput").value.trim();
    const uname = document.getElementById("usernameInput").value.trim() || "익명";

    if (!caption || !image) {
      alert("빈칸을 채워주세요");
      return;
    }

    try {
      await addPost(caption, image, uname, currentUserUid);
      alert("게시물이 성공적으로 등록되었습니다!");

      document.getElementById("captionInput").value = "";
      document.getElementById("imageUrlInput").value = "";
      document.getElementById("usernameInput").value = "";

      setActiveTab("list");
      loadPosts();
    } catch (error) {
      alert("등록 중 오류가 발생했습니다: " + error.message);
    }
  });

  async function loadPosts() {
    try {
      const posts = await getPosts();
      postsList.innerHTML = "";

      posts.forEach(post => {
        const imageUrl = post.fields.imageUrl;
        if (!imageUrl) return;

        const li = document.createElement("li");
        li.classList.add("post-item");
        li.style.cursor = "pointer";
        li.style.marginBottom = "1rem";
        li.innerHTML = `<img src="${imageUrl}" alt="게시물 이미지" style="max-width:100%; border-radius:8px;" />`;

        li.addEventListener("click", async () => {
          try {
            const res = await fetch(`https://api.airtable.com/v0/${baseId}/${tableName}/${post.id}`, {
              headers: { Authorization: `Bearer ${airtableToken}` }
            });
            if (!res.ok) throw new Error("게시물 상세 불러오기 실패");
            const data = await res.json();

            modalImage.src = data.fields.imageUrl;
            modalCaption.textContent = data.fields.caption || "";
            modalUsername.textContent = `작성자: ${data.fields.username || "익명"}`;
            currentPostId = post.id;

            modal.style.display = "flex";
            loadComments(data.fields.comments);

          } catch (error) {
            alert(error.message);
          }
        });

        postsList.appendChild(li);
      });

    } catch (error) {
      alert("게시물 목록 불러오기 실패: " + error.message);
    }
  }

  function closeModal() {
    modal.style.display = "none";
    commentList.innerHTML = "";
    currentPostId = null;
  }

  modalClose.addEventListener("click", () => {
    closeModal();
  });

  addEventListener("keydown", (e) => {
    if (e.key == "Enter" || e.key == "Escape") closeModal();
  });

  onAuthStateChanged((uid) => {
    currentUserUid = uid;

    if (uid) {
    setActiveTab("list");
    loadPosts();
  }
  });

  document.getElementById("logoutBtn").addEventListener("click", async () => {
    try {
      await logout();
      alert("로그아웃 되었습니다.");
      window.location.replace("index.html");
    } catch (error) {
      alert("로그아웃 실패: " + error.message);
    }
  });
});
