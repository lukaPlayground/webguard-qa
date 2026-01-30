// 설치 이벤트
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('WebGuard QA installed');
    
    // 초기 설정
    chrome.storage.local.set({
      settings: {
        autoScan: false,
        notifications: true,
        scanHistory: []
      }
    });
    
    // 환영 페이지 열기
    chrome.tabs.create({
      url: chrome.runtime.getURL('dashboard/index.html')
    });
  }
});

// 탭 업데이트 감지
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    // 자동 스캔 설정 확인
    const result = await chrome.storage.local.get(['settings']);
    if (result.settings?.autoScan) {
      // 자동 스캔 트리거
      setTimeout(() => {
        chrome.tabs.sendMessage(tabId, {
          action: 'quickScan',
          options: {
            xss: true,
            csrf: true,
            headers: true,
            sensitiveData: true
          }
        }).catch(err => {
          console.log('Auto-scan failed:', err);
        });
      }, 2000);
    }
  }
});

// 메시지 리스너
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'saveScanResult') {
    // tabInfo가 제공되면 사용, 아니면 sender.tab 사용
    const tabInfo = request.tabInfo || sender.tab;
    saveScanResult(request.data, tabInfo)
      .then(() => sendResponse({ success: true }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true;
  }
  
  if (request.action === 'getScanHistory') {
    getScanHistory()
      .then(history => sendResponse({ success: true, history }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true;
  }
});

// 스캔 결과 저장
async function saveScanResult(data, tab) {
  const result = await chrome.storage.local.get(['scanHistory']);
  const history = result.scanHistory || [];
  
  const scanRecord = {
    id: Date.now(),
    url: tab.url,
    title: tab.title,
    timestamp: new Date().toISOString(),
    results: data,
    summary: generateSummary(data)
  };
  
  history.unshift(scanRecord);
  
  // 최근 100개만 유지
  if (history.length > 100) {
    history.length = 100;
  }
  
  await chrome.storage.local.set({ scanHistory: history });
  
  // 알림 표시 (심각한 문제가 있을 경우)
  const criticalIssues = data.filter(item => item.severity === 'critical');
  if (criticalIssues.length > 0) {
    showNotification(tab.title, criticalIssues.length);
  }
}

// 스캔 히스토리 가져오기
async function getScanHistory() {
  const result = await chrome.storage.local.get(['scanHistory']);
  return result.scanHistory || [];
}

// 요약 생성
function generateSummary(results) {
  const summary = {
    total: results.length,
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    pass: 0
  };
  
  results.forEach(item => {
    if (summary[item.severity] !== undefined) {
      summary[item.severity]++;
    }
  });
  
  return summary;
}

// 알림 표시
function showNotification(title, count) {
  if (chrome.notifications) {
    chrome.notifications.create({
      type: 'basic',
      title: 'WebGuard QA - 보안 경고',
      message: `${title}에서 ${count}개의 심각한 보안 문제가 발견되었습니다.`,
      priority: 2
    }).catch(err => console.log('Notification failed:', err));
  }
}

// 컨텍스트 메뉴 생성
chrome.runtime.onInstalled.addListener(() => {
  // 컨텍스트 메뉴 생성 (권한이 있을 때만)
  if (chrome.contextMenus) {
    chrome.contextMenus.create({
      id: 'webguard-scan',
      title: 'WebGuard로 이 페이지 스캔',
      contexts: ['page']
    }, () => {
      if (chrome.runtime.lastError) {
        console.log('Context menu creation failed:', chrome.runtime.lastError);
      }
    });
  }
});

// 컨텍스트 메뉴 클릭 핸들러
if (chrome.contextMenus) {
  chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === 'webguard-scan') {
      try {
        // Content script 동적 삽입
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['content/content-script.js']
        });

        await chrome.tabs.sendMessage(tab.id, {
          action: 'quickScan',
          options: {
            xss: true,
            csrf: true,
            headers: true,
            sensitiveData: true
          }
        });
      } catch (error) {
        console.error('Context menu scan failed:', error);
      }
    }
  });
}

console.log('WebGuard QA Background Service Worker loaded');
