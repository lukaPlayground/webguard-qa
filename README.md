# 🛡️ WebGuard QA

통합 웹 보안 스캐너 및 자동화 테스트 시스템

[![Chrome Web Store](https://img.shields.io/badge/Chrome-Web%20Store-blue?logo=googlechrome)](https://chrome.google.com/webstore) 
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.0-green.svg)](manifest.json)

> **🎉 Chrome Web Store 제출 완료!** 심사 중입니다. 승인되면 링크가 업데이트됩니다.

## 📋 프로젝트 개요

WebGuard QA는 웹사이트의 보안 취약점을 자동으로 탐지하고, 자동화 테스트를 수행하며, 결과를 시각화하는 통합 QA 시스템입니다.

### 주요 기능

1. **보안 스캔**
   - XSS (Cross-Site Scripting) 취약점 탐지
   - CSRF (Cross-Site Request Forgery) 토큰 검증
   - 보안 헤더 검사 (CSP, X-Frame-Options)
   - 민감 정보 노출 검사 (API 키, 이메일 등)

2. **자동화 테스트**
   - 폼 입력 필드 검증
   - 링크 유효성 검사
   - DOM 보안 분석
   - JavaScript 보안 분석

3. **버그 리포팅 대시보드**
   - 실시간 스캔 결과 시각화
   - 취약점 심각도별 분류
   - 스캔 히스토리 관리
   - 상세 리포트 생성 및 내보내기

## 🚀 설치 방법

### 옵션 1: Chrome Web Store (권장)
```
🎉 심사 진행 중입니다!
승인되면 원클릭 설치 가능합니다.
```

### 옵션 2: 수동 설치 (개발자용)

1. 이 저장소를 클론하거나 다운로드합니다
```bash
git clone https://github.com/YOUR_USERNAME/webguard-qa.git
```

2. Chrome 브라우저에서 `chrome://extensions/` 로 이동합니다
3. 우측 상단의 "개발자 모드"를 활성화합니다
4. "압축해제된 확장 프로그램을 로드합니다" 클릭
5. `extension` 폴더를 선택합니다

**주의**: 개발자 모드로 설치 시 Chrome 재시작 시 비활성화 경고가 뜰 수 있습니다.

## 💻 사용 방법

### 빠른 시작

1. **웹사이트 스캔**
   - 테스트할 웹사이트로 이동
   - 확장 프로그램 아이콘 클릭
   - "빠른 스캔" 또는 "심층 스캔" 버튼 클릭

2. **스캔 옵션 설정**
   - XSS 취약점 검사
   - CSRF 토큰 검사
   - 보안 헤더 검사
   - 민감 정보 노출 검사

3. **결과 확인**
   - 팝업에서 즉시 결과 확인
   - 대시보드에서 상세 분석 확인

### 대시보드 사용

1. **개요**
   - 전체 보안 상태 한눈에 확인
   - 심각도별 통계
   - 최근 스캔 결과

2. **스캔 히스토리**
   - 과거 모든 스캔 기록
   - 검색 및 필터링
   - 상세 내역 확인

3. **취약점 분석**
   - 취약점 유형별 집계
   - 상세 내역 및 권장사항

4. **리포트**
   - 커스텀 리포트 생성
   - JSON 형식으로 내보내기

## 🏗️ 프로젝트 구조

```
web-guard-qa/
├── extension/              # Chrome Extension
│   ├── manifest.json       # 확장 프로그램 설정
│   ├── popup/              # 팝업 UI
│   │   ├── popup.html
│   │   ├── popup.css
│   │   └── popup.js
│   ├── content/            # Content Script (스캔 로직)
│   │   └── content-script.js
│   ├── background/         # Background Service Worker
│   │   └── service-worker.js
│   └── assets/             # 아이콘 등
├── dashboard/              # 웹 대시보드
│   ├── index.html
│   ├── css/
│   │   └── dashboard.css
│   └── js/
│       └── dashboard.js
├── backend/                # Backend API (선택사항)
│   ├── server.js
│   ├── routes/
│   ├── scanners/
│   └── database/
└── docs/                   # 문서
```

## 🔍 검사 항목

### XSS 취약점
- 인라인 이벤트 핸들러 (onclick, onload 등)
- eval() 함수 사용
- 사용자 입력 표시 방식

### CSRF 보호
- POST 폼의 CSRF 토큰 확인
- 토큰 필드 검증

### 보안 헤더
- Content-Security-Policy
- X-Frame-Options
- Strict-Transport-Security

### 민감 정보
- 이메일 주소 노출
- API 키 및 토큰 노출
- HTML 주석의 민감 정보

### DOM & JavaScript
- HTTP를 통한 스크립트 로딩
- 과도한 콘솔 로깅
- 외부 리소스 보안

## 📊 심각도 분류

| 레벨 | 설명 | 조치 |
|------|------|------|
| 🔴 Critical | 즉각적인 보안 위협 | 즉시 수정 필요 |
| 🟠 High | 심각한 보안 문제 | 우선 수정 권장 |
| 🟡 Medium | 잠재적 보안 위험 | 수정 권장 |
| 🔵 Low | 경미한 보안 개선 사항 | 시간 날 때 수정 |
| ✅ Pass | 문제 없음 | 조치 불필요 |

## 🛠️ 기술 스택

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Extension**: Chrome Extension Manifest V3
- **Storage**: Chrome Storage API, IndexedDB
- **Backend** (선택사항): Node.js, Express

## 🔒 개인정보 보호

WebGuard QA는 사용자의 개인정보를 **절대 수집하지 않습니다**.

- ✅ 모든 데이터는 사용자의 브라우저에만 저장
- ✅ 외부 서버로 전송 없음
- ✅ 추적 없음, 광고 없음
- ✅ 완전한 오프라인 작동
- ✅ 오픈소스 - 코드 검증 가능

자세한 내용은 [개인정보처리방침](privacy-policy.html)을 참조하세요.

## 🔐 권한 설명

WebGuard QA는 다음 권한만 사용합니다:

| 권한 | 사용 목적 |
|------|----------|
| `activeTab` | 사용자가 버튼 클릭 시 현재 탭에서만 보안 스캔 수행 |
| `storage` | 스캔 결과를 브라우저 로컬에 저장 |
| `tabs` | 대시보드 열기 및 스캔 페이지 정보 저장 |
| `scripting` | 보안 검사를 위한 스크립트 동적 삽입 |
| `contextMenus` | 우클릭 메뉴에 "스캔" 옵션 추가 |
| `notifications` | 심각한 보안 문제 발견 시 알림 |
| `downloads` | 스캔 결과 JSON 파일로 내보내기 |

**중요**: `host_permissions`를 사용하지 않아 모든 사이트에 자동 접근하지 않습니다.  
오직 사용자가 명시적으로 스캔을 요청할 때만 작동합니다.

## 📝 TODO

- [ ] Backend API 서버 구현
- [ ] 더 많은 보안 검사 추가
- [ ] 자동 수정 제안 기능
- [ ] CI/CD 통합
- [ ] 다국어 지원
- [ ] 실시간 모니터링

## 🤝 기여하기

버그 리포트, 기능 제안, Pull Request를 환영합니다!

## 📄 라이선스

MIT License

## 👤 개발자

루까 (Luka)

## 🔗 관련 링크

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Chrome Extension 개발 가이드](https://developer.chrome.com/docs/extensions/)
- [웹 보안 베스트 프랙티스](https://web.dev/security/)

---

**주의**: 이 도구는 교육 및 개발 목적으로 제작되었습니다. 실제 운영 환경에서는 전문적인 보안 감사를 권장합니다.
