<div align="center">

# 🚪 EROOM

### 최고의 온라인 방탈출 게임 플랫폼

![EROOM 로고](https://via.placeholder.com/300x150?text=EROOM)

[![Next.js](https://img.shields.io/badge/Next.js-14.2.5-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Firebase](https://img.shields.io/badge/Firebase-10.7.1-orange?style=for-the-badge&logo=firebase&logoColor=white)](https://firebase.google.com)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.1-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)

</div>

## 🎮 프로젝트 소개

**EROOM**은 혁신적인 온라인 방탈출 게임 플랫폼입니다. 사용자들은 다양한 테마의 방탈출 맵을 플레이하거나 직접 제작할 수 있으며, 실시간으로 친구들과 함께 협력하여 문제를 해결할 수 있습니다.

### ✨ 주요 기능

- 🔐 **다양한 탈출 맵**: 퍼즐, 공포, 모험 등 다양한 테마의 맵을 플레이
- 🛠️ **맵 제작 도구**: 직관적인 인터페이스로 자신만의 맵 제작 가능
- 👥 **멀티플레이어**: 친구들과 함께 실시간으로 방탈출 도전
- 🏆 **리더보드**: 최고 기록을 세우고 친구들과 경쟁
- 🌙 **프로필 시스템**: 레벨 업, 업적 달성, 친구 추가 기능
- 💬 **커뮤니티**: 맵 평가, 댓글, 포럼 등의 소통 공간

## 🚀 시작하기

### 사전 요구사항

- Node.js 18.0.0 이상
- npm 또는 yarn
- Firebase 계정

### 설치 방법

1. 저장소 복제

```bash
git clone https://github.com/your-username/eroom-website.git
cd eroom-website
```

2. 의존성 설치

```bash
npm install
# 또는
yarn install
```

3. 환경 변수 설정

`.env.local` 파일을 생성하고 Firebase 프로젝트 정보를 입력하세요:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

4. 개발 서버 실행

```bash
npm run dev
# 또는
yarn dev
```

5. [http://localhost:3000](http://localhost:3000)에서 웹사이트 확인

## 📂 프로젝트 구조

```
eroom-website/
├── app/                    # Next.js 13+ 앱 디렉토리
│   ├── components/         # 재사용 가능한 UI 컴포넌트
│   ├── contexts/           # React Context API 정의
│   ├── lib/                # 유틸리티 및 헬퍼 함수
│   ├── community/          # 커뮤니티 관련 페이지
│   │   └── maps/          # 사용자 제작 맵 목록/상세 페이지
│   ├── profile/           # 사용자 프로필 페이지
│   └── [...]/             # 기타 페이지들
├── public/                 # 정적 파일 (이미지, 아이콘 등)
└── ...                     # 설정 파일 등
```

## 🛠️ 기술 스택

- **프론트엔드**: Next.js, React, TypeScript, TailwindCSS
- **백엔드**: Firebase (Authentication, Firestore, Storage)
- **상태 관리**: React Context API
- **스타일링**: TailwindCSS
- **배포**: Vercel

## 📜 라이선스

이 프로젝트는 [MIT 라이선스](LICENSE)로 배포됩니다.

## 🤝 기여하기

기여는 항상 환영합니다! 버그 리포트, 기능 제안, 또는 코드 기여는 이슈 또는 풀 리퀘스트를 통해 제출해주세요.

## 📧 연락처

문의사항이 있으시면 [이메일](mailto:contact@eroom-game.com) 또는 [공식 웹사이트](https://eroom-game.com)를 통해 연락주세요.

---

<div align="center">

### EROOM - 당신이 만드는 방탈출의 세계

</div>
