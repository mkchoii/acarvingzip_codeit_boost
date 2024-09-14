import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { uploadImage } from "../api/imageApi";
import { createPost } from "../api/postApi";
import styles from "./MemoryUploadPage.module.css";
import { ReactComponent as Logo } from "../assets/logo.svg";
import { ReactComponent as ToggleActiveIcon } from "../assets/toggle_active.svg";
import { ReactComponent as ToggleInactiveIcon } from "../assets/toggle_inactive.svg";

function MemoryUploadPage() {
  const { groupId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nickname: "",
    title: "",
    content: "",
    postPassword: "",
    imageUrl: "",
    tags: [],
    location: "",
    moment: "",
    isPublic: true,
  });

  const [tagInput, setTagInput] = useState("");
  const [uploadError, setUploadError] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  const handleLogoClick = () => {
    navigate("/");
  };

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

    setUploadError(null);

    try {
      const imageUrl = await uploadImage(file);
      setFormData((prevData) => ({
        ...prevData,
        imageUrl,
      }));
    } catch (error) {
      console.error("Image upload failed:", error);
      setUploadError("이미지 업로드에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    try {
      const postData = {
        ...formData,
        tags: formData.tags.map((tag) => tag.trim()),
      };
      await createPost(groupId, postData);
      console.log("Post created successfully");
      navigate(`/group/${groupId}`);
    } catch (error) {
      console.error("Error creating post:", error);
      setSubmitError(error.message || "게시글 생성 중 오류가 발생했습니다.");
    }
  };

  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (tagInput.trim() !== "") {
        setFormData((prevData) => ({
          ...prevData,
          tags: [...prevData.tags, tagInput.trim()],
        }));
        setTagInput("");
      }
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prevData) => ({
      ...prevData,
      tags: prevData.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleToggleChange = () => {
    setFormData((prevData) => ({
      ...prevData,
      isPublic: !prevData.isPublic,
    }));
  };

  // useEffect를 이용하여 placeholder 설정
  useEffect(() => {
    const momentInput = document.getElementById("moment");
    momentInput.placeholder = "YYYY-MM-DD";
  }, []);

  return (
    <div className={styles.memoryUploadPage}>
      <div className={styles.header}>
        <Logo className={styles.logo} onClick={handleLogoClick} />
        <h1 className={styles.title}>추억 올리기</h1>
      </div>
      <form
        onSubmit={handleSubmit}
        className={styles.memoryUploadForm}
        noValidate
      >
        <div className={styles.formColumns}>
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
                required
                className={submitError ? styles.inputError : ""}
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
                required
                className={submitError ? styles.inputError : ""}
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
                  onClick={() => document.getElementById("imageFile").click()}
                >
                  파일 선택
                </button>
              </div>
              {uploadError && (
                <div className={styles.errorMessage}>{uploadError}</div>
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
                required
                className={submitError ? styles.inputError : ""}
              />
            </div>
          </div>
          <div className={styles.separator}></div>
          <div className={styles.rightColumn}>
            <div className={styles.formGroup}>
              <label htmlFor="tags">태그</label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={tagInput}
                onChange={handleTagInputChange}
                onKeyDown={handleTagKeyDown}
                placeholder="#태그를 입력해 주세요"
              />
              <div className={styles.tagsContainer}>
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
                pattern="\d{4}-\d{2}-\d{2}" /* YYYY-MM-DD 형식을 강제하는 패턴 */
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>추억 공개 선택</label>
              <div className={styles.toggleLabelWrapper}>
                <label className={styles.toggleLabel}>공개</label>
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
              <label htmlFor="postPassword">비밀번호</label>
              <input
                type="password"
                id="postPassword"
                name="postPassword"
                value={formData.postPassword}
                onChange={handleInputChange}
                placeholder="비밀번호를 입력해 주세요"
                required
                className={submitError ? styles.inputError : ""}
              />
            </div>
          </div>
        </div>
        <div className={styles.submitContainer}>
          <button type="submit" className={styles.submitButton}>
            올리기
          </button>
        </div>
      </form>
    </div>
  );
}

export default MemoryUploadPage;
