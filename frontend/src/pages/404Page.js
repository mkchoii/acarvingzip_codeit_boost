import React from "react";
import { useNavigate } from "react-router-dom";
import { ReactComponent as Logo } from "../assets/logo.svg"; // 로고 SVG
import { ReactComponent as NotFoundImage } from "../assets/404.svg"; // 404 SVG 이미지
import styles from "./404Page.module.css"; // 스타일 파일

function NotFoundPage() {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/"); // 로고 클릭 시 메인 페이지로 이동
  };

  return (
    <div className={styles.container}>
      <div onClick={handleLogoClick} className={styles.logo}>
        <Logo />
      </div>
      <NotFoundImage className={styles.notFoundImage} />
    </div>
  );
}

export default NotFoundPage;
