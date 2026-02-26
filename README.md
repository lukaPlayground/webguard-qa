# WebGuard QA

통합 웹 보안 스캐너 및 자동화 테스트 Chrome 확장 프로그램

[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/mbeahmgkihkijohhmbcibjhmcnbbllag?label=Chrome%20Web%20Store)](https://chromewebstore.google.com/detail/webguard-qa/mbeahmgkihkijohhmbcibjhmcnbbllag)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 설치

[Chrome Web Store에서 설치 →](https://chromewebstore.google.com/detail/webguard-qa/mbeahmgkihkijohhmbcibjhmcnbbllag)

개발자 모드로 직접 설치하려면:

1. `chrome://extensions/` 이동
2. 우측 상단 **개발자 모드** 활성화
3. **압축해제된 확장 프로그램을 로드합니다** 클릭
4. `extension` 폴더 선택

```bash
git clone https://github.com/lukaPlayground/webguard-qa.git
```

## 주요 기능

**보안 스캔**
- XSS (Cross-Site Scripting) 취약점 탐지
- CSRF 토큰 검증
- 보안 헤더 검사 (CSP, X-Frame-Options, HSTS)
- 민감 정보 노출 검사 (API 키, 이메일 등)

**자동화 테스트**
- 폼 입력 필드 검증
- 링크 유효성 검사
- DOM 및 JavaScript 보안 분석

**버그 리포팅 대시보드**
- 실시간 스캔 결과 시각화
- 취약점 심각도별 분류 (Critical / High / Medium / Low)
- 스캔 히스토리 관리
- JSON 형식 리포트 내보내기

## 사용 방법

1. 검사할 웹사이트로 이동
2. 확장 프로그램 아이콘 클릭
3. **빠른 스캔** 또는 **심층 스캔** 선택
4. 팝업 또는 대시보드에서 결과 확인

## 심각도 분류

| 레벨 | 설명 |
|------|------|
| Critical | 즉각적인 보안 위협 — 즉시 수정 |
| High | 심각한 보안 문제 — 우선 수정 |
| Medium | 잠재적 보안 위험 — 수정 권장 |
| Low | 경미한 개선 사항 |
| Pass | 문제 없음 |

## 권한

| 권한 | 목적 |
|------|------|
| `activeTab` | 사용자 요청 시 현재 탭 스캔 |
| `storage` | 스캔 결과 로컬 저장 |
| `tabs` | 대시보드 열기 |
| `scripting` | 보안 검사 스크립트 삽입 |
| `contextMenus` | 우클릭 메뉴에 스캔 옵션 추가 |
| `notifications` | 심각한 취약점 발견 시 알림 |
| `downloads` | 리포트 파일 내보내기 |

`host_permissions` 미사용 — 사용자가 명시적으로 스캔을 요청할 때만 작동합니다.

## 개인정보 보호

모든 데이터는 브라우저 로컬에만 저장됩니다. 외부 서버 전송 없음.

## 기술 스택

- Chrome Extension Manifest V3
- Vanilla JavaScript, HTML5, CSS3
- Chrome Storage API, IndexedDB

## 라이선스

MIT License

## 개발자

Luka · [lukaplayground.tistory.com](https://lukaplayground.tistory.com)
