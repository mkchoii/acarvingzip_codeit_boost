import React from "react";
import { ReactComponent as PublicActiveIcon } from "../assets/public_active.svg";
import { ReactComponent as PublicInactiveIcon } from "../assets/public_inactive.svg";
import { ReactComponent as PrivateActiveIcon } from "../assets/private_active.svg";
import { ReactComponent as PrivateInactiveIcon } from "../assets/private_inactive.svg";
import { ReactComponent as SearchIcon } from "../assets/icon_search.svg";
import styles from "./SearchBar.module.css";
import Dropdown from "./Dropdown";

function SearchBar({
  searchTerm,
  onSearchChange,
  selectedFilter,
  onFilterChange,
  activeTab,
  onTabChange,
}) {
  return (
    <div className={styles.searchBar}>
      {/* 왼쪽의 공개/비공개 탭 */}
      <div className={styles.tabs}>
        <div className={styles.tabButton} onClick={() => onTabChange("public")}>
          {activeTab === "public" ? (
            <PublicActiveIcon className={styles.tabIcon} />
          ) : (
            <PublicInactiveIcon className={styles.tabIcon} />
          )}
        </div>
        <div
          className={styles.tabButton}
          onClick={() => onTabChange("private")}
        >
          {activeTab === "private" ? (
            <PrivateActiveIcon className={styles.tabIcon} />
          ) : (
            <PrivateInactiveIcon className={styles.tabIcon} />
          )}
        </div>
      </div>

      {/* 검색 입력 필드 */}
      <div className={styles.searchInputWrapper}>
        <SearchIcon className={styles.searchIcon} />
        <input
          type="text"
          placeholder="그룹명을 검색해 주세요"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {/* 오른쪽의 드롭다운 */}
      <Dropdown
        options={["공감순", "댓글순", "최신순"]}
        selectedOption={selectedFilter}
        onOptionSelect={onFilterChange}
      />
    </div>
  );
}

export default SearchBar;
