# 보안 검사 항목 상세

## 📋 검사 항목 개요

WebGuard QA는 OWASP Top 10을 기반으로 다음 항목들을 검사합니다.

## 🔴 XSS (Cross-Site Scripting) 취약점

### 검사 내용

1. **인라인 이벤트 핸들러**
   ```html
   <!-- 위험한 패턴 -->
   <div onclick="handleClick()">Click</div>
   <img onload="malicious()">
   <body onerror="alert('XSS')">
   ```
   - 탐지: `onclick`, `onload`, `onerror`, `onmouseover` 등
   - 위험도: High
   - 권장: Event Listener 사용

2. **eval() 함수 사용**
   ```javascript
   // 위험한 패턴
   eval(userInput);
   new Function(userInput)();
   ```
   - 탐지: 스크립트 내 `eval(` 문자열
   - 위험도: Critical
   - 권장: JSON.parse() 또는 안전한 대안 사용

3. **사용자 입력 표시**
   ```javascript
   // 위험한 패턴
   element.innerHTML = userInput;
   ```
   - 탐지: 입력 필드 + 동적 콘텐츠 영역
   - 위험도: Medium
   - 권장: textContent 사용 또는 sanitization

### 방어 방법

```javascript
// ❌ 나쁜 예
div.innerHTML = userInput;

// ✅ 좋은 예
div.textContent = userInput;

// 또는 DOMPurify 사용
div.innerHTML = DOMPurify.sanitize(userInput);
```

## 🟠 CSRF (Cross-Site Request Forgery) 보호

### 검사 내용

1. **POST 폼의 토큰**
   ```html
   <!-- 안전한 패턴 -->
   <form method="POST">
     <input type="hidden" name="csrf_token" value="...">
     <!-- 또는 -->
     <input type="hidden" name="_token" value="...">
   </form>
   ```
   - 탐지: POST 폼에서 토큰 필드 확인
   - 위험도: High (토큰 없을 경우)
   - 권장: 모든 상태 변경 요청에 토큰 사용

### 방어 방법

```javascript
// Express.js 예시
const csrf = require('csurf');
app.use(csrf());

app.get('/form', (req, res) => {
  res.render('form', { csrfToken: req.csrfToken() });
});

// Django 예시
<!-- {% csrf_token %} -->
```

## 🟡 보안 헤더

### 검사 내용

1. **Content-Security-Policy (CSP)**
   ```html
   <meta http-equiv="Content-Security-Policy" 
         content="default-src 'self'; script-src 'self' 'unsafe-inline'">
   ```
   - 효과: XSS 공격 방어
   - 권장: 엄격한 CSP 정책

2. **X-Frame-Options**
   ```
   X-Frame-Options: DENY
   또는
   X-Frame-Options: SAMEORIGIN
   ```
   - 효과: Clickjacking 방어
   - 권장: DENY 또는 SAMEORIGIN

3. **Strict-Transport-Security (HSTS)**
   ```
   Strict-Transport-Security: max-age=31536000; includeSubDomains
   ```
   - 효과: HTTPS 강제
   - 권장: 최소 1년 설정

### 권장 헤더 설정

```javascript
// Express.js
const helmet = require('helmet');
app.use(helmet());

// 또는 수동 설정
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});
```

## 🔵 민감 정보 노출

### 검사 내용

1. **이메일 주소**
   - 패턴: `[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}`
   - 위험도: Low (다수일 경우 Medium)
   - 권장: 필요한 경우만 표시

2. **API 키 및 토큰**
   ```javascript
   // 위험한 패턴
   const API_KEY = "sk_live_51H...";
   const ACCESS_TOKEN = "ghp_16C7e42F292c6912E7710c838347Ae178B4a";
   ```
   - 패턴: `api_key`, `access_token` 등
   - 위험도: Critical
   - 권장: 환경 변수 사용

3. **HTML 주석의 민감 정보**
   ```html
   <!-- TODO: Remove test password: admin123 -->
   <!-- API_KEY: sk_test_... -->
   ```
   - 탐지: 주석 내 `password`, `token`, `key` 키워드
   - 위험도: Medium
   - 권장: 프로덕션 배포 전 주석 제거

### 방어 방법

```javascript
// ❌ 나쁜 예
const config = {
  apiKey: "sk_live_actual_key_here"
};

// ✅ 좋은 예
const config = {
  apiKey: process.env.API_KEY
};

// .env 파일에 저장
// API_KEY=sk_live_actual_key_here
```

## 🟢 DOM 보안

### 검사 내용

1. **HTTP 스크립트 로딩**
   ```html
   <!-- 위험한 패턴 -->
   <script src="http://cdn.example.com/lib.js"></script>
   ```
   - 위험도: High
   - 권장: HTTPS 사용

2. **외부 리소스 무결성**
   ```html
   <!-- 안전한 패턴 -->
   <script src="https://cdn.example.com/lib.js" 
           integrity="sha384-..."
           crossorigin="anonymous"></script>
   ```
   - 권장: SRI (Subresource Integrity) 사용

## 📊 검사 우선순위

### Critical (즉시 수정)
- eval() 함수 사용
- API 키 노출
- 평문 비밀번호

### High (우선 수정)
- CSRF 토큰 누락
- HTTP 스크립트 로딩
- 인라인 이벤트 핸들러

### Medium (수정 권장)
- CSP 미설정
- 민감 정보 주석
- 쿠키 보안 플래그

### Low (개선 사항)
- 과도한 이메일 노출
- 콘솔 로깅
- X-Frame-Options 미설정

## 🔒 추가 권장 사항

### 1. 입력 검증
```javascript
// 백엔드에서 검증
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// 프론트엔드는 UX를 위한 것
// 실제 보안은 백엔드에서!
```

### 2. 출력 인코딩
```javascript
// HTML 인코딩
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}
```

### 3. 세션 관리
```javascript
// 안전한 쿠키 설정
res.cookie('sessionId', value, {
  httpOnly: true,  // JavaScript 접근 차단
  secure: true,    // HTTPS만
  sameSite: 'strict' // CSRF 방어
});
```

### 4. 정기적 업데이트
- 의존성 패키지 업데이트
- 보안 패치 적용
- 취약점 스캔

## 📚 참고 자료

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)
- [CSP Guide](https://content-security-policy.com/)
- [CSRF Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)

---

더 자세한 내용은 각 프레임워크의 보안 문서를 참고하세요.
