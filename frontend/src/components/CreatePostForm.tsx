import React from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Input, Card, Alert, Space } from 'antd';
import { EditOutlined, SendOutlined } from '@ant-design/icons';
import { authStore } from '../stores/authStore';
import { blogStore } from '../stores/blogStore';

const { TextArea } = Input;

const CreatePostForm: React.FC = observer(() => {
  if (!authStore.isAuthenticated) {
    return null;
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    blogStore.setNewPostContent(e.target.value);
  };

  const handleSubmit = async (): Promise<void> => {
    const success = await blogStore.createPost();
    if (success) {
      // Optionally refresh the posts list
      await blogStore.fetchPosts();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      if (blogStore.canCreatePost) {
        handleSubmit();
      }
    }
  };

  return (
    <Card 
      title={
        <Space>
          <EditOutlined />
          <span>Create New Post</span>
        </Space>
      }
      style={{ marginBottom: 24 }}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        {blogStore.error && (
          <Alert 
            message={blogStore.error} 
            type="error" 
            closable 
            onClose={() => blogStore.setError(null)}
          />
        )}
        
        <TextArea
          placeholder="What's on your mind? Share your thoughts..."
          value={blogStore.newPostContent}
          onChange={handleContentChange}
          onKeyDown={handleKeyPress}
          rows={4}
          maxLength={5000}
          showCount
          style={{ resize: 'vertical' }}
        />
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#999', fontSize: '12px' }}>
            Press Ctrl+Enter to post quickly
          </span>
          
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSubmit}
            loading={blogStore.isCreatingPost}
            disabled={!blogStore.canCreatePost}
          >
            {blogStore.isCreatingPost ? 'Posting...' : 'Post'}
          </Button>
        </div>
      </Space>
    </Card>
  );
});

export default CreatePostForm;