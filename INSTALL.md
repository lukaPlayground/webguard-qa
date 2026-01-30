# 🚀 WebGuard QA 설치 가이드

## 빠른 시작 (5분 안에!)

### 1단계: Chrome Extension 설치

1. **Chrome 브라우저 열기**

2. **확장 프로그램 페이지로 이동**
   - 주소창에 입력: `chrome://extensions/`
   - 또는 메뉴 → 도구 더보기 → 확장 프로그램

3. **개발자 모드 활성화**
   - 우측 상단의 "개발자 모드" 토글 켜기

4. **확장 프로그램 로드**
   - "압축해제된 확장 프로그램을 로드합니다" 클릭
   - `~/Desktop/ai-code/web-guard-qa/extension` 폴더 선택
   - "폴더 선택" 클릭

5. **확인**
   - 브라우저 툴바에 WebGuard QA 아이콘 표시됨
   - 아이콘이 보이지 않으면 확장 프로그램 아이콘(퍼즐 모양) 클릭 → WebGuard QA 고정

### 2단계: 첫 스캔 실행

1. **테스트 웹사이트 접속**
   ```
   예시: https://example.com
   또는 자신의 로컬 개발 서버
   ```

2. **WebGuard QA 아이콘 클릭**

3. **"빠른 스캔" 버튼 클릭**

4. **결과 확인!**
   - 팝업에서 즉시 결과 확인
   - "📊 대시보드 열기"로 상세 분석

## 선택사항: Backend 서버 실행

더 많은 기능을 원한다면:

```bash
# 터미널 열기
cd ~/Desktop/ai-code/web-guard-qa

# 의존성 설치 (처음 한 번만)
npm install

# 서버 실행
npm start
```

서버 실행 후:
- 대시보드: http://localhost:3000
- API: http://localhost:3000/api

## 문제 해결

### 확장 프로그램이 로드되지 않는 경우

**증상**: "매니페스트 파일이 없거나 읽을 수 없습니다"

**해결**:
```bash
# manifest.json이 있는지 확인
ls ~/Desktop/ai-code/web-guard-qa/extension/manifest.json

# 파일이 없으면 프로젝트를 다시 클론
```

### 아이콘이 표시되지 않는 경우

**증상**: 확장 프로그램은 로드되지만 아이콘이 깨져 보임

**해결**: 아이콘이 없어도 기능은 정상 작동합니다. PNG 아이콘을 생성하려면:

```bash
# 온라인 변환기 사용
https://cloudconvert.com/svg-to-png

# icon.svg를 다음 크기로 변환:
- 16x16 → icon16.png
- 32x32 → icon32.png  
- 48x48 → icon48.png
- 128x128 → icon128.png

# 변환된 파일을 extension/assets/ 폴더에 저장
```

### 스캔이 작동하지 않는 경우

**증상**: 버튼 클릭 시 아무 반응 없음

**해결**:
1. 페이지 새로고침 (F5)
2. 확장 프로그램 다시 로드
   - `chrome://extensions/` → WebGuard QA → 새로고침 버튼
3. 브라우저 콘솔 확인 (F12) → Console 탭
4. 에러 메시지가 있으면 GitHub Issues에 보고

### Backend 서버 오류

**증상**: `npm install` 실패

**해결**:
```bash
# Node.js 버전 확인 (14 이상 필요)
node --version

# Node.js 설치가 안 되어 있다면
# macOS
brew install node

# Ubuntu/Debian
sudo apt install nodejs npm

# Windows
https://nodejs.org/ 에서 다운로드
```

## 다음 단계

✅ 설치 완료!

이제 할 수 있는 것:
1. 다양한 웹사이트에서 스캔 실행
2. 대시보드에서 결과 분석
3. 리포트 생성 및 공유
4. 설정 커스터마이징

더 자세한 내용은:
- [시작하기 가이드](docs/GETTING_STARTED.md)
- [보안 검사 항목](docs/SECURITY_CHECKS.md)
- [README](README.md)

## 제거 방법

확장 프로그램 제거:
1. `chrome://extensions/` 접속
2. WebGuard QA 찾기
3. "제거" 클릭

프로젝트 파일 삭제:
```bash
rm -rf ~/Desktop/ai-code/web-guard-qa
```

---

설치 중 문제가 있나요? GitHub Issues에 문의하세요!
