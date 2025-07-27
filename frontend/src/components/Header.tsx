import React from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { Layout, Space, Button, Avatar, Typography, Dropdown } from 'antd';
import { UserOutlined, LogoutOutlined, MessageOutlined } from '@ant-design/icons';
import { authStore } from '../stores/authStore';
import { blogStore } from '../stores/blogStore';

const { Header: AntHeader } = Layout;
const { Text } = Typography;

const Header: React.FC = observer(() => {
  const navigate = useNavigate();

  const handleLogout = async (): Promise<void> => {
    await blogStore.logout();
    navigate('/login');
  };

  const userMenuItems = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ];

  return (
    <AntHeader 
      style={{ 
        background: '#fff', 
        padding: '0 24px',
        borderBottom: '1px solid #f0f0f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
    >
      <Space>
        <MessageOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
        <Text strong style={{ fontSize: '18px' }}>
          Blog System
        </Text>
      </Space>

      {authStore.isAuthenticated ? (
        <Space>
          <Text type="secondary">Welcome,</Text>
          <Dropdown 
            menu={{ items: userMenuItems }}
            placement="bottomRight"
            trigger={['click']}
          >
            <Button type="text" style={{ height: 'auto', padding: '4px 8px' }}>
              <Space>
                <Avatar size="small" icon={<UserOutlined />} />
                <Text strong>{authStore.nickName}</Text>
              </Space>
            </Button>
          </Dropdown>
        </Space>
      ) : (
        <Button 
          type="primary" 
          onClick={() => navigate('/login')}
        >
          Login
        </Button>
      )}
    </AntHeader>
  );
});

export default Header;