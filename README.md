## 프로젝트 실행 방법

```bash
npm i

npm run dev
```

## 구현한 기능에 대한 설명

### 현재 위치 날씨 조회

- 브라우저 Geolocation API로 사용자 현재 위치 자동 감지
- OpenWeatherMap API를 통해 현재 날씨 및 시간별 예보 표시
- 현재 온도, 최저/최고 기온, 습도, 풍속 정보 제공

### 좌표(위도,경도) 조회

- 위/경도를 구해주는 사이트가 있었으나, API를 연동하여 나타내는 것이 더 편리하다고 생각하여 카카오맵 API 연동을 통해 계산

### 장소 검색

- 한국 전국 시/도/구/동 데이터를 내장하여 실시간 자동완성 검색 구현
- 키보드 네비게이션 추가
- 검색 결과 선택 시 해당 지역의 날씨 정보 표시

### 즐겨찾기

- 최대 개수(6개) 도달 시 즐겨찾기 버튼 비활성화 처리
- 각 즐겨찾기에 커스텀 별칭 설정 가능 (인라인 편집)
- 삭제 시 다이얼로그로 실수 방지
- localStorage 기반 저장
- 즐겨찾기 카드 클릭 시 상세 페이지로 이동

## 기술적 의사결정 및 이유

### FSD(Feature-Sliced Design) 아키텍처

- `entities/`: 비즈니스 로직 (weather, location, favorites)
- `features/`: 사용자 기능 UI
- `shared/`: 공통 컴포넌트, 훅, 유틸리티
- `pages/`: 라우팅용 페이지

FSD 구조로 widget이 있지만, 재사용할 컴포넌트가 많지 않아 해당 프로젝트에서는 제외하였습니다.

### 상태 관리 전략

| 상태                   | 관리 방식               | 이유                                   |
| ---------------------- | ----------------------- | -------------------------------------- |
| 서버 데이터 (날씨)     | TanStack Query          | 캐싱, 자동 리페치, 로딩/에러 상태 관리 |
| 영속 데이터 (즐겨찾기) | useState + localStorage | 단순하고 직관적인 영속화               |
| UI 상태 (검색어, 선택) | useState                | 간단한 로컬 상태                       |

Redux 등 전역 상태 관리 라이브러리는 현재 복잡도에서 과도한 엔지니어링이라 판단하여 요구사항인 Tanstack Query 이외에는 사용하지 않았습니다.

즐겨찾기 기능의 경우 백엔드 서버가 없어, localStorage로 간단하게 구현하였습니다.

### TanStack Query 캐싱 전략

```typescript
// 날씨 데이터
staleTime: 15분  // 15분간 fresh 상태 유지
gcTime: 30분     // 30분간 캐시 유지

// 위치 정보
staleTime: 5분   // 위치는 자주 변하지 않으므로 5분 유지
```

날씨 데이터는 실시간성이 중요하지만 너무 자주 갱신할 필요는 없어 15분으로 설정했습니다.

### 병렬 API 요청

```typescript
const [current, forecast] = await Promise.all([
  fetchCurrentWeather(lat, lon),
  fetchForecast(lat, lon)
]);
```

## 사용한 기술 스택

Tanstack Query, shadcn UI

## 프로젝트 구조

```
realteeth-assignment
├─ README.md
├─ eslint.config.js
├─ index.html
├─ package-lock.json
├─ package.json
├─ public
│  └─ vite.svg
├─ src
│  ├─ App.css
│  ├─ App.tsx
│  ├─ app
│  │  └─ providers
│  │     ├─ QueryProvider.tsx
│  │     └─ index.ts
│  ├─ assets
│  │  └─ react.svg
│  ├─ entities
│  │  ├─ favorites
│  │  │  ├─ index.ts
│  │  │  └─ model
│  │  │     ├─ types.ts
│  │  │     └─ useFavorites.ts
│  │  ├─ location
│  │  │  ├─ index.ts
│  │  │  └─ model
│  │  │     ├─ types.ts
│  │  │     └─ useLocationSearch.ts
│  │  └─ weather
│  │     ├─ api
│  │     │  └─ weatherApi.ts
│  │     ├─ index.ts
│  │     ├─ lib
│  │     │  └─ weatherUtils.ts
│  │     └─ model
│  │        ├─ types.ts
│  │        └─ useWeather.ts
│  ├─ features
│  │  ├─ favorites
│  │  │  ├─ index.ts
│  │  │  └─ ui
│  │  │     ├─ FavoriteCard.tsx
│  │  │     └─ FavoriteList.tsx
│  │  ├─ location-search
│  │  │  ├─ index.ts
│  │  │  └─ ui
│  │  │     └─ LocationSearchInput.tsx
│  │  └─ weather
│  │     ├─ index.ts
│  │     └─ ui
│  │        ├─ CurrentWeather.tsx
│  │        ├─ HourlyForecast.tsx
│  │        ├─ WeatherIcon.tsx
│  │        └─ WeatherWidget.tsx
│  ├─ index.css
│  ├─ main.tsx
│  ├─ pages
│  │  ├─ DetailPage.tsx
│  │  └─ index.ts
│  └─ shared
│     ├─ api
│     │  └─ index.ts
│     ├─ config
│     │  └─ index.ts
│     ├─ hooks
│     │  ├─ index.ts
│     │  └─ useGeolocation.ts
│     ├─ index.ts
│     ├─ lib
│     │  ├─ cn.ts
│     │  ├─ index.ts
│     │  └─ koreaDistricts.ts
│     └─ ui
│        ├─ alert-dialog.tsx
│        ├─ button.tsx
│        ├─ card.tsx
│        ├─ index.ts
│        ├─ input.tsx
│        └─ skeleton.tsx
├─ tsconfig.app.json
├─ tsconfig.json
├─ tsconfig.node.json
└─ vite.config.ts

```
