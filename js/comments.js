import { patchPost } from './posts.js';

export function setupCommentFeature(currentPostIdRef, getPostData, dom, currentUserUid) {
  const { commentList, commentInput, commentAuthorInput, addCommentBtn } = dom;
  
  function loadComments(comments) {
    commentList.innerHTML = "";
    let parsed = [];

    if (!comments) parsed = [];
    else if (typeof comments === "string") {
      try {
        parsed = JSON.parse(comments);
      } catch {
        parsed = [];
      }
    } else if (typeof comments === "object") {
      parsed = comments;
    }

    parsed.forEach((c, idx) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${c.author || "익명"}</strong> <small>${new Date(c.createdAt).toLocaleString()}</small>
        <p>${c.text}</p>
      `;

      // 댓글 작성자 UID가 현재 로그인 유저 UID와 같을 때만 삭제 버튼 생성
      if (c.userId && currentUserUid && c.userId === currentUserUid()) {
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "삭제";
        deleteBtn.dataset.index = idx;
        deleteBtn.classList.add("del-btn");
        deleteBtn.addEventListener("click", () => {
          deleteComment(idx);
        });
        li.appendChild(deleteBtn);
      }

      commentList.appendChild(li);
    });
  }

  async function deleteComment(index) {
    const confirmed = confirm("정말로 이 댓글을 삭제하시겠습니까?");
    if (!confirmed) return;
    const postId = currentPostIdRef();
    if (!postId) return;

    try {
      const postData = await getPostData(postId);
      const existing = postData.fields.comments ? JSON.parse(postData.fields.comments) : [];
      existing.splice(index, 1);

      await patchPost(postId, { comments: JSON.stringify(existing) });
      loadComments(existing);

          alert("댓글이 삭제되었습니다.");
    } catch (err) {
      alert("댓글 삭제 실패");
      console.error(err);
    }
  }

  addCommentBtn.addEventListener("click", async () => {
      console.log("Clicked add comment, currentUserUid:", currentUserUid());
    const postId = currentPostIdRef();
    const text = commentInput.value.trim();
    const author = commentAuthorInput.value.trim() || "익명";

    if (!text || !postId) return alert("댓글과 작성자를 입력하세요.");

    try {
      const postData = await getPostData(postId);
      const existing = postData.fields.comments ? JSON.parse(postData.fields.comments) : [];

      const newComment = {
        text,
        author,
        createdAt: new Date().toISOString(),
        userId: currentUserUid() // 댓글 작성자 UID 추가
      };

      const updated = [...existing, newComment];

      await patchPost(postId, { comments: JSON.stringify(updated) });

      commentInput.value = "";
      commentAuthorInput.value = "";
      loadComments(updated);
    } catch (err) {
      alert("댓글 추가 실패");
      console.error(err);
    }
  });

  return { loadComments };
}
