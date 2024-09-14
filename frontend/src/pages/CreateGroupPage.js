import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CreateGroupPage.module.css";
import { ReactComponent as Logo } from "../assets/logo.svg";
import { ReactComponent as ToggleActiveIcon } from "../assets/toggle_active.svg";
import { ReactComponent as ToggleInactiveIcon } from "../assets/toggle_inactive.svg";
import { createGroup } from "../api/groupApi";
import { uploadImage } from "../api/imageApi";
import Modal from "../components/Modal";

function CreateGroupPage() {
  const [isPublic, setIsPublic] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", message: "" });
  const [errorMessage, setErrorMessage] = useState(""); // 에러 메시지 상태 추가

  const navigate = useNavigate();

  const handleToggleChange = () => {
    setIsPublic(!isPublic);
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleFileSelect = () => {
    const fileInput = document.getElementById("groupImage");
    fileInput.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    if (file) {
      try {
        const imageUrl = await uploadImage(file);
        document.getElementById("groupImageUrl").value = imageUrl; // 이미지 URL 설정
      } catch (error) {
        console.error("이미지 업로드 실패:", error);
        alert("이미지 업로드에 실패했습니다.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const groupName = e.target.groupName.value.trim();
    const groupImageUrl = e.target.groupImageUrl.value.trim();
    const groupDescription = e.target.groupDescription.value.trim();
    const groupPassword = e.target.groupPassword.value.trim();

    // 특수문자 검증: 허용된 특수문자 외에는 경고 메시지 출력
    const allowedSpecialChars = /^[a-zA-Z0-9\uAC00-\uD7A3!@#$%^_]+$/;

    if (!allowedSpecialChars.test(groupName)) {
      setErrorMessage("특수문자는 !@#$%^_ 만 사용하실 수 있습니다.");
      return;
    }

    if (!groupName || !groupDescription || !groupPassword) {
      alert("모든 필드를 작성해주세요.");
      return;
    }

    setErrorMessage(""); // 에러 메시지 초기화

    const groupData = {
      name: groupName,
      password: groupPassword,
      imageUrl: groupImageUrl,
      isPublic: isPublic,
      introduction: groupDescription,
    };

    try {
      await createGroup(groupData);
      setModalContent({
        title: "그룹 만들기 성공",
        message: "그룹이 성공적으로 등록되었습니다.",
      });
      setModalOpen(true);

      // 1초 지연 후 홈 페이지로 리디렉션
      setTimeout(() => {
        navigate("/");
      }, 1000); // 1초 지연
    } catch (error) {
      setModalContent({
        title: "그룹 만들기 실패",
        message: "그룹 등록에 실패했습니다.",
      });
      setModalOpen(true);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    document.getElementById("groupName").value = "";
    document.getElementById("groupImageUrl").value = "";
    document.getElementById("groupImage").value = ""; // 파일 선택 필드 초기화
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
        <div className={styles.formGroup}>
          <label htmlFor="groupName">그룹명</label>
          <input
            id="groupName"
            name="groupName"
            type="text"
            placeholder="그룹명을 입력하세요"
            className={errorMessage ? styles.inputError : ""}
          />
          {errorMessage && (
            <div className={styles.errorMessage}>{errorMessage}</div>
          )}
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="groupImageUrl">대표 이미지</label>
          <div className={styles.fileInputWrapper}>
            <input
              id="groupImageUrl"
              name="groupImageUrl"
              type="text"
              placeholder="파일을 선택해주세요."
              readOnly
            />
            <input
              id="groupImage"
              name="groupImage"
              type="file"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <button type="button" onClick={handleFileSelect}>
              파일 선택
            </button>
          </div>
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
