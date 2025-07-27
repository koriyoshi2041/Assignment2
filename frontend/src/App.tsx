import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import LoginPage from './components/LoginPage';
import BlogPage from './components/BlogPage';
import ProtectedRoute from './components/ProtectedRoute';
import 'antd/dist/reset.css';

const App: React.FC = () => {
  return (
    <ConfigProvider locale={zhCN}>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route 
            path="/blog" 
            element={
              <ProtectedRoute>
                <BlogPage />
              </ProtectedRoute>
            } 
          />
          <Route path="/" element={<Navigate to="/blog" replace />} />
          <Route path="*" element={<Navigate to="/blog" replace />} />
        </Routes>
      </Router>
    </ConfigProvider>
  );
};

export default App;