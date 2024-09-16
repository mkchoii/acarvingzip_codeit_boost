import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import SearchBar from "../components/SearchBar";
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
import {
  likeGroup,
  updateGroup,
  deleteGroup,
  fetchGroupDetail,
} from "../api/groupApi"; // 실제 그룹 상세 조회 API 사용
import { fetchPostList } from "../api/postApi"; // 실제 게시글 목록 조회 API 사용

function GroupDetailPage() {
  const { groupId } = useParams();
  const location = useLocation();
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

  // 디데이 계산
  const calculateDday = (createdAt) => {
    if (!createdAt) {
      return "D+0";
    }
    const createdDate = new Date(createdAt);
    if (isNaN(createdDate)) {
      return "Invalid Date";
    }
    const today = new Date();
    const diffTime = Math.abs(today - createdDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `D+${diffDays}`;
  };

  // 게시글이 7일 연속으로 작성되었는지 확인하는 함수
  const checkConsecutivePosts = (posts) => {
    // 게시글 작성 날짜를 추출하고 중복된 날짜를 제거
    const dates = Array.from(
      new Set(
        posts.map((post) => {
          const date = new Date(post.createdAt);
          return date.toISOString().split("T")[0]; // YYYY-MM-DD 형식으로 변환하여 중복 제거
        })
      )
    );

    // 날짜를 정렬
    dates.sort((a, b) => new Date(a) - new Date(b));

    let consecutiveCount = 1;
    for (let i = 1; i < dates.length; i++) {
      const diffDays =
        (new Date(dates[i]) - new Date(dates[i - 1])) / (1000 * 60 * 60 * 24);
      if (diffDays === 1) {
        consecutiveCount++;
        if (consecutiveCount >= 7) return true; // 7일 연속일 경우 true 반환
      } else {
        consecutiveCount = 1; // 연속이 끊기면 다시 초기화
      }
    }
    return false;
  };

  // 1만 개 이상의 공감을 받은 게시글이 있는지 확인하는 함수
  const hasPostWith10kLikes = (posts) => {
    return posts.some((post) => post.likeCount >= 10000);
  };

  useEffect(() => {
    const loadGroupDetail = async () => {
      try {
        // 실제 그룹 상세 조회 API 호출
        const group = await fetchGroupDetail(groupId);

        // 응답 데이터 확인을 위한 콘솔 로그
        console.log("Fetched group details:", group);

        if (!group) {
          throw new Error("그룹을 찾을 수 없습니다.");
        }

        // `isPublic`을 Boolean으로 변환
        group.isPublic = Boolean(group.isPublic);

        // `likeCount`, `postCount`, `postLikeCount` 초기화
        group.likeCount = Number(group.likeCount) || 0;
        group.postCount = Number(group.postCount) || 0;
        group.postLikeCount = Number(group.postLikeCount) || 0;

        group.days = calculateDday(group.createdAt);
        setGroupDetail(group);
        setLoading(false);
      } catch (err) {
        setError("그룹 정보를 불러오는 중 오류가 발생했습니다.");
        setLoading(false);
      }
    };

    // 삭제 후 리로드를 처리하기 위해 location.state.reload를 확인
    if (location.state?.reload) {
      setLoading(true);
      setError(null);
    }

    loadGroupDetail();
  }, [groupId, location.state?.reload]);

  useEffect(() => {
    const loadPostList = async () => {
      if (!groupDetail) return;

      try {
        const response = await fetchPostList({
          page: 1,
          pageSize: 1000,
          sortBy: selectedFilter,
          keyword: searchTerm,
          isPublic: activeTab === "public",
          groupId,
        });

        setFilteredMemories(response.data);

        // 공감 1만 개 이상의 게시글이 있는지 확인
        const hasPopularPost = hasPostWith10kLikes(response.data);
        if (hasPopularPost) {
          // 1만 개 이상의 공감을 받은 게시글이 있을 때 실행할 코드
          console.log("1만 개 이상의 공감을 받은 게시글이 있습니다!");
        }

        // 게시글 수 업데이트
        setGroupDetail((prevDetail) => ({
          ...prevDetail,
          postCount: response.data.length,
          postList: response.data,
        }));
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
      console.log(`Attempting to like group with ID: ${groupId}`);
      await likeGroup(groupId);
      console.log("Like action completed");

      // 그룹 상세 정보를 다시 가져와 공감수를 갱신
      const updatedGroupDetail = await fetchGroupDetail(groupId);
      setGroupDetail((prevDetail) => ({
        ...prevDetail,
        likeCount: updatedGroupDetail.likeCount,
      }));
    } catch (error) {
      console.error("Error liking group:", error);
      // 사용자에게 알림을 띄우지 않음
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
            src={groupDetail.imageUrl}
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
                {
                  // 조건에 따라 보여줄 배지들을 순서대로 배열에 넣음
                  [
                    groupDetail.likeCount >= 10000 && {
                      src: GroupLikeBadge,
                      alt: "그룹 공감 1만 배지",
                    },
                    checkConsecutivePosts(filteredMemories) && {
                      src: PostBadge,
                      alt: "7일 연속 게시글 배지",
                    },
                    hasPostWith10kLikes(groupDetail.postList) && {
                      src: PostLikeBadge,
                      alt: "게시글 공감 1만 배지",
                    },
                  ]
                    // 조건에 맞는 배지들만 필터링하고 렌더링
                    .filter(Boolean)
                    .map((badge, index) => (
                      <img
                        key={index}
                        src={badge.src}
                        className={styles.badge}
                        alt={badge.alt}
                      />
                    ))
                }
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
              { label: "댓글순", value: "mostCommented" },
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
