<div style="text-align: center;">

# 🚪 EROOM

### 최고의 온라인 방탈출 게임 플랫폼

![EROOM 로고](public/icon.png)

</div>

## 프로젝트 소개

**EROOM-website**는 Next.js 14를 기반으로 개발된 온라인 방탈출 게임의 웹 플랫폼입니다. 사용자들은 다양한 테마의 방탈출 게임을 즐기거나 직접 제작할 수 있으며, 커뮤니티 활동을 통해 다른
사용자들과 소통할 수 있습니다.

### 주요 특징

- **다중 테마 방탈출 게임**: 다양한 테마와 난이도의 방탈출 게임 제공
- **맵 에디터**: 사용자가 직접 방탈출 게임을 제작할 수 있는 도구
- **실시간 멀티플레이**: 친구들과 함께 협력하여 방탈출 게임 진행
- **커뮤니티 시스템**: 게임 리뷰, 랭킹, 친구 추가 등 소셜 기능
- **아이템 스토어**: 게임 내 아이템 구매 및 시즌패스 시스템

## 기술 스택

- **프론트엔드**: Next.js 14, React, TypeScript
- **인증 및 데이터**: Firebase Authentication, Firestore
- **스타일링**: TailwindCSS
- **상태 관리**: React Context API
- **배포**: Vercel
- **추가 라이브러리**: uuid, lucide-react

## 주요 기능

### 🎮 게임 플레이

- **다양한 테마별 방탈출 게임**: 공포, 추리, 판타지 등 다양한 테마의 방탈출 게임 제공
- **난이도 시스템**: 초보자부터 전문가까지 모든 사용자가 즐길 수 있는 난이도 조절
- **실시간 멀티플레이**: 최대 6명까지 함께 플레이할 수 있는 협동 모드
- **힌트 시스템**: 난이도에 따른 힌트 제공으로 게임 진행 보조
- **게임 저장 기능**: 진행 중인 게임 저장 및 이어하기 지원

### 🛠️ 맵 에디터

- **직관적인 UI**: 코딩 지식 없이도 쉽게 맵을 제작할 수 있는 드래그 앤 드롭 인터페이스
- **다양한 오브젝트**: 퍼즐, 아이템, 장식 등 다양한 오브젝트 제공
- **퍼즐 로직 설정**: 조건부 이벤트 및 상호작용 설정 기능
- **테스트 플레이**: 제작 중인 맵을 실시간으로 테스트할 수 있는 기능

### 👥 커뮤니티

- **맵 평가 및 리뷰**: 플레이한 맵에 별점과 리뷰 작성 가능
- **친구 시스템**: 다른 사용자 검색 및 친구 추가 기능
- **실시간 채팅**: 친구 및 게임 참가자와의 실시간 소통
- **랭킹 시스템**: 전체 및 맵별 최고 기록 랭킹 제공
- **도전 과제**: 다양한 도전 과제 달성을 통한 보상 획득

### 🛒 스토어

- **아이템 구매**: 게임 내 사용 가능한 아이템 및 꾸미기 요소 구매
- **시즌패스**: 정기적으로 업데이트되는 시즌별 콘텐츠 및 보상
- **프리미엄 맵**: 특별한 테마와 고품질의 프리미엄 맵 구매 가능
- **크리에이터 수익화**: 제작한 맵의 인기도에 따른 수익 창출 시스템

## 📌 이용 가이드

**EROOM**은 다양한 테마의 온라인 방탈출 게임을 즐기고 제작할 수 있는 플랫폼입니다. 아래 가이드를 통해 EROOM을 시작해보세요!

### 🔑 시작하기

#### 1. 계정 생성 및 로그인

- 홈페이지 우측 상단의 '로그인' 버튼을 클릭합니다.
- 처음 방문하신 경우 '회원가입'을 선택하여 계정을 생성합니다.
- 이메일 주소와 비밀번호를 입력하거나 소셜 계정(Google)으로 간편하게 가입할 수 있습니다.
- 비밀번호를 잊어버린 경우 '비밀번호 찾기' 기능을 통해 재설정할 수 있습니다.

#### 2. 메인 페이지 둘러보기

- 로그인 후 메인 페이지에서 인기 맵, 신규 맵, 추천 맵을 확인할 수 있습니다.
- 상단 네비게이션 바를 통해 다양한 메뉴(게임, 스토어, 커뮤니티, 뉴스, 프로필 등)로 이동할 수 있습니다.

### 🎮 게임 플레이하기

#### 1. 맵 선택하기

- '게임' 메뉴에서 다양한 테마와 난이도의 방탈출 맵을 확인할 수 있습니다.
- 맵 카드에는 테마, 난이도, 평점, 플레이 시간 등 정보가 표시됩니다.
- 필터링 기능을 통해 테마, 난이도, 인기도 등으로 맵을 정렬할 수 있습니다.
- 원하는 맵을 클릭하여 상세 정보를 확인할 수 있습니다.

#### 2. 솔로 플레이

- 맵 상세 페이지에서 '게임 시작' 버튼을 클릭하여 혼자서 도전할 수 있습니다.
- 게임 중 힌트 기능을 사용할 수 있으며, 제한 시간 내에 모든 퍼즐을 해결해야 합니다.
- 인벤토리 시스템을 통해 수집한 아이템을 관리하고 사용할 수 있습니다.

