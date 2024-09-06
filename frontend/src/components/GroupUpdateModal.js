import React, { useState } from "react";
import styles from "./GroupUpdateModal.module.css";
import { ReactComponent as CloseIcon } from "../assets/icon_x.svg";
import { ReactComponent as ToggleActiveIcon } from "../assets/toggle_active.svg";
import { ReactComponent as ToggleInactiveIcon } from "../assets/toggle_inactive.svg";
import { uploadImage } from "../api/imageApi";
import { updateGroup } from "../api/groupApi";

function GroupUpdateModal({ group, onClose, onSave }) {
  const [groupName, setGroupName] = useState(group.name || "");
  const [groupDescription, setGroupDescription] = useState(
    group.introduction || ""
  );
  const [groupPassword, setGroupPassword] = useState(""); // 비밀번호 상태
  const [imageUrl, setImageUrl] = useState(group.imageUrl || ""); // 기존 이미지 URL
  const [isPublic, setIsPublic] = useState(group.isPublic || false);
  const [errorMessage, setErrorMessage] = useState(""); // 에러 메시지 상태

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const uploadedImageUrl = await uploadImage(file); // 이미지 업로드 후 URL 반환
        setImageUrl(uploadedImageUrl); // 업로드된 이미지 URL을 상태로 설정
      } catch (error) {
        console.error("이미지 업로드 실패:", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 비밀번호 유효성 검사
    if (!groupPassword) {
      setErrorMessage("비밀번호를 입력해주세요.");
      return;
    }

    const updatedGroupData = {
      name: groupName,
      password: groupPassword,
      imageUrl: imageUrl, // 업로드된 이미지 URL 포함
      isPublic: isPublic,
      introduction: groupDescription,
    };

    try {
      await updateGroup(group.id, updatedGroupData);
      onSave(updatedGroupData); // 부모 컴포넌트로 수정된 데이터 전달
      onClose(); // 모달 닫기
    } catch (error) {
      console.error("그룹 수정 실패:", error);
      setErrorMessage("그룹 수정에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>그룹 정보 수정</h2>
          <CloseIcon onClick={onClose} className={styles.closeIcon} />
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="groupName">그룹명</label>
            <input
              id="groupName"
              name="groupName"
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="groupImage">대표 이미지</label>
            <div className={styles.fileInputWrapper}>
              <input
                id="groupImageUrl"
                name="groupImageUrl"
                type="text"
                value={imageUrl}
                readOnly
                placeholder="파일을 선택해주세요."
              />
              <input
                id="groupImage"
                name="groupImage"
                type="file"
                style={{ display: "none" }}
                onChange={handleImageChange}
              />
              <button
                type="button"
                onClick={() => document.getElementById("groupImage").click()}
              >
                파일 선택
              </button>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="groupDescription">그룹 소개</label>
            <textarea
              id="groupDescription"
              name="groupDescription"
              value={groupDescription}
              onChange={(e) => setGroupDescription(e.target.value)}
              placeholder="그룹을 소개해 주세요"
            ></textarea>
          </div>

          <div className={styles.formGroup}>
            <label>그룹 공개 선택</label>
            <div className={styles.toggleLabelWrapper}>
              <label className={styles.toggleLabel}>공개</label>
              <div
                onClick={() => setIsPublic(!isPublic)}
                className={styles.toggleButton}
              >
                {isPublic ? <ToggleActiveIcon /> : <ToggleInactiveIcon />}
              </div>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="groupPassword">수정 권한 인증</label>
            <input
              id="groupPassword"
              name="groupPassword"
              type="password"
              value={groupPassword}
              onChange={(e) => setGroupPassword(e.target.value)}
              placeholder="비밀번호를 입력해주세요"
            />
            {errorMessage && (
              <div className={styles.errorMessage}>{errorMessage}</div>
            )}
          </div>

          <button type="submit" className={styles.saveButton}>
            수정하기
          </button>
        </form>
      </div>
    </div>
  );
}

export default GroupUpdateModal;
