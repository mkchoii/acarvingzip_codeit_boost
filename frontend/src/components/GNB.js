import { useNavigate } from "react-router-dom";
import { ReactComponent as Logo } from "../assets/logo.svg";
import { ReactComponent as CreateGroupButton } from "../assets/makingButton_M.svg";
import styles from "./GNB.module.css";

function GNB() {
  const navigate = useNavigate();

  const handleCreateGroupClick = () => {
    navigate("/create-group"); // 버튼 클릭 시 create-group 경로로 이동
  };

  return (
    <nav className={styles.gnb}>
      <div className={styles.logo}>
        <Logo />
      </div>
      <div className={styles.button} onClick={handleCreateGroupClick}>
        <CreateGroupButton />
      </div>
    </nav>
  );
}

export default GNB;
