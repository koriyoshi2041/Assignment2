import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { Layout, Typography, Space, Spin } from 'antd';
import { authStore } from '../stores/authStore';
import Header from './Header';
import CreatePostForm from './CreatePostForm';
import PostList from './PostList';

const { Content } = Layout;
const { Title, Text } = Typography;

const BlogPage: React.FC = observer(() => {
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
    <Layout style={{ minHeight: '100vh' }}>
      <Header />
      
      <Content style={{ 
        padding: '24px',
        backgroundColor: '#f0f2f5' 
      }}>
        <div style={{
          maxWidth: 800,
          margin: '0 auto'
        }}>
          <Space direction="vertical" style={{ width: '100%', marginBottom: 24 }}>
            <Title level={2} style={{ marginBottom: 8 }}>
              Blog Posts
            </Title>
            <Text type="secondary">
              Share your thoughts and read what others are posting
            </Text>
          </Space>

          <CreatePostForm />
          <PostList />
        </div>
      </Content>
    </Layout>
  );
});

export default BlogPage;