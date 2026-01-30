// 페이지 전환
const navItems = document.querySelectorAll('.nav-item');
const pages = document.querySelectorAll('.page-content');

navItems.forEach(item => {
  item.addEventListener('click', () => {
    const page = item.dataset.page;
    
    // 네비게이션 활성화
    navItems.forEach(nav => nav.classList.remove('active'));
    item.classList.add('active');
    
    // 페이지 표시
    pages.forEach(p => p.classList.remove('active'));
    document.getElementById(`${page}-page`).classList.add('active');
    
    // 타이틀 업데이트
    const titles = {
      overview: { title: '개요', subtitle: '전체 보안 상태를 확인하세요' },
      history: { title: '스캔 히스토리', subtitle: '과거 스캔 결과를 확인하세요' },
      vulnerabilities: { title: '취약점 분석', subtitle: '발견된 취약점을 분석하세요' },
      reports: { title: '리포트', subtitle: '상세 리포트를 생성하세요' },
      settings: { title: '설정', subtitle: '앱 설정을 관리하세요' }
    };
    
    document.getElementById('pageTitle').textContent = titles[page].title;
    document.getElementById('pageSubtitle').textContent = titles[page].subtitle;
    
    // 페이지별 데이터 로드
    loadPageData(page);
  });
});

// 데이터 로드
async function loadPageData(page) {
  switch (page) {
    case 'overview':
      await loadOverview();
      break;
    case 'history':
      await loadHistory();
      break;
    case 'vulnerabilities':
      await loadVulnerabilities();
      break;
  }
}

// 개요 페이지 로드
async function loadOverview() {
  try {
    const result = await chrome.storage.local.get(['scanHistory']);
    const history = result.scanHistory || [];
    
    if (history.length === 0) {
      return;
    }
    
    // 통계 계산
    const stats = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0
    };
    
    history.forEach(scan => {
      if (scan.summary) {
        stats.critical += scan.summary.critical || 0;
        stats.high += scan.summary.high || 0;
        stats.medium += scan.summary.medium || 0;
        stats.low += scan.summary.low || 0;
      }
    });
    
    // 통계 업데이트
    document.getElementById('criticalCount').textContent = stats.critical;
    document.getElementById('highCount').textContent = stats.high;
    document.getElementById('mediumCount').textContent = stats.medium;
    document.getElementById('lowCount').textContent = stats.low;
    
    // 최근 스캔 표시
    displayRecentScans(history.slice(0, 5));
    
    // 차트 그리기 (간단한 텍스트 표시로 대체)
    displaySimpleCharts(history);
    
  } catch (error) {
    console.error('Failed to load overview:', error);
  }
}

// 최근 스캔 표시
function displayRecentScans(scans) {
  const container = document.getElementById('recentScansContainer');
  
  if (scans.length === 0) {
    container.innerHTML = '<p class="placeholder">스캔 기록이 없습니다.</p>';
    return;
  }
  
  container.innerHTML = '';
  
  scans.forEach(scan => {
    const item = document.createElement('div');
    item.className = 'scan-item';
    
    const time = new Date(scan.timestamp).toLocaleString('ko-KR');
    const summary = scan.summary || {};
    
    let badges = '';
    if (summary.critical > 0) {
      badges += `<span class="summary-badge critical">심각: ${summary.critical}</span>`;
    }
    if (summary.high > 0) {
      badges += `<span class="summary-badge high">높음: ${summary.high}</span>`;
    }
    if (summary.medium > 0) {
      badges += `<span class="summary-badge medium">보통: ${summary.medium}</span>`;
    }
    if (summary.low > 0) {
      badges += `<span class="summary-badge low">낮음: ${summary.low}</span>`;
    }
    
    item.innerHTML = `
      <div class="scan-header">
        <div class="scan-title">${scan.title || '제목 없음'}</div>
        <div class="scan-time">${time}</div>
      </div>
      <div class="scan-url">${scan.url}</div>
      <div class="scan-summary">${badges || '<span>문제 없음</span>'}</div>
    `;
    
    item.addEventListener('click', () => {
      showScanDetails(scan);
    });
    
    container.appendChild(item);
  });
}

