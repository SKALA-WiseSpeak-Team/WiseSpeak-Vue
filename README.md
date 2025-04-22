# WiseSpeak

## 프로젝트 소개

WiseSpeak은 PDF 문서를 AI 기반 챗봇이 지원하는 인터랙티브 오디오 강의로 변환하는 웹 애플리케이션입니다. 사용자가 업로드한 문서를 분석하여 고품질 오디오 강의로 만들고, 사용자가 내용에 대해 질문할 수 있는 대화형 학습 경험을 제공합니다.

## 주요 기능

- PDF 문서 업로드 및 처리
- AI를 활용한 자동 콘텐츠 분석
- 고품질 음성 합성 강의 생성
- 대화형 AI 챗봇 지원
- 다국어 지원 (한국어, 영어, 일본어, 중국어, 프랑스어)
- 다크 모드 지원

## 시작하기

### 필수 조건

- Node.js 16.x 이상
- npm 8.x 이상 또는 yarn 1.22.x 이상

### 설치

```bash
# 저장소 클론
git clone https://github.com/yourusername/WiseSpeak.git
cd WiseSpeak

# 의존성 설치
npm install
# 또는
yarn install

# 클라이언트 디렉토리로 이동하여 의존성 설치
cd client
npm install
# 또는
yarn install

# server 디렉토리로 이동하여 의존성 설치
cd ../server
npm install
# 또는
yarn install



# 개발 서버 실행
npm run dev
# 또는
yarn dev
```

## 프로젝트 구조

```README
WiseSpeak-Vue/ 
├── client/ # 클라이언트 
│ ├── public/ # 정적 파일  
│ │ │ ├── src/ 
│ │ ├── assets/ 
│ │ │ │ │ ├── components
│ │ │ ├── common
│ │ │ │ ├── LazyPdfThumbnail.vue 
│ │ │ │ └── PdfThumbnail.vue 
│ │ │ │ │ │ │ └── Layout 
│ │ │ └── MainLayout.vue # 메인 레이아웃 
│ │ │ │ │ ├── composables/ # Vue Composables 
│ │ │ └── useIntersectionObserver.ts # 요소 가시성 감지 
│ │ │ │ │ ├── i18n/ # 다국어 지원 파일 
│ │ │ └── index.ts 
│ │ │ │ │ ├── router/ # Vue Router 설정 
│ │ │ └── index.ts 
│ │ │ │ │ ├── services/ # API 서비스 
│ │ │ ├── getInitLecture.ts 
│ │ │ ├── getLecture.ts  
│ │ │ ├── getLectureGallery.ts
│ │ │ ├── getLectures.ts 
│ │ │ ├── postChat.ts 
│ │ │ └── postLectures.ts 
│ │ │ │ │ ├── styles/ # 전역 스타일 
│ │ │ └── main.css # 메인 CSS 
│ │ │ │ │ ├── views/ # 페이지 컴포넌트 
│ │ │ ├── Create.vue # 강의 생성 페이지 
│ │ │ ├── Gallery.vue # 강의 갤러리 페이지 
│ │ │ ├── Home.vue # 홈페이지 
│ │ │ │ │ │ │ └── lecture 
│ │ │ ├── Lecture.vue # 강의 페이지 
│ │ │ │ │ │ │ ├── _components
│ │ │ │ ├── AudioPlayer.vue 
│ │ │ │ ├── ChatInterface.vue 
│ │ │ │ ├── ChatMessage.vue 
│ │ │ │ ├── LectureHeader.vue 
│ │ │ │ ├── LoadingModal.vue 
│ │ │ │ ├── PDFViewer.vue 
│ │ │ │ └── VoiceSettingModal.vue 
│ │ │ │ │ │ │ └── _hooks/ # 강의 페이지 훅 
│ │ │ └── useAudioRecorder.ts 
│ │ │ │ │ ├── App.vue # 루트 컴포넌트 
│ │ └── main.ts # 애플리케이션 진입점 
│ │ │ ├── index.html # HTML 템플릿 
│ └── package.json # 패키지 설정 
│ ├── server/ # Node.js 프록시 서버 
│ ├── index.js # 서버 진입점 
│ └── package.json # 서버 패키지 설정 
│ └── README.md  
```
