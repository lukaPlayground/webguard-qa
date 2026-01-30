# WebGuard QA 시작하기

## 🚀 빠른 시작

### 1. Chrome Extension 설치

가장 간단한 방법은 Chrome Extension만 사용하는 것입니다.

```bash
# 1. 프로젝트 다운로드
cd ~/Desktop/ai-code/web-guard-qa

# 2. Chrome에서 확장 프로그램 로드
# - Chrome 브라우저 열기
# - chrome://extensions/ 이동
# - 개발자 모드 활성화
# - "압축해제된 확장 프로그램을 로드합니다" 클릭
# - extension 폴더 선택
```

### 2. 첫 번째 스캔 실행

1. 테스트할 웹사이트로 이동 (예: https://example.com)
2. 브라우저 툴바의 WebGuard QA 아이콘 클릭
3. "빠른 스캔" 버튼 클릭
4. 결과 확인!

### 3. 대시보드 확인

- Extension 팝업에서 "📊 대시보드 열기" 클릭
- 또는 직접 URL 접근:
  ```
  chrome-extension://[YOUR-EXTENSION-ID]/dashboard/index.html
  ```

## 🔧 고급 설정 (선택사항)

### Backend 서버 실행

더 많은 기능을 원한다면 Backend 서버를 실행할 수 있습니다:

```bash
# 1. 의존성 설치
npm install

# 2. 서버 실행
npm start

# 또는 개발 모드 (자동 재시작)
npm run dev
```

서버 실행 후:
- 대시보드: http://localhost:3000
- API: http://localhost:3000/api

### 데이터베이스 설정 (선택사항)

Backend를 사용하는 경우 SQLite 데이터베이스가 자동으로 생성됩니다.

```bash
# 데이터베이스 파일 위치
backend/database/webguard.db
```

## 📝 사용 예시

### 1. 기본 스캔

```javascript
// Extension에서 자동으로 처리됨
// 수동으로 트리거하려면:
chrome.tabs.sendMessage(tabId, {
  action: 'quickScan',
  options: {
    xss: true,
    csrf: true,
    headers: true,
    sensitiveData: true
  }
});
```

### 2. 심층 스캔

더 자세한 분석이 필요한 경우:

```javascript
chrome.tabs.sendMessage(tabId, {
  action: 'deepScan',
  options: {
    xss: true,
    csrf: true,
    headers: true,
    sensitiveData: true
  }
});
```

### 3. 특정 요소만 검사

```javascript
// Content Script에서
const forms = document.querySelectorAll('form');
// 폼만 검사...
```

## 🎯 주요 기능

### 1. 자동 스캔

설정에서 "자동 스캔"을 활성화하면:
- 페이지 로드 시 자동으로 보안 검사 실행
- 백그라운드에서 조용히 실행
- 심각한 문제 발견 시 알림

### 2. 컨텍스트 메뉴

웹페이지에서 우클릭 → "WebGuard로 이 페이지 스캔"

### 3. 리포트 생성

대시보드에서:
1. "리포트" 탭 이동
2. 포함할 심각도 선택
3. 날짜 범위 설정 (선택사항)
4. "리포트 생성" 클릭

### 4. 데이터 내보내기

- 팝업: "📥 결과 내보내기" → JSON 파일 다운로드
- 대시보드: "전체 데이터 내보내기" → 모든 히스토리 백업

## 🔍 테스트 웹사이트

연습용으로 다음 사이트에서 테스트해보세요:

1. **OWASP WebGoat**
   - https://github.com/WebGoat/WebGoat
   - 의도적으로 취약한 웹 애플리케이션

2. **DVWA (Damn Vulnerable Web Application)**
   - https://github.com/digininja/DVWA
   - 보안 학습용 취약 웹앱

3. **자신의 개발 프로젝트**
   - 로컬 개발 서버에서 테스트
   - http://localhost:3000 등

## 💡 팁

### 효과적인 스캔을 위해

1. **페이지가 완전히 로드된 후 스캔**
   - JavaScript로 동적 생성되는 요소도 감지

2. **로그인 후 스캔**
   - 인증이 필요한 페이지도 테스트

3. **여러 페이지 스캔**
   - 사이트 전체의 보안 상태 파악

4. **정기적으로 스캔**
   - 코드 변경 후마다 검증

### 문제 해결

**스캔이 작동하지 않는 경우:**
1. 확장 프로그램이 활성화되어 있는지 확인
2. 페이지 새로고침 후 재시도
3. 브라우저 콘솔에서 에러 확인 (F12)

**결과가 표시되지 않는 경우:**
1. Chrome Storage 권한 확인
2. 대시보드 새로고침
3. 데이터 삭제 후 재스캔

## 🔗 다음 단계

- [README.md](../README.md) - 전체 문서
- [보안 검사 항목](./SECURITY_CHECKS.md) - 상세 검사 내역
- [개발 가이드](./DEVELOPMENT.md) - 기여 방법

## 📞 도움이 필요하신가요?

- GitHub Issues에 문의
- 개발자 이메일로 연락

---

즐거운 테스팅 되세요! 🛡️