// 간단한 차트 표시
function displaySimpleCharts(history) {
  const trendCanvas = document.getElementById('trendChart');
  const distributionCanvas = document.getElementById('distributionChart');
  
  if (!trendCanvas || !distributionCanvas) return;
  
  // 실제 차트 라이브러리 없이 간단한 메시지 표시
  const trendCtx = trendCanvas.getContext('2d');
  const distCtx = distributionCanvas.getContext('2d');
  
  // 트렌드 차트
  trendCtx.fillStyle = '#667eea';
  trendCtx.font = '14px sans-serif';
  trendCtx.fillText(`총 ${history.length}개의 스캔 기록`, 20, 130);
  
  // 분포 차트
  distCtx.fillStyle = '#764ba2';
  distCtx.font = '14px sans-serif';
  distCtx.fillText('취약점 분포 데이터', 20, 130);
}

// 히스토리 페이지 로드
async function loadHistory() {
  try {
    const result = await chrome.storage.local.get(['scanHistory']);
    const history = result.scanHistory || [];
    
    displayHistory(history);
  } catch (error) {
    console.error('Failed to load history:', error);
  }
}

// 히스토리 표시
function displayHistory(history) {
  const container = document.getElementById('historyContainer');
  
  if (history.length === 0) {
    container.innerHTML = '<p class="placeholder">스캔 기록이 없습니다.</p>';
    return;
  }
  
  container.innerHTML = '';
  
  history.forEach(scan => {
    const item = document.createElement('div');
    item.className = 'scan-item';
    
    const time = new Date(scan.timestamp).toLocaleString('ko-KR');
    const summary = scan.summary || {};
    
    let badges = '';
    if (summary.critical > 0) badges += `<span class="summary-badge critical">심각: ${summary.critical}</span>`;
    if (summary.high > 0) badges += `<span class="summary-badge high">높음: ${summary.high}</span>`;
    if (summary.medium > 0) badges += `<span class="summary-badge medium">보통: ${summary.medium}</span>`;
    if (summary.low > 0) badges += `<span class="summary-badge low">낮음: ${summary.low}</span>`;
    
    item.innerHTML = `
      <div class="scan-header">
        <div class="scan-title">${scan.title || '제목 없음'}</div>
        <div class="scan-time">${time}</div>
      </div>
      <div class="scan-url">${scan.url}</div>
      <div class="scan-summary">${badges || '<span>문제 없음</span>'}</div>
    `;
    
    item.addEventListener('click', () => {
      showScanDetails(scan);
    });
    
    container.appendChild(item);
  });
}

// 취약점 분석 로드
async function loadVulnerabilities() {
  try {
    const result = await chrome.storage.local.get(['scanHistory']);
    const history = result.scanHistory || [];
    
    if (history.length === 0) {
      return;
    }
    
    // 취약점 유형별 집계
    const vulnerabilities = {
      xss: { count: 0, items: [] },
      csrf: { count: 0, items: [] },
      headers: { count: 0, items: [] },
      sensitiveData: { count: 0, items: [] }
    };
    
    history.forEach(scan => {
      scan.results?.forEach(result => {
        const title = result.title.toLowerCase();
        
        if (title.includes('xss') || title.includes('인라인') || title.includes('eval')) {
          vulnerabilities.xss.count++;
          vulnerabilities.xss.items.push({ ...result, url: scan.url, time: scan.timestamp });
        } else if (title.includes('csrf') || title.includes('토큰')) {
          vulnerabilities.csrf.count++;
          vulnerabilities.csrf.items.push({ ...result, url: scan.url, time: scan.timestamp });
        } else if (title.includes('헤더') || title.includes('csp')) {
          vulnerabilities.headers.count++;
          vulnerabilities.headers.items.push({ ...result, url: scan.url, time: scan.timestamp });
        } else if (title.includes('민감') || title.includes('이메일') || title.includes('api')) {
          vulnerabilities.sensitiveData.count++;
          vulnerabilities.sensitiveData.items.push({ ...result, url: scan.url, time: scan.timestamp });
        }
      });
    });
    
    displayVulnerabilitySummary(vulnerabilities);
    displayVulnerabilityDetails(vulnerabilities);
    
  } catch (error) {
    console.error('Failed to load vulnerabilities:', error);
  }
}

