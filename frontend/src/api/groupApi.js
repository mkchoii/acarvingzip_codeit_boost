// 그룹 등록
export const createGroup = async (groupData) => {
  try {
    const response = await fetch("/api/groups", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(groupData), // JSON 문자열로 변환하여 전송
    });

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

    const response = await fetch(`/api/groups?${queryParams.toString()}`, {
      method: "GET",
    });

    if (!response.ok) {
      // 서버에서 반환된 에러 메시지 처리
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
    const response = await fetch(`/api/groups/${groupId}/access`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    });

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
