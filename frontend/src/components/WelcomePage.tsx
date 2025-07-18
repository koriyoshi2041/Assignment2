import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { Card, Typography, Button, Space, Spin, Avatar } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { authStore } from '../stores/authStore';

const { Title, Text } = Typography;

const WelcomePage: React.FC = observer(() => {
  const navigate = useNavigate();

  useEffect(() => {
    // If not authenticated, redirect to login
    if (!authStore.isAuthenticated) {
      navigate('/login');
      return;
    }

    // If authenticated but no user info, fetch it
    if (!authStore.nickName) {
      authStore.fetchUserInfo();
    }
  }, [navigate]);

  const handleLogout = (): void => {
    authStore.logout();
    navigate('/login');
  };

  if (!authStore.isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f0f2f5',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: 800,
        margin: '0 auto',
        paddingTop: '60px'
      }}>
        <Card
          style={{
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
          }}
        >
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Avatar
              size={80}
              icon={<UserOutlined />}
              style={{ backgroundColor: '#1890ff' }}
            />

            {authStore.nickName ? (
              <div>
                <Title level={2} style={{ marginBottom: 8 }}>
                  Hi, {authStore.nickName}!
                </Title>
                <Text type="secondary" style={{ fontSize: 16 }}>
                  欢迎来到用户登录服务系统
                </Text>
              </div>
            ) : (
              <div>
                <Spin />
                <Text style={{ marginLeft: 12 }}>正在加载用户信息...</Text>
              </div>
            )}

            <div style={{ marginTop: 32 }}>
              <Space size="middle">
                <Button
                  type="default"
                  icon={<LogoutOutlined />}
                  onClick={handleLogout}
                  size="large"
                >
                  退出登录
                </Button>
              </Space>
            </div>

            <div style={{ marginTop: 24, padding: '16px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                <strong>系统信息:</strong><br />
                Assignment 2: User Login Service MVP<br />
                技术栈: React + Ant Design + MobX + Go + Gin + JWT + TypeScript
              </Text>
            </div>
          </Space>
        </Card>
      </div>
    </div>
  );
});

export default WelcomePage;