// 취약점 요약 표시
function displayVulnerabilitySummary(vulnerabilities) {
  const container = document.getElementById('vulnerabilitySummary');
  
  container.innerHTML = `
    <div class="vulnerability-card xss">
      <h4>XSS 취약점</h4>
      <div class="count">${vulnerabilities.xss.count}</div>
    </div>
    <div class="vulnerability-card csrf">
      <h4>CSRF 취약점</h4>
      <div class="count">${vulnerabilities.csrf.count}</div>
    </div>
    <div class="vulnerability-card headers">
      <h4>보안 헤더</h4>
      <div class="count">${vulnerabilities.headers.count}</div>
    </div>
    <div class="vulnerability-card data">
      <h4>민감 정보</h4>
      <div class="count">${vulnerabilities.sensitiveData.count}</div>
    </div>
  `;
}

// 취약점 상세 표시
function displayVulnerabilityDetails(vulnerabilities) {
  const container = document.getElementById('vulnerabilityDetails');
  
  const allItems = [
    ...vulnerabilities.xss.items.map(item => ({ ...item, type: 'XSS' })),
    ...vulnerabilities.csrf.items.map(item => ({ ...item, type: 'CSRF' })),
    ...vulnerabilities.headers.items.map(item => ({ ...item, type: '헤더' })),
    ...vulnerabilities.sensitiveData.items.map(item => ({ ...item, type: '민감 정보' }))
  ];
  
  if (allItems.length === 0) {
    container.innerHTML = '<p class="placeholder">분석할 데이터가 없습니다.</p>';
    return;
  }
  
  container.innerHTML = '';
  
  allItems.forEach(item => {
    const detailItem = document.createElement('div');
    detailItem.className = `detail-item ${item.severity}`;
    
    detailItem.innerHTML = `
      <div class="detail-header">
        <div class="detail-title">[${item.type}] ${item.title}</div>
        <div class="detail-count">${item.severity}</div>
      </div>
      <div class="detail-description">${item.description}</div>
      <div class="detail-description" style="margin-top: 8px; opacity: 0.7;">
        📍 ${item.url}<br>
        🕐 ${new Date(item.time).toLocaleString('ko-KR')}
      </div>
    `;
    
    container.appendChild(detailItem);
  });
}

// 스캔 상세 보기
function showScanDetails(scan) {
  alert(`스캔 상세 정보\n\n제목: ${scan.title}\nURL: ${scan.url}\n시간: ${new Date(scan.timestamp).toLocaleString('ko-KR')}\n\n발견된 문제: ${scan.results?.length || 0}개`);
}

// 검색 필터
document.getElementById('searchInput')?.addEventListener('input', (e) => {
  filterHistory(e.target.value);
});

document.getElementById('severityFilter')?.addEventListener('change', (e) => {
  filterHistory(document.getElementById('searchInput').value, e.target.value);
});

