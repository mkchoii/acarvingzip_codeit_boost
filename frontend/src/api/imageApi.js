// 이미지 업로드 API 함수
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file); // 서버가 기대하는 "image" 필드에 파일 추가

  const response = await fetch(`${process.env.REACT_APP_API_URL}/api/image`, {
    method: "POST",
    headers: {
      // 'Content-Type'은 명시적으로 설정하지 않음.
      // 브라우저가 FormData를 사용할 때 적절한 Content-Type을 자동으로 설정
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("이미지 업로드에 실패했습니다.");
  }

  const data = await response.json();
  return data.imageUrl; // 서버가 반환한 이미지 URL
};
