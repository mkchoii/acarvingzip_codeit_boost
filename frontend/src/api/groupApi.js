// 그룹 등록
export const createGroup = async (groupData) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/groups`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(groupData), // JSON 문자열로 변환하여 전송
      }
    );

    if (!response.ok) {
      const errorText = await response.text(); // 응답이 JSON이 아니면 텍스트로 에러 확인
      console.error("Error response:", errorText);
      throw new Error("그룹 생성에 실패했습니다.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

// 그룹 목록 조회
export const fetchGroups = async (
  page,
  pageSize,
  sortBy,
  keyword,
  isPublic
) => {
  try {
    const queryParams = new URLSearchParams();

    if (page !== undefined && page !== null) queryParams.append("page", page);
    if (pageSize !== undefined && pageSize !== null)
      queryParams.append("pageSize", pageSize);
    if (sortBy) queryParams.append("sortBy", sortBy);
    if (keyword) queryParams.append("keyword", keyword);
    if (typeof isPublic === "boolean")
      queryParams.append("isPublic", isPublic.toString());

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/groups?${queryParams.toString()}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error from server:", errorData);
      throw new Error(errorData.message || "그룹 목록 조회에 실패했습니다.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

// 비공개 그룹 접근 권한 확인
export const checkPrivateGroupAccess = async (groupId, password) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/groups/${groupId}/verify-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error from server:", errorData);
      throw new Error(
        errorData.message || "비공개 그룹 접근 권한 확인에 실패했습니다."
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

// 그룹 상세 정보 조회
export const fetchGroupDetail = async (groupId) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/groups/${groupId}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      if (response.status === 400) {
        const errorData = await response.json();
        throw new Error(errorData.message || "잘못된 요청입니다");
      }
      throw new Error("그룹 상세 정보를 가져오는 데 실패했습니다.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching group detail:", error);
    throw error;
  }
};

// 그룹 수정
export const updateGroup = async (groupId, groupData) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/groups/${groupId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(groupData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();

      if (response.status === 400) {
        throw new Error(errorData.message || "잘못된 요청입니다.");
      } else if (response.status === 403) {
        throw new Error("비밀번호가 틀렸습니다.");
      } else if (response.status === 404) {
        throw new Error("존재하지 않는 그룹입니다.");
      } else {
        throw new Error("그룹 정보를 수정하는 데 실패했습니다.");
      }
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating group:", error);
    throw error;
  }
};

// 그룹 삭제
export const deleteGroup = async (groupId, password) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/groups/${groupId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }), // 비밀번호
      }
    );

    if (!response.ok) {
      const errorData = await response.json();

      if (response.status === 400) {
        throw new Error(errorData.message || "잘못된 요청입니다.");
      } else if (response.status === 403) {
        throw new Error("비밀번호가 틀렸습니다.");
      } else if (response.status === 404) {
        throw new Error("존재하지 않는 그룹입니다.");
      } else {
        throw new Error("그룹을 삭제하는 데 실패했습니다.");
      }
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting group:", error);
    throw error;
  }
};

// 그룹 공감하기 버튼
export const likeGroup = async (groupId) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/groups/${groupId}/like`,
      {
        method: "POST",
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("존재하지 않는 그룹입니다.");
      } else {
        throw new Error("그룹 공감하기에 실패했습니다.");
      }
    }

    return await response.json();
  } catch (error) {
    console.error("Error liking group:", error);
    throw error;
  }
};
