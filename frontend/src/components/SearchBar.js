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
  const sortOptions = ["최신순", "게시물순", "공감순", "배지순"];

  const mapFilterToSortBy = (filter) => {
    switch (filter) {
      case "최신순":
        return "latest";
      case "게시물순":
        return "mostPosted";
      case "공감순":
        return "mostLiked";
      case "배지순":
        return "mostBadge";
      default:
        return "latest";
    }
  };

  return (
    <div className={styles.searchBar}>
      {/* 왼쪽의 공개/비공개 탭 */}
      <div className={styles.tabs}>
        <div className={styles.tabButton} onClick={() => onTabChange(true)}>
          {activeTab === true ? (
            <PublicActiveIcon className={styles.tabIcon} />
          ) : (
            <PublicInactiveIcon className={styles.tabIcon} />
          )}
        </div>
        <div className={styles.tabButton} onClick={() => onTabChange(false)}>
          {activeTab === false ? (
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
        options={sortOptions}
        selectedOption={selectedFilter}
        onOptionSelect={(option) => onFilterChange(mapFilterToSortBy(option))}
      />
    </div>
  );
}

export default SearchBar;