#### 3. 멀티플레이

- '함께하기' 버튼을 클릭하여 친구들과 함께 플레이할 수 있습니다.
- 방 코드를 생성하여 친구들에게 공유하거나, 친구가 공유한 코드를 입력하여 참여할 수 있습니다.
- 실시간 음성/채팅 기능을 통해 소통하며 협력할 수 있습니다.
- 팀원들의 진행 상황을 실시간으로 확인할 수 있습니다.

### 🛠️ 나만의 맵 만들기

#### 1. 맵 에디터 접속하기

- '맵 제작' 메뉴를 클릭하여 맵 에디터로 이동합니다.
- 처음 사용하는 경우 단계별 튜토리얼이 제공됩니다.
- 제작 중인 맵은 자동 저장되며, 언제든지 이어서 작업할 수 있습니다.

#### 2. 맵 디자인하기

- 다양한 테마와 오브젝트를 선택하여 방의 기본 구조를 설계합니다.
- 퍼즐과 단서를 배치하고 상호작용을 설정합니다.
- 퍼즐의 난이도와 힌트를 조절할 수 있습니다.
- 배경 음악 및 효과음을 추가하여 몰입감을 높일 수 있습니다.

#### 3. 맵 테스트 및 발행하기

- '테스트 플레이' 기능으로 제작한 맵을 미리 체험해볼 수 있습니다.
- 디버깅 모드를 통해 퍼즐의 오류를 확인하고 수정할 수 있습니다.
- 모든 설정이 완료되면 '발행하기' 버튼을 클릭하여 커뮤니티에 공유합니다.
- 공개 설정을 통해 전체 공개, 친구에게만 공유, 또는 비공개로 설정할 수 있습니다.

### 👥 커뮤니티 활동

#### 1. 맵 평가 및 리뷰

- 플레이한 맵에 별점과 리뷰를 남겨 다른 사용자들에게 도움을 줄 수 있습니다.
- 맵 제작자에게 피드백을 전달할 수 있습니다.
- 유용한 리뷰에 '좋아요'를 눌러 추천할 수 있습니다.

#### 2. 친구 추가 및 소통

- 프로필 페이지에서 다른 사용자를 검색하여 친구 추가할 수 있습니다.
- 친구와 메시지를 주고받거나 함께 게임에 초대할 수 있습니다.
- 친구의 활동 피드를 통해 최근 플레이한 게임과 업적을 확인할 수 있습니다.

#### 3. 랭킹 및 도전과제

- '리더보드' 메뉴에서 각 맵별 최고 기록과 전체 랭킹을 확인할 수 있습니다.
- 주간/월간 랭킹을 통해 정기적으로 업데이트되는 순위를 확인할 수 있습니다.
- 다양한 도전과제를 달성하여 프로필 뱃지와 보상을 획득할 수 있습니다.

### 📱 모바일 이용 안내

- EROOM은 반응형 디자인으로 모바일 웹에서도 편리하게 이용할 수 있습니다.
- 최적의 경험을 위해 가로 모드 사용을 권장합니다.

## 💡 자주 묻는 질문

#### Q: 맵 플레이는 무료인가요?

- A: 모든 맵은 무료로 이용 가능합니다.

#### Q: 친구들과 어떻게 함께 플레이하나요?

- A: 아직은 친구와 함게 플레이 하는 기능은 제공 되지 않습니다. 하지만, 자신이 만든 맵을 공유하는 건 얼마든지 가능합니다.

#### Q: 맵 제작에 필요한 기술적 지식이 있어야 하나요?

- A: 아니요, 자연어기반 시나리오 및 오브젝트 생성과 직관적인 드래그 앤 드롭 인터페이스로 누구나 쉽게 맵을 제작할 수 있습니다.

#### Q: 내가 만든 맵으로 수익을 얻을 수 있나요?

- A: 추후 공개될 예정입니다.

#### Q: 모바일에서도 이용 가능한가요?

- A: 네, 사이트는 모바일과 PC 웹 둘다 접속이 가능합니다. 게임은 아직 PC만 이용 가능합니다.

#### Q: 계정이 없어도 게임을 플레이할 수 있나요?

- A: 아니요, 계정이 없으면 게임에 접속할 수 없습니다. 이는 많은 데이터와 현재 상황 저장을 위해 유저 식별이 필요하기 때문입니다.

## 📧 고객 지원

문의사항이 있으시면 [이메일](mailto:pickpictest@gmail.com) 또는 사이트 내 '고객센터' 메뉴를 통해 연락주세요.

---

<div style="text-align: center;">

### EROOM - 당신이 만드는 방탈출의 세계

</div>

## 📧 연락처 및 개발자 정보

- **공식 웹사이트**: [https://e-room.kro.kr](https://e-room.kro.kr)
- **이메일**: [pickpictest@gmail.com](mailto:pickpictest@gmail.com)
- **GitHub**: [https://github.com/febriez/eroom](https://github.com/your-username/eroom)

### 기여하기

ERROM 프로젝트에 기여하고 싶으신가요? 이슈를 제출하거나 풀 리퀘스트를 보내주세요. 모든 기여를 환영합니다!

### 라이센스

이 프로젝트는 MIT 라이센스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

<div style="text-align: center;">

### EROOM - 당신이 만드는 방탈출의 세계

</div>
