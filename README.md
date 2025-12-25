# 🧘 멍때리기 대회 (The Art of Doing Nothing)

**아무것도 하지 않기의 예술** - 얼마나 오래 멍을 때릴 수 있는지 도전해보세요!

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-38B2AC?style=flat-square&logo=tailwind-css)

## 🎮 게임 규칙

| 행동 | 결과 |
|------|------|
| 🖱️ 마우스 움직임 | 탈락! |
| ⌨️ 키보드 입력 | 탈락! |
| 🔄 탭 전환 | 탈락! |
| ⚠️ 생존 신고 무응답 | 탈락! |

## ✨ 주요 기능

- **Anti-Cheat 시스템**: 마우스 움직임, 키보드 입력, 탭 전환 감지
- **생존 신고**: 랜덤하게 나타나는 생존 확인 팝업 (스페이스바로 응답)
- **최고 기록 저장**: LocalStorage를 활용한 개인 최고 기록 관리
- **결과 공유**: 친구들에게 기록 공유하기

## 🛠️ 기술 스택

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS 4.0
- **State Management**: React Hooks (Custom Hooks)

## 🚀 시작하기

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 확인하세요.

## 📁 프로젝트 구조

```
doing-nothing-challenge/
├── app/
│   ├── page.tsx          # 메인 게임 페이지
│   ├── layout.tsx        # 루트 레이아웃
│   └── globals.css       # 전역 스타일
├── hooks/
│   ├── useGameLogic.ts   # 게임 로직 훅
│   ├── useAntiCheat.ts   # 치팅 방지 훅
│   └── useSurvivalCheck.ts # 생존 체크 훅
└── README.md
```

## 📝 License

MIT License
