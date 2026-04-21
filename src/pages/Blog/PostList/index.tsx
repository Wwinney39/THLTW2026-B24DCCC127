import React, { useEffect } from 'react';
import { Card, Typography, Tag, Space, Divider, Button, Row, Col } from 'antd';
import { UserOutlined, CalendarOutlined, EyeOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/models/store';
import { incrementView } from '@/models/dataBlog';
import { history, useLocation } from 'umi';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const { Title, Text } = Typography;

const PostDetail: React.FC = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  // Extract ID from query
  const queryParams = new URLSearchParams(location.search);
  const postId = queryParams.get('id');

  const posts = useSelector((state: RootState) => state.blogState.posts);
  
  // Default to the first published post if no ID is provided in query params
  const post = postId 
    ? posts.find(p => p.id === postId) 
    : posts.find(p => p.status === 'published');

  useEffect(() => {
    if (post) {
      dispatch(incrementView(post.id));
    }
  }, [dispatch, post?.id]);

  if (!post) {
    return (
      <div style={{ padding: 24, textAlign: 'center' }}>
        <Title level={3}>Không tìm thấy bài viết</Title>
        <Button onClick={() => history.push('/blog/home')}>Quay lại trang chủ</Button>
      </div>
    );
  }

  // Find related posts (same tags, exclude current)
  const relatedPosts = posts.filter(p => 
    p.id !== post.id && 
    p.status === 'published' &&
    p.tags.some(tag => post.tags.includes(tag))
  ).slice(0, 3); // top 3 related

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <Button 
        icon={<ArrowLeftOutlined />} 
        onClick={() => history.push('/blog/home')}
        style={{ marginBottom: 16 }}
      >
        Quay lại
      </Button>

      <Row gutter={24}>
        <Col xs={24} lg={16}>
          <Card style={{ borderRadius: 12, padding: 12 }}>
            <Title level={2}>{post.title}</Title>
            
            <Space split={<Divider type="vertical" />} style={{ marginBottom: 16, flexWrap: 'wrap' }}>
              <Space><UserOutlined /> <Text strong>{post.author}</Text></Space>
              <Space><CalendarOutlined /> <Text type="secondary">{post.createdAt}</Text></Space>
              <Space><EyeOutlined /> <Text type="secondary">{post.views} lượt xem</Text></Space>
            </Space>

            <div style={{ marginBottom: 24 }}>
              {post.tags.map(tag => (
                <Tag color="cyan" key={tag}>{tag}</Tag>
              ))}
            </div>

            <img 
              src={post.thumbnail} 
              alt={post.title} 
              style={{ width: '100%', height: 'auto', borderRadius: 8, marginBottom: 24 }} 
            />

            <Typography>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {post.content}
              </ReactMarkdown>
            </Typography>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Bài viết liên quan" style={{ borderRadius: 12 }}>
            {relatedPosts.length > 0 ? (
              relatedPosts.map(rp => (
                <Card 
                  key={rp.id} 
                  hoverable 
                  size="small"
                  onClick={() => history.push(`/blog/post-list?id=${rp.id}`)}
                  style={{ marginBottom: 16 }}
                  cover={<img src={rp.thumbnail} alt={rp.title} style={{ height: 120, objectFit: 'cover' }} />}
                >
                  <Card.Meta 
                    title={rp.title} 
                    description={
                      <>
                        <Text type="secondary" style={{ fontSize: 12 }}>{rp.createdAt}</Text>
                        <div style={{ marginTop: 4 }}>
                          {rp.tags.slice(0, 2).map(tag => (
                            <Tag key={tag} color="blue" style={{ fontSize: 10 }}>{tag}</Tag>
                          ))}
                        </div>
                      </>
                    } 
                  />
                </Card>
              ))
            ) : (
              <Text type="secondary">Không có bài viết liên quan.</Text>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PostDetail;
