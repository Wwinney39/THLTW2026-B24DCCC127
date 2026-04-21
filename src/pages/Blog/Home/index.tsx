import React, { useState, useMemo, useEffect } from 'react';
import { Card, Input, Pagination, Tag, Row, Col, Typography, Space } from 'antd';
import { SearchOutlined, UserOutlined, CalendarOutlined, EyeOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { RootState } from '@/models/store';
import debounce from 'lodash/debounce';
import { history } from 'umi';

const { Title, Text, Paragraph } = Typography;
const { Meta } = Card;

const Home: React.FC = () => {
  const posts = useSelector((state: RootState) => state.blogState.posts.filter(p => p.status === 'published'));
  
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const pageSize = 9;

  // Search logic with lodash debounce
  const handleSearch = useMemo(
    () =>
      debounce((value: string) => {
        setSearchText(value);
        setCurrentPage(1); // Reset page on new search
      }, 300),
    []
  );

  useEffect(() => {
    return () => {
      handleSearch.cancel();
    };
  }, [handleSearch]);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchText = post.title.toLowerCase().includes(searchText.toLowerCase()) || 
                        post.summary.toLowerCase().includes(searchText.toLowerCase());
      const matchTag = selectedTag ? post.tags.includes(selectedTag) : true;
      return matchText && matchTag;
    });
  }, [posts, searchText, selectedTag]);

  const currentPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredPosts.slice(startIndex, startIndex + pageSize);
  }, [filteredPosts, currentPage, pageSize]);

  return (
    <div style={{ padding: 24, minHeight: '100vh', background: '#f0f2f5' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={2}>Blog Của Tôi</Title>
        </Col>
        <Col>
          <Input
            placeholder="Tìm kiếm bài viết..."
            prefix={<SearchOutlined />}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ width: 300, borderRadius: 20 }}
            size="large"
          />
        </Col>
      </Row>

      {selectedTag && (
        <div style={{ marginBottom: 16 }}>
          <Text strong>Đang lọc theo thẻ: </Text>
          <Tag closable onClose={() => setSelectedTag(null)} color="blue">
            {selectedTag}
          </Tag>
        </div>
      )}

      <Row gutter={[24, 24]}>
        {currentPosts.map((post) => (
          <Col xs={24} sm={12} lg={8} key={post.id}>
            <Card
              hoverable
              cover={<img alt={post.title} src={post.thumbnail} style={{ height: 200, objectFit: 'cover' }} />}
              onClick={() => history.push(`/blog/post-list?id=${post.id}`)}
              style={{ borderRadius: 12, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%' }}
              bodyStyle={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}
              actions={[
                <Space key="author"><UserOutlined /> {post.author}</Space>,
                <Space key="date"><CalendarOutlined /> {post.createdAt}</Space>,
                <Space key="views"><EyeOutlined /> {post.views}</Space>
              ]}
            >
              <Meta
                title={<Title level={4} style={{ margin: 0 }}>{post.title}</Title>}
                description={
                  <>
                    <div style={{ margin: '12px 0' }}>
                      {post.tags.map(tag => (
                        <Tag 
                          key={tag} 
                          color="cyan" 
                          onClick={(e) => {
                            e.stopPropagation(); // prevent clicking card
                            setSelectedTag(tag);
                            setCurrentPage(1);
                          }}
                          style={{ cursor: 'pointer' }}
                        >
                          {tag}
                        </Tag>
                      ))}
                    </div>
                    <Paragraph ellipsis={{ rows: 3 }} style={{ marginBottom: 0 }}>
                      {post.summary}
                    </Paragraph>
                  </>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>

      {filteredPosts.length > 0 ? (
        <Row justify="center" style={{ marginTop: 32 }}>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={filteredPosts.length}
            onChange={(page) => setCurrentPage(page)}
            showSizeChanger={false}
          />
        </Row>
      ) : (
        <div style={{ textAlign: 'center', marginTop: 50 }}>
          <Text type="secondary">Không tìm thấy bài viết nào.</Text>
        </div>
      )}
    </div>
  );
};

export default Home;
