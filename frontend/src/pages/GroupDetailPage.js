import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import mockGroups from "../api/mockGroups"; // 여전히 mockGroups를 사용
import { ReactComponent as Logo } from "../assets/logo.svg";
import { ReactComponent as LikeButtonIcon } from "../assets/likeButton.svg";
import GroupLikeBadge from "../assets/badge_groupLike.png";
import PostBadge from "../assets/badge_post.png";
import PostLikeBadge from "../assets/badge_postLike.png";
import PrivateGroupDetail from "../pages/PrivateGroupDetail";
import PublicGroupDetail from "../pages/PublicGroupDetail";
import GroupDeleteModal from "../components/GroupDeleteModal";
import GroupUpdateModal from "../components/GroupUpdateModal";
import styles from "./GroupDetailPage.module.css";
import { likeGroup, updateGroup, deleteGroup } from "../api/groupApi";
import { fetchPostList } from "../api/postApi"; // 실제 게시글 목록 조회 API 사용

function GroupDetailPage() {
  const { groupId } = useParams();
  const [groupDetail, setGroupDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("mostLiked");
  const [activeTab, setActiveTab] = useState("public");
  const [filteredMemories, setFilteredMemories] = useState([]);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/");
  };

  const calculateDday = (createdAt) => {
    const createdDate = new Date(createdAt);
    const today = new Date();
    const diffTime = Math.abs(today - createdDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `D+${diffDays}`;
  };

  // 게시글이 7일 연속으로 작성되었는지 확인하는 함수
  const checkConsecutivePosts = (posts) => {
    const dates = posts.map((post) => new Date(post.createdAt));
    dates.sort((a, b) => a - b); // 날짜 순으로 정렬

    let consecutiveCount = 1;
    for (let i = 1; i < dates.length; i++) {
      const diffDays = (dates[i] - dates[i - 1]) / (1000 * 60 * 60 * 24);
      if (diffDays === 1) {
        consecutiveCount++;
        if (consecutiveCount >= 7) return true;
      } else {
        consecutiveCount = 1; // 연속되지 않으면 카운트 리셋
      }
    }
    return false;
  };

  useEffect(() => {
    const loadGroupDetail = async () => {
      try {
        // 여전히 mockGroups를 사용하여 그룹 데이터를 로드하는 부분
        const group = mockGroups.find(
          (group) => group.id === parseInt(groupId)
        );

        if (!group) {
          throw new Error("그룹을 찾을 수 없습니다.");
        }

        group.days = calculateDday(group.createdAt);
        setGroupDetail(group);
        setLoading(false);
      } catch (err) {
        setError("그룹 정보를 불러오는 중 오류가 발생했습니다.");
        setLoading(false);
      }
    };

    loadGroupDetail();
  }, [groupId]);

  useEffect(() => {
    const loadPostList = async () => {
      if (!groupDetail) return;

      try {
        const response = await fetchPostList({
          page: 1,
          pageSize: 8,
          sortBy: selectedFilter,
          keyword: searchTerm,
          isPublic: activeTab === "public",
          groupId,
        });
        setFilteredMemories(response.data);
      } catch (err) {
        setError("게시글 목록을 불러오는 중 오류가 발생했습니다.");
      }
    };

    loadPostList();
  }, [activeTab, groupDetail, searchTerm, selectedFilter, groupId]);

  const handleSearchChange = (term) => {
    setSearchTerm(term);
  };

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
  };

  const handleUploadClick = () => {
    navigate(`/group/${groupId}/upload-memory`);
  };

  const handleLikeClick = async () => {
    try {
      await likeGroup(groupId);
      setGroupDetail((prevDetail) => ({
        ...prevDetail,
        likeCount: prevDetail.likeCount + 1,
      }));
    } catch (error) {
      alert("공감하기에 실패했습니다.");
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleGroupUpdate = async (updatedData) => {
    try {
      await updateGroup(groupId, updatedData);
      alert("그룹 정보가 성공적으로 수정되었습니다.");
      setGroupDetail((prevDetail) => ({ ...prevDetail, ...updatedData }));
      setIsUpdateModalOpen(false);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleGroupDelete = async (password) => {
    try {
      await deleteGroup(groupId, password);
      alert("그룹이 성공적으로 삭제되었습니다.");
      setIsDeleteModalOpen(false);
      navigate("/");
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) return <div className={styles.loading}>로딩 중...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!groupDetail)
    return <div className={styles.error}>그룹을 찾을 수 없습니다.</div>;

  return (
    <div className={styles.groupDetailPage}>
      <header className={styles.header}>
        <Logo className={styles.logo} onClick={handleLogoClick} />
      </header>
      <div className={styles.description}>
        <div className={styles.groupImageWrapper}>
          <img
            src={groupDetail.image}
            alt={groupDetail.name}
            className={styles.groupImage}
          />
        </div>
        <div className={styles.groupInfo}>
          <div className={styles.groupMetaAndActions}>
            <div className={styles.groupMeta}>
              <span className={styles.groupDate}>{groupDetail.days}</span>
              <span className={styles.groupType}>
                {groupDetail.isPublic ? "공개" : "비공개"}
              </span>
            </div>
            <div className={styles.managementButtons}>
              <button
                className={styles.textButton}
                onClick={() => setIsUpdateModalOpen(true)}
              >
                그룹 정보 수정하기
              </button>
              <button
                className={styles.textButton}
                onClick={() => setIsDeleteModalOpen(true)}
              >
                그룹 삭제하기
              </button>
            </div>
          </div>
          <div className={styles.titleAndStats}>
            <h1 className={styles.groupTitle}>{groupDetail.name}</h1>
            <div className={styles.groupStatistics}>
              <span className={styles.statsLabel}>게시글</span>
              <span className={styles.statsValue}>{groupDetail.postCount}</span>
              <span className={styles.statsLabel}>그룹 공감</span>
              <span className={styles.statsValue}>{groupDetail.likeCount}</span>
            </div>
          </div>
          <p className={styles.groupDescription}>{groupDetail.introduction}</p>
          <div className={styles.badgeAndLikeContainer}>
            <div className={styles.badgesSection}>
              <div className={styles.badgesTitle}>획득 배지</div>
              <div className={styles.badges}>
                {/* 그룹 공감 배지 - 공감 수가 1만 이상일 때 */}
                {groupDetail.likeCount >= 10000 && (
                  <img
                    src={GroupLikeBadge}
                    className={styles.badge}
                    alt="그룹 공감 1만 배지"
                  />
                )}

                {/* 7일 연속 게시글 등록 배지 */}
                {checkConsecutivePosts(filteredMemories) && (
                  <img
                    src={PostBadge}
                    className={styles.badge}
                    alt="7일 연속 게시글 배지"
                  />
                )}

                {/* 게시글 공감 배지 - 게시글 공감 수가 1만 이상일 때 */}
                {groupDetail.postLikeCount >= 10000 && (
                  <img
                    src={PostLikeBadge}
                    className={styles.badge}
                    alt="게시글 공감 1만 배지"
                  />
                )}
              </div>
            </div>
            <LikeButtonIcon
              className={styles.likeButton}
              onClick={handleLikeClick}
            />
          </div>
        </div>
      </div>
      <div className={styles.separator} />
      <div className={styles.memorySection}>
        <div className={styles.memoryHeader}>
          <span className={styles.memoryTitle}>추억 목록</span>
          <button className={styles.uploadButton} onClick={handleUploadClick}>
            추억 올리기
          </button>
        </div>
        <div className={styles.searchBarWrapper}>
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            selectedFilter={selectedFilter}
            onFilterChange={handleFilterChange}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            placeholder="태그 혹은 제목을 입력해주세요."
            sortOptions={[
              { label: "공감순", value: "mostLiked" },
              { label: "최신순", value: "latest" },
              { label: "댓글순", value: "mostCommented" }, // 댓글순 추가
            ]}
          />
        </div>
        {activeTab === "public" ? (
          <PublicGroupDetail
            group={groupDetail}
            memories={filteredMemories}
            selectedFilter={selectedFilter}
          />
        ) : (
          <PrivateGroupDetail
            group={groupDetail}
            memories={filteredMemories}
            selectedFilter={selectedFilter}
          />
        )}
      </div>

      {/* 수정 및 삭제 모달 */}
      {isUpdateModalOpen && (
        <GroupUpdateModal
          group={groupDetail}
          onClose={() => setIsUpdateModalOpen(false)}
          onSave={handleGroupUpdate}
        />
      )}

      {isDeleteModalOpen && (
        <GroupDeleteModal
          title="그룹 삭제"
          onDelete={handleGroupDelete}
          onClose={() => setIsDeleteModalOpen(false)}
        />
      )}
    </div>
  );
}

export default GroupDetailPage;
