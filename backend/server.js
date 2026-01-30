const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Static files (대시보드 서빙)
app.use(express.static(path.join(__dirname, '../dashboard')));

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'WebGuard QA Backend is running' });
});

// 스캔 결과 저장 (예시)
app.post('/api/scans', (req, res) => {
  const { url, results } = req.body;
  
  // TODO: 데이터베이스에 저장
  console.log('Scan received:', { url, results: results.length });
  
  res.json({ 
    success: true, 
    message: 'Scan result saved',
    id: Date.now()
  });
});

// 스캔 히스토리 조회
app.get('/api/scans', (req, res) => {
  // TODO: 데이터베이스에서 조회
  res.json({ 
    success: true, 
    scans: [] 
  });
});

// 스캔 상세 조회
app.get('/api/scans/:id', (req, res) => {
  const { id } = req.params;
  
  // TODO: 데이터베이스에서 조회
  res.json({ 
    success: true, 
    scan: null 
  });
});

// 통계 API
app.get('/api/stats', (req, res) => {
  // TODO: 데이터베이스에서 통계 계산
  res.json({
    success: true,
    stats: {
      totalScans: 0,
      critical: 0,
      high: 0,
      medium: 0,
      low: 0
    }
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    error: 'Internal server error' 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🛡️ WebGuard QA Backend running on port ${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}`);
  console.log(`🔌 API: http://localhost:${PORT}/api`);
});

module.exports = app;
