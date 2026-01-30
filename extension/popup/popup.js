// 현재 탭 정보 가져오기
async function getCurrentTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

// UI 초기화
async function initializeUI() {
  const tab = await getCurrentTab();
  if (tab?.url) {
    document.getElementById('currentUrl').textContent = tab.url;
  }

  // 저장된 스캔 결과 로드
  loadSavedResults();
}

// 스캔 결과 로드
async function loadSavedResults() {
  const tab = await getCurrentTab();
  const result = await chrome.storage.local.get([`scan_${tab.id}`]);
  
  if (result[`scan_${tab.id}`]) {
    displayResults(result[`scan_${tab.id}`]);
  }
}

// 빠른 스캔 실행
document.getElementById('quickScanBtn').addEventListener('click', async () => {
  const tab = await getCurrentTab();
  const options = getSelectedOptions();
  
  updateStatus('scanning', '스캔 중...');
  disableButtons(true);

  try {
    // Content script 동적 삽입
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content/content-script.js']
    });

    // Content script에 메시지 전송
    const response = await chrome.tabs.sendMessage(tab.id, {
      action: 'quickScan',
      options: options
    });

    if (response.success) {
      displayResults(response.results);
      await saveResults(tab.id, response.results);
      updateStatus('complete', '스캔 완료');
    } else {
      updateStatus('error', '스캔 실패: ' + response.error);
    }
  } catch (error) {
    console.error('Scan error:', error);
    updateStatus('error', '스캔 중 오류 발생');
  } finally {
    disableButtons(false);
  }
});

// 심층 스캔 실행
document.getElementById('deepScanBtn').addEventListener('click', async () => {
  const tab = await getCurrentTab();
  const options = getSelectedOptions();
  
  updateStatus('scanning', '심층 스캔 중... (시간이 걸릴 수 있습니다)');
  disableButtons(true);

  try {
    // Content script 동적 삽입
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content/content-script.js']
    });

    const response = await chrome.tabs.sendMessage(tab.id, {
      action: 'deepScan',
      options: options
    });

    if (response.success) {
      displayResults(response.results);
      await saveResults(tab.id, response.results);
      updateStatus('complete', '심층 스캔 완료');
    } else {
      updateStatus('error', '스캔 실패: ' + response.error);
    }
  } catch (error) {
    console.error('Deep scan error:', error);
    updateStatus('error', '스캔 중 오류 발생');
  } finally {
    disableButtons(false);
  }
});

// 폼 테스트 실행
document.getElementById('formTestBtn').addEventListener('click', async () => {
  const tab = await getCurrentTab();
  
  updateStatus('scanning', '폼 테스트 중...');
  disableButtons(true);

  try {
    // Content script 동적 삽입
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content/content-script.js']
    });

    const response = await chrome.tabs.sendMessage(tab.id, {
      action: 'testForms'
    });

    if (response.success) {
      displayResults(response.results);
      await saveResults(tab.id, response.results);
      updateStatus('complete', '폼 테스트 완료');
    } else {
      updateStatus('error', '테스트 실패: ' + response.error);
    }
  } catch (error) {
    console.error('Form test error:', error);
    updateStatus('error', '테스트 중 오류 발생');
  } finally {
    disableButtons(false);
  }
});

// 링크 검증 실행
document.getElementById('linkTestBtn').addEventListener('click', async () => {
  const tab = await getCurrentTab();
  
  updateStatus('scanning', '링크 검증 중...');
  disableButtons(true);

  try {
    // Content script 동적 삽입
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content/content-script.js']
    });

    const response = await chrome.tabs.sendMessage(tab.id, {
      action: 'validateLinks'
    });

    if (response.success) {
      displayResults(response.results);
      await saveResults(tab.id, response.results);
      updateStatus('complete', '링크 검증 완료');
    } else {
      updateStatus('error', '검증 실패: ' + response.error);
    }
  } catch (error) {
    console.error('Link validation error:', error);
    updateStatus('error', '검증 중 오류 발생');
  } finally {
    disableButtons(false);
  }
});

// 선택된 옵션 가져오기
function getSelectedOptions() {
  return {
    xss: document.getElementById('xssCheck').checked,
    csrf: document.getElementById('csrfCheck').checked,
    headers: document.getElementById('headersCheck').checked,
    sensitiveData: document.getElementById('sensitiveDataCheck').checked
  };
}

// 상태 업데이트
function updateStatus(status, message) {
  const statusEl = document.getElementById('scanStatus');
  statusEl.className = `status-${status}`;
  statusEl.textContent = message;
}

// 버튼 활성화/비활성화
function disableButtons(disabled) {
  const buttons = document.querySelectorAll('.btn');
  buttons.forEach(btn => btn.disabled = disabled);
}

// 결과 표시
function displayResults(results) {
  const container = document.getElementById('resultsContainer');
  container.innerHTML = '';

  if (!results || results.length === 0) {
    container.innerHTML = '<p class="placeholder">발견된 문제가 없습니다.</p>';
    return;
  }

  results.forEach(result => {
    const item = document.createElement('div');
    item.className = `result-item ${result.severity}`;
    
    const severityText = {
      critical: '심각',
      high: '높음',
      medium: '보통',
      low: '낮음',
      pass: '통과'
    };

    item.innerHTML = `
      <div class="result-title">
        <span>${result.title}</span>
        <span class="severity-badge">${severityText[result.severity]}</span>
      </div>
      <div class="result-description">${result.description}</div>
    `;
    
    container.appendChild(item);
  });
}

// 결과 저장
async function saveResults(tabId, results) {
  const tab = await getCurrentTab();
  
  // 탭별 임시 저장
  await chrome.storage.local.set({
    [`scan_${tabId}`]: results,
    [`scan_${tabId}_timestamp`]: Date.now()
  });
  
  // 히스토리에 저장 (Background로 전송)
  try {
    await chrome.runtime.sendMessage({
      action: 'saveScanResult',
      data: results,
      tabInfo: {
        id: tab.id,
        url: tab.url,
        title: tab.title
      }
    });
  } catch (error) {
    console.error('Failed to save to history:', error);
  }
}

// 대시보드 열기
document.getElementById('openDashboardBtn').addEventListener('click', () => {
  chrome.tabs.create({ url: chrome.runtime.getURL('dashboard/index.html') });
});

// 도움말 열기
document.getElementById('helpBtn').addEventListener('click', () => {
  chrome.tabs.create({ url: chrome.runtime.getURL('help.html') });
});

// 결과 내보내기
document.getElementById('exportBtn').addEventListener('click', async () => {
  const tab = await getCurrentTab();
  const result = await chrome.storage.local.get([`scan_${tab.id}`]);
  
  if (result[`scan_${tab.id}`]) {
    const dataStr = JSON.stringify(result[`scan_${tab.id}`], null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    try {
      await chrome.downloads.download({
        url: url,
        filename: `webguard-scan-${timestamp}.json`,
        saveAs: true
      });
    } catch (error) {
      console.error('Download failed:', error);
      // 대체 방법: 링크 클릭
      const a = document.createElement('a');
      a.href = url;
      a.download = `webguard-scan-${timestamp}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  } else {
    alert('내보낼 스캔 결과가 없습니다.');
  }
});

// 초기화
initializeUI();
