# RTMS 스토리북 - 제품 요구사항 문서 (PRD)

## 프로젝트 개요
RTMS 스토리북은 이미지와 텍스트로 구성된 디지털 스토리북 웹 애플리케이션입니다.

---

## 기술 스택
- **프레임워크**: React + TypeScript
- **빌드 도구**: Vite
- **스타일링**: Tailwind CSS
- **슬라이더**: Swiper.js
- **폰트**: Noto Serif KR (명조체)
- **배포**: Vercel
- **저장소**: GitHub (remge21c/RTMS_Story)

---

## 완료된 기능

### 1. 스토리 뷰어
- [x] 수평/수직 모드 자동 전환 (화면 방향 감지)
- [x] 스와이프로 페이지 넘기기 (Swiper.js)
- [x] 이미지 영역: `object-cover`로 화면 꽉 채움
- [x] 텍스트 영역: 20px 내부 여백, 세로 가운데 정렬 (수평모드), 상단 정렬 (수직모드)
- [x] 반응형 폰트 크기: 모바일/태블릿 20px, PC 25px
- [x] 명조체(Noto Serif KR) 적용

### 2. 배경음악 플레이어
- [x] 오른쪽 하단 재생/일시정지 버튼
- [x] 배경음악 자동 재생 (사용자 상호작용 후)

### 3. 관리자 페이지
- [x] 비밀번호 보호 (비밀번호: 2626)
- [x] 배경음악 업로드
- [x] 새 장면 추가 (이미지 + 텍스트)
- [x] 기존 장면 수정 (이미지 교체, 텍스트 편집)
- [x] 장면 순서 변경 (위/아래 이동)
- [x] 장면 삭제 (확인 모달)
- [x] JSON 내보내기/가져오기
- [x] 변경사항 자동 저장 (파일 시스템에 직접 저장)

### 4. 파일 저장 시스템
- [x] Vite 서버 API로 `scenes.json` 자동 저장
- [x] 이미지 업로드 시 `public/images/` 폴더에 파일로 저장
- [x] 파일명 형식: `scene_ID_타임스탬프.확장자`

### 5. 카카오톡 인앱 브라우저 대응
- [x] Android: Chrome 브라우저로 자동 리다이렉트
- [x] iOS: Safari로 열기 안내 팝업

---

## UI/UX 설정값

### 스토리 뷰어
| 항목 | 값 |
|------|-----|
| 이미지-텍스트 간격 | 0px |
| 텍스트 내부 여백 | 20px |
| 폰트 크기 (모바일) | 20px |
| 폰트 크기 (PC) | 25px |
| 폰트 | Noto Serif KR |

### 관리자 페이지
| 항목 | 값 |
|------|-----|
| 섹션 간 간격 | 16rem (space-y-16) |
| 섹션 내부 패딩 | 8rem |
| 최대 너비 | max-w-4xl |

---

## 파일 구조
```
rtms-storybook/
├── public/
│   ├── data/
│   │   └── scenes.json          # 스토리 데이터
│   └── images/
│       └── scene_*.png          # 장면 이미지들
├── src/
│   ├── components/
│   │   ├── AudioPlayer.tsx      # 배경음악 플레이어
│   │   ├── ScenePage.tsx        # 개별 장면 컴포넌트
│   │   └── StoryViewer.tsx      # 스토리 뷰어
│   ├── contexts/
│   │   └── StoryContext.tsx     # 스토리 상태 관리
│   ├── hooks/
│   │   └── useOrientation.ts    # 화면 방향 감지 훅
│   ├── pages/
│   │   ├── Admin.tsx            # 관리자 페이지
│   │   └── Home.tsx             # 메인 페이지
│   ├── types/
│   │   └── index.ts             # TypeScript 타입 정의
│   ├── App.tsx                  # 라우팅 설정
│   ├── index.css                # 전역 스타일
│   └── main.tsx                 # 진입점
├── index.html                   # HTML 템플릿
├── vite.config.ts               # Vite 설정 (파일 저장 API 포함)
└── package.json
```

---

## 배포 정보
- **Vercel URL**: https://rtms-story.vercel.app (예상)
- **GitHub**: https://github.com/remge21c/RTMS_Story

---

## 향후 개선 사항 (미구현)
- [ ] 다국어 지원
- [ ] 페이지 인디케이터 옵션
- [ ] 다크 모드
- [ ] 이미지 최적화 (압축, WebP 변환)
- [ ] 오프라인 모드 (PWA)
- [ ] 배경음악 볼륨 조절

---

## 변경 이력
| 날짜 | 내용 |
|------|------|
| 2026-02-02 | 초기 버전 개발 완료 |
| 2026-02-02 | 파일 시스템 직접 저장 기능 추가 |
| 2026-02-02 | 관리자 페이지 UI 개선 |
| 2026-02-02 | 반응형 폰트 크기 적용 |
| 2026-02-02 | 카카오톡 인앱 브라우저 대응 |
