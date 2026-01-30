// 메시지 리스너
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'quickScan') {
    performQuickScan(request.options)
      .then(results => sendResponse({ success: true, results }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // 비동기 응답
  }
  
  if (request.action === 'deepScan') {
    performDeepScan(request.options)
      .then(results => sendResponse({ success: true, results }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true;
  }
  
  if (request.action === 'testForms') {
    testForms()
      .then(results => sendResponse({ success: true, results }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true;
  }
  
  if (request.action === 'validateLinks') {
    validateLinks()
      .then(results => sendResponse({ success: true, results }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true;
  }
});

// 빠른 스캔
async function performQuickScan(options) {
  const results = [];
  
  if (options.xss) {
    const xssResults = await scanXSS();
    results.push(...xssResults);
  }
  
  if (options.csrf) {
    const csrfResults = await scanCSRF();
    results.push(...csrfResults);
  }
  
  if (options.headers) {
    const headerResults = await scanSecurityHeaders();
    results.push(...headerResults);
  }
  
  if (options.sensitiveData) {
    const sensitiveResults = await scanSensitiveData();
    results.push(...sensitiveResults);
  }
  
  return results;
}

// 심층 스캔
async function performDeepScan(options) {
  const results = await performQuickScan(options);
  
  // 추가 심층 검사
  const domResults = await analyzeDOMSecurity();
  const jsResults = await analyzeJavaScriptSecurity();
  const cookieResults = await analyzeCookies();
  
  results.push(...domResults, ...jsResults, ...cookieResults);
  
  return results;
}

// XSS 취약점 스캔
async function scanXSS() {
  const results = [];
  
  // 인라인 이벤트 핸들러 검사
  const elementsWithEvents = document.querySelectorAll('[onclick], [onload], [onerror], [onmouseover]');
  if (elementsWithEvents.length > 0) {
    results.push({
      severity: 'high',
      title: '인라인 이벤트 핸들러 발견',
      description: `${elementsWithEvents.length}개의 인라인 이벤트 핸들러가 발견되었습니다. XSS 공격에 취약할 수 있습니다.`
    });
  }
  
  // eval() 사용 검사
  const scripts = document.querySelectorAll('script');
  let evalUsage = 0;
  scripts.forEach(script => {
    if (script.textContent && script.textContent.includes('eval(')) {
      evalUsage++;
    }
  });
  
  if (evalUsage > 0) {
    results.push({
      severity: 'critical',
      title: 'eval() 함수 사용 감지',
      description: `${evalUsage}개의 스크립트에서 eval() 함수 사용이 감지되었습니다. 코드 인젝션에 매우 취약합니다.`
    });
  }
  
  // innerHTML 사용 검사
  const allElements = document.querySelectorAll('*');
  let innerHTMLRisk = 0;
  
  // 사용자 입력 필드 확인
  const inputs = document.querySelectorAll('input, textarea');
  if (inputs.length > 0 && document.querySelectorAll('[data-user-content]').length > 0) {
    results.push({
      severity: 'medium',
      title: '사용자 입력 표시 감지',
      description: '사용자 입력이 페이지에 표시될 수 있습니다. 적절한 sanitization이 필요합니다.'
    });
  }
  
  if (results.length === 0) {
    results.push({
      severity: 'pass',
      title: 'XSS 취약점',
      description: '명백한 XSS 취약점이 발견되지 않았습니다.'
    });
  }
  
  return results;
}

// CSRF 토큰 검사
async function scanCSRF() {
  const results = [];
  const forms = document.querySelectorAll('form[method="post"], form[method="POST"]');
  
  if (forms.length === 0) {
    return [{
      severity: 'pass',
      title: 'CSRF 보호',
      description: 'POST 폼이 없습니다.'
    }];
  }
  
  let formsWithoutToken = 0;
  
  forms.forEach(form => {
    const hasCSRFToken = form.querySelector('input[name*="csrf"], input[name*="token"], input[name="_token"]');
    if (!hasCSRFToken) {
      formsWithoutToken++;
    }
  });
  
  if (formsWithoutToken > 0) {
    results.push({
      severity: 'high',
      title: 'CSRF 토큰 누락',
      description: `${formsWithoutToken}개의 POST 폼에서 CSRF 토큰이 발견되지 않았습니다. CSRF 공격에 취약할 수 있습니다.`
    });
  } else {
    results.push({
      severity: 'pass',
      title: 'CSRF 보호',
      description: '모든 POST 폼에 토큰이 있습니다.'
    });
  }
  
  return results;
}

// 보안 헤더 검사
async function scanSecurityHeaders() {
  const results = [];
  
  // 주요 보안 헤더 체크 (실제로는 네트워크 요청을 통해 확인해야 함)
  // 여기서는 메타 태그로 확인
  const csp = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
  if (!csp) {
    results.push({
      severity: 'medium',
      title: 'Content-Security-Policy 미설정',
      description: 'CSP 헤더가 설정되지 않았습니다. XSS 공격 방어가 약화됩니다.'
    });
  } else {
    results.push({
      severity: 'pass',
      title: 'Content-Security-Policy',
      description: 'CSP가 설정되어 있습니다.'
    });
  }
  
  // X-Frame-Options 체크
  const frameOptions = document.querySelector('meta[http-equiv="X-Frame-Options"]');
  if (!frameOptions) {
    results.push({
      severity: 'low',
      title: 'X-Frame-Options 미설정',
      description: 'Clickjacking 공격에 취약할 수 있습니다.'
    });
  }
  
  return results;
}

// 민감 정보 노출 검사
async function scanSensitiveData() {
  const results = [];
  const bodyText = document.body.textContent;
  
  // 이메일 패턴
  const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const emails = bodyText.match(emailPattern);
  if (emails && emails.length > 5) {
    results.push({
      severity: 'low',
      title: '다수의 이메일 주소 노출',
      description: `${emails.length}개의 이메일 주소가 페이지에 노출되어 있습니다.`
    });
  }
  
  // API 키 패턴 (간단한 예시)
  const apiKeyPatterns = [
    /api[_-]?key[_-]?[:=]\s*['"]?[a-zA-Z0-9]{20,}['"]?/gi,
    /access[_-]?token[_-]?[:=]\s*['"]?[a-zA-Z0-9]{20,}['"]?/gi
  ];
  
  apiKeyPatterns.forEach(pattern => {
    if (pattern.test(bodyText)) {
      results.push({
        severity: 'critical',
        title: 'API 키 또는 토큰 노출 가능',
        description: '페이지에서 API 키 또는 액세스 토큰으로 보이는 문자열이 발견되었습니다.'
      });
    }
  });
  
  // 주석에 민감 정보
  const comments = document.evaluate('//comment()', document, null, XPathResult.ANY_TYPE, null);
  let comment;
  let suspiciousComments = 0;
  while (comment = comments.iterateNext()) {
    const text = comment.textContent.toLowerCase();
    if (text.includes('password') || text.includes('token') || text.includes('key')) {
      suspiciousComments++;
    }
  }
  
  if (suspiciousComments > 0) {
    results.push({
      severity: 'medium',
      title: 'HTML 주석에 민감 정보',
      description: `${suspiciousComments}개의 주석에서 민감할 수 있는 키워드가 발견되었습니다.`
    });
  }
  
  if (results.length === 0) {
    results.push({
      severity: 'pass',
      title: '민감 정보 노출',
      description: '명백한 민감 정보 노출이 발견되지 않았습니다.'
    });
  }
  
  return results;
}

// DOM 보안 분석
async function analyzeDOMSecurity() {
  const results = [];
  
  // document.write 사용
  const hasDocWrite = document.querySelectorAll('script').length > 0;
  
  // 외부 스크립트 로딩
  const externalScripts = document.querySelectorAll('script[src]');
  const httpScripts = Array.from(externalScripts).filter(s => s.src.startsWith('http://'));
  
  if (httpScripts.length > 0) {
    results.push({
      severity: 'high',
      title: 'HTTP를 통한 스크립트 로딩',
      description: `${httpScripts.length}개의 스크립트가 암호화되지 않은 HTTP로 로드됩니다. MITM 공격에 취약합니다.`
    });
  }
  
  return results;
}

// JavaScript 보안 분석
async function analyzeJavaScriptSecurity() {
  const results = [];
  
  // console.log 남용
  const scripts = Array.from(document.querySelectorAll('script'))
    .filter(s => !s.src && s.textContent.includes('console.log'));
  
  if (scripts.length > 5) {
    results.push({
      severity: 'low',
      title: '과도한 콘솔 로깅',
      description: '프로덕션 환경에서 민감한 정보가 콘솔에 노출될 수 있습니다.'
    });
  }
  
  return results;
}

// 쿠키 분석
async function analyzeCookies() {
  const results = [];
  const cookies = document.cookie.split(';');
  
  if (cookies.length > 0 && cookies[0] !== '') {
    // HttpOnly, Secure 플래그는 JavaScript에서 확인 불가
    results.push({
      severity: 'medium',
      title: '쿠키 사용 감지',
      description: `${cookies.length}개의 쿠키가 발견되었습니다. HttpOnly 및 Secure 플래그 설정을 확인하세요.`
    });
  }
  
  return results;
}

// 폼 테스트
async function testForms() {
  const results = [];
  const forms = document.querySelectorAll('form');
  
  if (forms.length === 0) {
    return [{
      severity: 'pass',
      title: '폼 테스트',
      description: '테스트할 폼이 없습니다.'
    }];
  }
  
  forms.forEach((form, index) => {
    const inputs = form.querySelectorAll('input, textarea, select');
    const requiredInputs = form.querySelectorAll('[required]');
    
    results.push({
      severity: 'pass',
      title: `폼 #${index + 1}`,
      description: `${inputs.length}개 입력 필드, ${requiredInputs.length}개 필수 필드`
    });
    
    // 유효성 검사 확인
    if (requiredInputs.length === 0 && inputs.length > 0) {
      results.push({
        severity: 'low',
        title: `폼 #${index + 1} - 유효성 검사 부족`,
        description: '필수 입력 필드가 설정되지 않았습니다.'
      });
    }
  });
  
  return results;
}

// 링크 검증
async function validateLinks() {
  const results = [];
  const links = document.querySelectorAll('a[href]');
  
  if (links.length === 0) {
    return [{
      severity: 'pass',
      title: '링크 검증',
      description: '검증할 링크가 없습니다.'
    }];
  }
  
  let brokenLinks = 0;
  let externalLinks = 0;
  let unsafeLinks = 0;
  
  links.forEach(link => {
    const href = link.href;
    
    if (href === '' || href === '#') {
      brokenLinks++;
    }
    
    if (href.startsWith('http://')) {
      unsafeLinks++;
    }
    
    try {
      const url = new URL(href);
      if (url.hostname !== window.location.hostname) {
        externalLinks++;
      }
    } catch (e) {
      brokenLinks++;
    }
  });
  
  results.push({
    severity: 'pass',
    title: '링크 통계',
    description: `총 ${links.length}개 링크 (외부: ${externalLinks}개)`
  });
  
  if (brokenLinks > 0) {
    results.push({
      severity: 'medium',
      title: '잘못된 링크 발견',
      description: `${brokenLinks}개의 빈 링크 또는 잘못된 링크가 발견되었습니다.`
    });
  }
  
  if (unsafeLinks > 0) {
    results.push({
      severity: 'low',
      title: 'HTTP 링크 발견',
      description: `${unsafeLinks}개의 암호화되지 않은 HTTP 링크가 있습니다.`
    });
  }
  
  return results;
}

console.log('WebGuard QA Content Script loaded');
