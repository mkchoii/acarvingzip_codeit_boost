import ex1Image from "../assets/ex1_image.svg";
import ex2Image from "../assets/ex2_image.svg";

const mockMemory = [
  {
    id: 1,
    groupId: 3,
    title: "인천 앞바다에서 낚시",
    author: "달봉이아들",
    imageUrl: ex1Image,
    location: "인천 앞바다",
    tags: ["인천", "낚시"],
    likes: 120,
    comments: 8,
    isPublic: true, // 공개 메모리
  },
  {
    id: 2,
    groupId: 3,
    title: "설악산 등산 여행",
    author: "달봉이",
    imageUrl: ex2Image,
    location: "설악산",
    tags: ["등산", "자연"],
    likes: 150,
    comments: 10,
    isPublic: true, // 공개 메모리
  },
  {
    id: 3,
    groupId: 3,
    title: "한강 가족 피크닉",
    author: "달봉이아들",
    imageUrl: ex1Image,
    location: "한강 공원",
    tags: ["가족", "피크닉"],
    likes: 200,
    comments: 15,
    isPublic: true, // 공개 메모리
  },
  {
    id: 4,
    groupId: 3,
    title: "봄 꽃 축제",
    author: "달봉이",
    imageUrl: ex2Image,
    location: "제주도",
    tags: ["봄", "꽃놀이"],
    likes: 180,
    comments: 12,
    isPublic: false, // 비공개 메모리
  },
  {
    id: 5,
    groupId: 3,
    title: "부산 해운대 휴가",
    author: "달봉이아들",
    imageUrl: ex1Image,
    location: "부산 해운대",
    tags: ["바다", "휴가"],
    likes: 250,
    comments: 20,
    isPublic: false, // 비공개 메모리
  },
  {
    id: 6,
    groupId: 3,
    title: "겨울 스키 여행",
    author: "달봉이",
    imageUrl: ex2Image,
    location: "강원도 스키장",
    tags: ["겨울", "스키"],
    likes: 90,
    comments: 5,
    isPublic: true, // 공개 메모리
  },
  {
    id: 7,
    groupId: 3,
    title: "지리산 캠핑 모험",
    author: "달봉이아들",
    imageUrl: ex1Image,
    location: "지리산 캠핑장",
    tags: ["캠핑", "모험"],
    likes: 130,
    comments: 11,
    isPublic: true, // 공개 메모리
  },
  {
    id: 8,
    groupId: 3,
    title: "제주 오름에서 일몰",
    author: "달봉이",
    imageUrl: ex2Image,
    location: "제주도 오름",
    tags: ["일몰", "풍경"],
    likes: 220,
    comments: 14,
    isPublic: false, // 비공개 메모리
  },
  {
    id: 9,
    groupId: 3,
    title: "서울 남대문 야시장 탐방",
    author: "달봉이아들",
    imageUrl: ex1Image,
    location: "서울 남대문시장",
    tags: ["야시장", "서울"],
    likes: 170,
    comments: 9,
    isPublic: false, // 비공개 메모리
  },
  {
    id: 10,
    groupId: 3,
    title: "여의도 벚꽃 산책",
    author: "달봉이",
    imageUrl: ex2Image,
    location: "서울 여의도",
    tags: ["벚꽃", "산책"],
    likes: 300,
    comments: 22,
    isPublic: true, // 공개 메모리
  },
];

export default mockMemory;
