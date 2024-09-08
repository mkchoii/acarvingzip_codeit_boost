// 게시글 생성 (추억 올리기)
export const createPost = async (groupId, postData) => {
  try {
    const response = await fetch(`/api/groups/${groupId}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      if (response.status === 400) {
        const errorData = await response.json();
        throw new Error(errorData.message || "잘못된 요청입니다.");
      } else {
        throw new Error("게시글 생성에 실패했습니다.");
      }
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
};

// 비공개 게시글 접근 권한 확인
export const checkPrivatePostAccess = async (postId, password) => {
  try {
    const response = await fetch(`/api/posts/${postId}/verify-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        const errorData = await response.json();
        throw new Error(errorData.message || "비밀번호 확인에 실패했습니다.");
      } else {
        throw new Error("비공개 게시글 접근 권한 확인에 실패했습니다.");
      }
    }

    return await response.json();
  } catch (error) {
    console.error("Error checking private post access:", error);
    throw error;
  }
};

// 게시글 상세 정보 조회
export const getPostDetail = async (postId) => {
  try {
    const response = await fetch(`/api/posts/${postId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 400) {
        const errorData = await response.json();
        throw new Error(errorData.message || "잘못된 요청입니다.");
      } else {
        throw new Error("게시글 정보를 불러오는데 실패했습니다.");
      }
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching post detail:", error);
    throw error;
  }
};

// 게시글 공감하기
export const likePost = async (postId) => {
  try {
    const response = await fetch(`/api/posts/${postId}/like`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        const errorData = await response.json();
        throw new Error(errorData.message || "존재하지 않는 게시글입니다.");
      } else {
        throw new Error("게시글 공감에 실패했습니다.");
      }
    }

    return await response.json();
  } catch (error) {
    console.error("Error liking post:", error);
    throw error;
  }
};

// 게시글 삭제
export const deletePost = async (postId, postPassword) => {
  try {
    const response = await fetch(`/api/posts/${postId}/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ postPassword }),
    });

    // 응답 처리
    if (response.ok) {
      const data = await response.json();
      return { success: true, message: data.message }; // 성공 응답
    } else if (response.status === 400) {
      const errorData = await response.json();
      throw new Error(errorData.message || "잘못된 요청입니다.");
    } else if (response.status === 403) {
      const errorData = await response.json();
      throw new Error(errorData.message || "비밀번호가 틀렸습니다.");
    } else if (response.status === 404) {
      const errorData = await response.json();
      throw new Error(errorData.message || "게시글이 존재하지 않습니다.");
    } else {
      throw new Error("게시글 삭제에 실패했습니다.");
    }
  } catch (error) {
    console.error("Error deleting post:", error);
    return { success: false, message: error.message };
  }
};