async function filterHistory(searchTerm = '', severity = 'all') {
  const result = await chrome.storage.local.get(['scanHistory']);
  let history = result.scanHistory || [];
  
  if (searchTerm) {
    history = history.filter(scan => 
      scan.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scan.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  
  if (severity !== 'all') {
    history = history.filter(scan => {
      return scan.results?.some(result => result.severity === severity);
    });
  }
  
  displayHistory(history);
}

// 리포트 생성
document.getElementById('generateReportBtn')?.addEventListener('click', async () => {
  const includeCritical = document.getElementById('includeCritical').checked;
  const includeHigh = document.getElementById('includeHigh').checked;
  const includeMedium = document.getElementById('includeMedium').checked;
  const includeLow = document.getElementById('includeLow').checked;
  
  const result = await chrome.storage.local.get(['scanHistory']);
  const history = result.scanHistory || [];
  
  const reportData = [];
  
  history.forEach(scan => {
    scan.results?.forEach(result => {
      if ((includeCritical && result.severity === 'critical') ||
          (includeHigh && result.severity === 'high') ||
          (includeMedium && result.severity === 'medium') ||
          (includeLow && result.severity === 'low')) {
        reportData.push({
          url: scan.url,
          title: scan.title,
          time: scan.timestamp,
          issue: result
        });
      }
    });
  });
  
  displayReport(reportData);
});

// 리포트 표시
function displayReport(data) {
  const container = document.getElementById('reportPreview');
  
  if (data.length === 0) {
    container.innerHTML = '<p class="placeholder">선택한 조건에 맞는 데이터가 없습니다.</p>';
    return;
  }
  
  let html = '<h3>보안 스캔 리포트</h3>';
  html += `<p>생성 시간: ${new Date().toLocaleString('ko-KR')}</p>`;
  html += `<p>총 발견 문제: ${data.length}개</p><hr style="margin: 20px 0;">`;
  
  data.forEach((item, index) => {
    html += `
      <div style="margin-bottom: 20px; padding: 15px; background: #f9f9f9; border-radius: 8px;">
        <h4>${index + 1}. ${item.issue.title}</h4>
        <p><strong>심각도:</strong> ${item.issue.severity}</p>
        <p><strong>설명:</strong> ${item.issue.description}</p>
        <p><strong>URL:</strong> ${item.url}</p>
        <p><strong>발견 시간:</strong> ${new Date(item.time).toLocaleString('ko-KR')}</p>
      </div>
    `;
  });
  
  container.innerHTML = html;
}

// 설정 로드
async function loadSettings() {
  const result = await chrome.storage.local.get(['settings']);
  const settings = result.settings || {};
  
  document.getElementById('autoScanToggle').checked = settings.autoScan || false;
  document.getElementById('notificationsToggle').checked = settings.notifications !== false;
}

// 설정 저장
document.getElementById('autoScanToggle')?.addEventListener('change', async (e) => {
  const result = await chrome.storage.local.get(['settings']);
  const settings = result.settings || {};
  settings.autoScan = e.target.checked;
  await chrome.storage.local.set({ settings });
});

document.getElementById('notificationsToggle')?.addEventListener('change', async (e) => {
  const result = await chrome.storage.local.get(['settings']);
  const settings = result.settings || {};
  settings.notifications = e.target.checked;
  await chrome.storage.local.set({ settings });
});

// 데이터 관리
document.getElementById('clearHistoryBtn')?.addEventListener('click', async () => {
  if (confirm('모든 스캔 히스토리를 삭제하시겠습니까?')) {
    await chrome.storage.local.set({ scanHistory: [] });
    alert('스캔 히스토리가 삭제되었습니다.');
    loadPageData('overview');
  }
});

document.getElementById('resetSettingsBtn')?.addEventListener('click', async () => {
  if (confirm('모든 설정을 초기화하시겠습니까?')) {
    await chrome.storage.local.set({
      settings: {
        autoScan: false,
        notifications: true
      }
    });
    alert('설정이 초기화되었습니다.');
    loadSettings();
  }
});

// 전체 데이터 내보내기
document.getElementById('exportAllBtn')?.addEventListener('click', async () => {
  const result = await chrome.storage.local.get(null);
  const dataStr = JSON.stringify(result, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `webguard-data-${Date.now()}.json`;
  a.click();
});

// 새로고침
document.getElementById('refreshBtn')?.addEventListener('click', () => {
  const activePage = document.querySelector('.nav-item.active').dataset.page;
  loadPageData(activePage);
});

// 데이터 삭제
document.getElementById('clearDataBtn')?.addEventListener('click', async () => {
  if (confirm('표시된 페이지의 데이터를 삭제하시겠습니까?')) {
    // 구현 필요
    alert('기능 준비 중입니다.');
  }
});

// 초기 로드
loadOverview();
loadSettings();
