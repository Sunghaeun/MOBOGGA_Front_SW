# 로컬스토리지 → useAuth 훅 마이그레이션 가이드

## 🔄 변경 필요한 패턴들

### 1. 기존 패턴

```javascript
// ❌ 기존 방식
const token = localStorage.getItem("jwt");

// 또는
if (localStorage.getItem("jwt")) {
  // 로그인된 상태
}

// 또는 토큰 제거
localStorage.removeItem("jwt");
```

### 2. 새로운 패턴

```javascript
// ✅ 새로운 방식
import useAuth from "../hooks/useAuth";

function Component() {
  const { auth, isLoggedIn, getToken, logout } = useAuth();

  // 토큰이 필요한 API 호출 시
  const token = getToken();

  // 로그인 상태 확인
  if (isLoggedIn) {
    // 로그인된 상태
  }

  // 권한 확인
  if (auth?.authority === "ROLE_CLUB") {
    // 동아리 관리자
  }

  // 로그아웃
  logout();
}
```

## 📁 파일별 변경 현황

### ✅ 완료된 파일들

- `/src/components/ShowList.js` - useAuth 훅 적용 완료
- `/src/components/Header.js` - useAuth 훅 적용 완료
- `/src/components/Mobile/Sidebar.js` - useAuth 훅 적용 완료
- `/src/pages/ShowDetail.js` - useAuth 훅 적용 완료

### 🔄 변경 필요한 파일들

- `/src/pages/Mypage.js`
- `/src/pages/Manager/ManagerMypage.js`
- `/src/pages/Manager/ManagerRecruitingpage.js`
- `/src/pages/Manager/ManagerUpdateProfile.js`
- `/src/pages/Manager/ManagerHolderList.js`
- `/src/pages/Manager/ManagerShowpage.js`
- `/src/pages/Manager/ManagerEntertainpage.js`
- `/src/pages/Manager/ManagerUpdateClub.js`
- `/src/pages/CreateEntertain.js`
- `/src/pages/CreateRecruiting.js`
- `/src/pages/CreateShow.js`
- `/src/pages/EditRecruiting.js`
- `/src/pages/EditShow.js`
- `/src/pages/EditEntertain.js`
- `/src/pages/UpdateProfile.js`
- `/src/pages/AddInfo.js`
- `/src/components/Banner.js`
- 기타 localStorage 사용하는 컴포넌트들

## 🛠 변경 방법

### 1단계: Import 추가

```javascript
import useAuth from "../hooks/useAuth";
```

### 2단계: 훅 사용

```javascript
function Component() {
  const { auth, isLoggedIn, getToken, isManager, logout } = useAuth();
```

### 3단계: 기존 코드 변경

```javascript
// 기존
const token = localStorage.getItem("jwt");

// 변경 후
const token = getToken();
```

### 4단계: 권한 체크 로직 변경

```javascript
// 기존
if (localStorage.getItem("jwt")) {
  // 로그인된 상태
}

// 변경 후
if (isLoggedIn) {
  // 로그인된 상태
}
```

## 🎯 주요 이점

1. **중앙집중식 인증 관리**: 모든 컴포넌트에서 일관된 인증 로직 사용
2. **자동 토큰 검증**: useAuth 훅이 서버와 자동으로 토큰 유효성 검증
3. **에러 처리 통합**: 401/403 에러 시 자동 토큰 제거 및 로그아웃 처리
4. **타입 안전성**: 권한 체크 함수들 (isManager, isAdmin 등) 제공
5. **디버깅 용이**: 중앙화된 로깅 및 상태 관리

## 🔧 useAuth 훅 API

```javascript
const {
  auth, // 사용자 인증 정보 객체
  isLoggedIn, // 로그인 여부 (boolean)
  isLoading, // 인증 체크 로딩 상태
  error, // 인증 에러 메시지
  getAuth, // 인증 정보 새로고침 함수
  getToken, // JWT 토큰 가져오기 함수
  isManager, // 동아리 관리자 권한 체크 함수
  isAdmin, // 전체 관리자 권한 체크 함수
  logout, // 로그아웃 함수
} = useAuth();
```
