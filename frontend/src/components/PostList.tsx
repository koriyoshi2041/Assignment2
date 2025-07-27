import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Card, Empty, Spin, Alert, Space, Avatar, Typography, Divider } from 'antd';
import { MessageOutlined, UserOutlined, ClockCircleOutlined } from '@ant-design/icons';
import type { PostResponse } from '../api';
import { blogStore } from '../stores/blogStore';

const { Text, Paragraph } = Typography;

interface PostItemProps {
  post: PostResponse;
}

const PostItem: React.FC<PostItemProps> = ({ post }) => {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card
      style={{ marginBottom: 16 }}
      bodyStyle={{ padding: '16px 20px' }}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar icon={<UserOutlined />} size="small" />
          <Text strong style={{ color: '#1890ff' }}>
            {post.authorNickname}
          </Text>
          <Divider type="vertical" style={{ margin: 0 }} />
          <Space size={4}>
            <ClockCircleOutlined style={{ color: '#999', fontSize: '12px' }} />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {formatDate(post.createdAt)}
            </Text>
          </Space>
        </div>
        
        <Paragraph 
          style={{ 
            marginBottom: 0,
            whiteSpace: 'pre-wrap',
            lineHeight: 1.6
          }}
        >
          {post.content}
        </Paragraph>
      </Space>
    </Card>
  );
};

const PostList: React.FC = observer(() => {
  useEffect(() => {
    // Fetch posts when component mounts
    blogStore.fetchPosts();
  }, []);

  if (blogStore.isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>
          <Text type="secondary">Loading posts...</Text>
        </div>
      </div>
    );
  }

  if (blogStore.error) {
    return (
      <Alert
        message="Failed to load posts"
        description={blogStore.error}
        type="error"
        showIcon
        action={
          <button
            onClick={() => blogStore.fetchPosts()}
            style={{
              background: 'none',
              border: 'none',
              color: '#1890ff',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Retry
          </button>
        }
        style={{ marginBottom: 16 }}
      />
    );
  }

  if (blogStore.isEmpty) {
    return (
      <Card>
        <Empty
          image={<MessageOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />}
          description={
            <div>
              <Text type="secondary">No posts yet</Text>
              <br />
              <Text type="secondary" style={{ fontSize: '12px' }}>
                Be the first to share something!
              </Text>
            </div>
          }
        />
      </Card>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Text type="secondary">
          {blogStore.posts.length} post{blogStore.posts.length !== 1 ? 's' : ''}
        </Text>
      </div>
      
      {blogStore.posts.map((post) => (
        <PostItem key={post.id} post={post} />
      ))}
    </div>
  );
});

export default PostList;