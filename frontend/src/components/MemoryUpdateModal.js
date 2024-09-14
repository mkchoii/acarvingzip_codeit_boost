import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // useParams 추가
import styles from "./MemoryUpdateModal.module.css";
import { uploadImage } from "../api/imageApi";
import { updatePost } from "../api/postApi";
import { ReactComponent as CloseIcon } from "../assets/icon_x.svg";
import { ReactComponent as ToggleActiveIcon } from "../assets/toggle_active.svg";
import { ReactComponent as ToggleInactiveIcon } from "../assets/toggle_inactive.svg";

function MemoryUpdateModal({ post, onClose, onSave }) {
  const { postId } = useParams(); // URL에서 postId 가져오기
  const [formData, setFormData] = useState({
    nickname: "",
    title: "",
    content: "",
    imageUrl: "",
    tags: [],
    location: "",
    moment: "",
    isPublic: true,
    postPassword: "",
  });

  const [imageUploading, setImageUploading] = useState(false);
  const [imageError, setImageError] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (post) {
      setFormData({
        nickname: post.nickname || "",
        title: post.title || "",
        content: post.content || "",
        imageUrl: post.imageUrl || "",
        tags: Array.isArray(post.tags) ? post.tags : [],
        location: post.location || "",
        moment: post.moment || "",
        isPublic: post.isPublic || true,
        postPassword: "",
      });
    }
  }, [post]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageUploading(true);
    setImageError(null);

    try {
      const imageUrl = await uploadImage(file);
      setFormData((prevData) => ({
        ...prevData,
        imageUrl,
      }));
      setImageUploading(false);
    } catch (error) {
      setImageError("이미지 업로드에 실패했습니다. 다시 시도해 주세요.");
      setImageUploading(false);
    }
  };

  const handleToggleChange = () => {
    setFormData((prevData) => ({
      ...prevData,
      isPublic: !prevData.isPublic,
    }));
  };

  const handleTagInput = (e) => {
    setTagInput(e.target.value);
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      e.preventDefault();
      setFormData((prevData) => ({
        ...prevData,
        tags: [...prevData.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prevData) => ({
      ...prevData,
      tags: prevData.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async () => {
    setSubmitError(null);
    const updatedPost = {
      ...formData,
      tags: formData.tags.map((tag) => tag.trim()),
    };

    try {
      setLoading(true);
      const updatedData = await updatePost(postId, updatedPost); // postId를 URL에서 가져옴
      onSave(updatedData);
      setLoading(false);
      onClose();
    } catch (error) {
      setSubmitError(error.message);
      setLoading(false);
    }
  };

  // useEffect를 이용하여 placeholder 설정
  useEffect(() => {
    const momentInput = document.getElementById("moment");
    momentInput.placeholder = "YYYY-MM-DD";
  }, []);

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>추억 수정</h2>
          <button onClick={onClose} className={styles.closeButton}>
            <CloseIcon />
          </button>
        </div>
        {submitError && (
          <div className={styles.errorMessage}>{submitError}</div>
        )}
        <div className={styles.form}>
          <div className={styles.leftColumn}>
            <div className={styles.formGroup}>
              <label htmlFor="nickname">닉네임</label>
              <input
                type="text"
                id="nickname"
                name="nickname"
                value={formData.nickname}
                onChange={handleInputChange}
                placeholder="닉네임을 입력해 주세요"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="title">제목</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="제목을 입력해 주세요"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="imageUrl">이미지</label>
              <div className={styles.fileInputWrapper}>
                <input
                  type="text"
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl}
                  readOnly
                  placeholder="파일을 선택해주세요."
                />
                <input
                  type="file"
                  id="imageFile"
                  name="imageFile"
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                />
                <button
                  type="button"
                  className={styles.fileSelectButton}
                  onClick={() => document.getElementById("imageFile").click()}
                >
                  파일 선택
                </button>
              </div>
              {imageUploading && <div>이미지 업로드 중...</div>}
              {imageError && (
                <div className={styles.errorMessage}>{imageError}</div>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="content">본문</label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="본문 내용을 입력해 주세요"
              />
            </div>
          </div>

          <div className={styles.rightColumn}>
            <div className={styles.formGroup}>
              <label htmlFor="tags">태그</label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={tagInput}
                onChange={handleTagInput}
                onKeyDown={handleTagKeyDown}
                placeholder="태그 입력 후 Enter"
              />
              <div className={styles.tagList}>
                {formData.tags.map((tag, index) => (
                  <span key={index} className={styles.tag}>
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className={styles.removeTagButton}
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="location">장소</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="장소를 입력해 주세요"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="moment">추억의 순간</label>
              <input
                type="date"
                id="moment"
                name="moment"
                value={formData.moment}
                onChange={handleInputChange}
                pattern="\d{4}-\d{2}-\d{2}"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>추억 공개 선택</label>
              <div className={styles.toggleWrapper}>
                <span className={styles.toggleLabel}>공개</span>
                <div
                  onClick={handleToggleChange}
                  className={styles.toggleButton}
                >
                  {formData.isPublic ? (
                    <ToggleActiveIcon className={styles.toggleIcon} />
                  ) : (
                    <ToggleInactiveIcon className={styles.toggleIcon} />
                  )}
                </div>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="postPassword">수정 권한 인증</label>
              <input
                type="password"
                id="postPassword"
                name="postPassword"
                value={formData.postPassword}
                onChange={handleInputChange}
                placeholder="비밀번호를 입력해 주세요"
              />
            </div>
          </div>
        </div>
        <div className={styles.separator}></div>
        <div className={styles.centerButton}>
          <button
            onClick={handleSubmit}
            disabled={loading || imageUploading}
            className={styles.submitButton}
          >
            {loading || imageUploading ? "수정 중..." : "수정하기"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MemoryUpdateModal;
