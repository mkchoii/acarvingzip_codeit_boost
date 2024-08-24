import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CreateGroupPage.module.css";
import { ReactComponent as Logo } from "../assets/logo.svg";
import { ReactComponent as ToggleActiveIcon } from "../assets/toggle_active.svg";
import { ReactComponent as ToggleInactiveIcon } from "../assets/toggle_inactive.svg";
import { createGroup } from "../api/groupApi"; // API 호출 함수
import Modal from "../components/Modal"; // 모달 컴포넌트

function CreateGroupPage() {
  const [isPublic, setIsPublic] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", message: "" });

  const navigate = useNavigate(); // useNavigate 훅으로 navigate 초기화

  const handleToggleChange = () => {
    setIsPublic(!isPublic);
  };

  const handleLogoClick = () => {
    navigate("/"); // 홈 화면으로 이동
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 심플한 유효성 검사
    const groupName = e.target.groupName.value.trim();
    const groupImage = e.target.groupImage.files[0];
    const groupDescription = e.target.groupDescription.value.trim();
    const groupPassword = e.target.groupPassword.value.trim();

    if (!groupName || !groupImage || !groupDescription || !groupPassword) {
      alert("모든 필드를 작성해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("name", groupName); // 그룹명 필드
    formData.append("password", groupPassword); // 비밀번호 필드
    formData.append("imageUrl", groupImage); // 이미지 파일 필드
    formData.append("isPublic", isPublic); // 공개 여부 필드
    formData.append("introduction", groupDescription); // 그룹 소개 필드

    try {
      await createGroup(formData);
      setModalContent({
        title: "그룹 만들기 성공",
        message: "그룹이 성공적으로 등록되었습니다.",
      });
    } catch (error) {
      setModalContent({
        title: "그룹 만들기 실패",
        message: "그룹 등록에 실패했습니다.",
      });
    } finally {
      setModalOpen(true);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    document.getElementById("groupName").value = "";
    document.getElementById("groupImage").value = "";
    document.getElementById("groupDescription").value = "";
    document.getElementById("groupPassword").value = "";
    setIsPublic(true);
  };

  return (
    <div className={styles.createGroupPage}>
      <div className={styles.header}>
        <Logo className={styles.logo} onClick={handleLogoClick} />
        <h1 className={styles.title}>그룹 만들기</h1>
      </div>
      <form onSubmit={handleSubmit} noValidate>
        {" "}
        {/* 기본 유효성 검사 비활성화 */}
        <div className={styles.formGroup}>
          <label htmlFor="groupName">그룹명</label>
          <input
            id="groupName"
            name="groupName"
            type="text"
            placeholder="그룹명을 입력하세요"
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="groupImage">대표 이미지</label>
          <input
            id="groupImage"
            name="groupImage"
            type="file"
            accept="image/*"
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="groupDescription">그룹 소개</label>
          <textarea
            id="groupDescription"
            name="groupDescription"
            placeholder="그룹을 소개해 주세요"
          ></textarea>
        </div>
        <div className={styles.formGroup}>
          <label>그룹 공개 선택</label>
          <div className={styles.toggleLabelWrapper}>
            <label className={styles.toggleLabel}>공개</label>
            <div onClick={handleToggleChange} className={styles.toggleButton}>
              {isPublic ? (
                <ToggleActiveIcon className={styles.toggleIcon} />
              ) : (
                <ToggleInactiveIcon className={styles.toggleIcon} />
              )}
            </div>
          </div>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="groupPassword">비밀번호 생성</label>
          <input
            id="groupPassword"
            name="groupPassword"
            type="password"
            placeholder="그룹 비밀번호를 생성해 주세요"
          />
        </div>
        <button type="submit" className={styles.submitButton}>
          만들기
        </button>
      </form>

      {modalOpen && (
        <Modal
          title={modalContent.title}
          message={modalContent.message}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

export default CreateGroupPage;
