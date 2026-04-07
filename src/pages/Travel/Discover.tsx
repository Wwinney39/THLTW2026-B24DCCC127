import React, { useState, useEffect, useMemo } from 'react';
import { Card, Row, Col, Typography, Space, Rate, Select, Tag, InputNumber, Button, Empty } from 'antd';
import { EnvironmentOutlined, DollarOutlined, FilterOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { getDestinations } from '@/models/datatravel';
import { Destination } from '@/models/datatravel';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const Discover: React.FC = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [filterType, setFilterType] = useState<string>('All');
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState<string>('ratingDesc');

  useEffect(() => {
    setDestinations(getDestinations());
  }, []);

  const filteredAndSortedData = useMemo(() => {
    let rs = [...destinations];

    
    if (filterType !== 'All') {
      rs = rs.filter(d => d.type === filterType);
    }

    
    if (maxPrice !== null && maxPrice > 0) {
      rs = rs.filter(d => d.price <= maxPrice);
    }

    // Sort
    rs.sort((a, b) => {
      if (sortOrder === 'priceAsc') return a.price - b.price;
      if (sortOrder === 'priceDesc') return b.price - a.price;
      if (sortOrder === 'ratingDesc') return b.rating - a.rating;
      if (sortOrder === 'ratingAsc') return a.rating - b.rating;
      return 0;
    });

    return rs;
  }, [destinations, filterType, maxPrice, sortOrder]);

  return (
    <PageContainer title="Khám Phá Điểm Đến" subTitle="Tìm kiếm và chọn lọc những địa điểm du lịch tuyệt vời nhất cho bạn">
      <Card bordered={false} style={{ marginBottom: 24, borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={6}>
            <Text strong><FilterOutlined /> Loại hình:</Text>
            <Select
              style={{ width: '100%', marginTop: 8 }}
              value={filterType}
              onChange={setFilterType}
            >
              <Option value="All">Tất cả</Option>
              <Option value="Biển">Biển</Option>
              <Option value="Núi">Núi</Option>
              <Option value="Thành phố">Thành phố</Option>
              <Option value="Văn hóa">Văn hóa</Option>
            </Select>
          </Col>
          <Col xs={24} md={6}>
            <Text strong><DollarOutlined /> Mức giá tối đa (VND):</Text>
            <InputNumber
              style={{ width: '100%', marginTop: 8 }}
              min={0}
              step={500000}
              value={maxPrice}
              onChange={(val) => setMaxPrice(val as number)}
              placeholder="Nhập giá tối đa..."
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            />
          </Col>
          <Col xs={24} md={6}>
            <Text strong>Sắp xếp theo:</Text>
            <Select
              style={{ width: '100%', marginTop: 8 }}
              value={sortOrder}
              onChange={setSortOrder}
            >
              <Option value="ratingDesc">Đánh giá cao nhất</Option>
              <Option value="ratingAsc">Đánh giá thấp nhất</Option>
              <Option value="priceAsc">Giá thấp đến cao</Option>
              <Option value="priceDesc">Giá cao đến thấp</Option>
            </Select>
          </Col>
          <Col xs={24} md={6} style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
             <Button type="primary" onClick={() => { setFilterType('All'); setMaxPrice(null); setSortOrder('ratingDesc'); }} style={{marginTop: 30}}>
               Xóa bộ lọc
             </Button>
          </Col>
        </Row>
      </Card>

      {filteredAndSortedData.length === 0 ? (
        <Empty description="Không tìm thấy điểm đến phù hợp" />
      ) : (
        <Row gutter={[24, 24]}>
          {filteredAndSortedData.map(item => (
            <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
              <Card
                hoverable
                cover={
                  <div style={{ height: 200, overflow: 'hidden' }}>
                    <img 
                      alt={item.name} 
                      src={item.image} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }} 
                      onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
                      onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                    />
                  </div>
                }
                style={{ borderRadius: 12, overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}
                bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column' }}
              >
                <div style={{ flex: 1 }}>
                  <Title level={4} style={{ marginBottom: 4 }}>{item.name}</Title>
                  <Space style={{ marginBottom: 12 }}>
                    <Tag color="blue">{item.type}</Tag>
                    <Text type="secondary"><EnvironmentOutlined /> {item.location}</Text>
                  </Space>
                  <Paragraph ellipsis={{ rows: 2 }} type="secondary">
                    {item.description}
                  </Paragraph>
                </div>
                
                <div style={{ marginTop: 'auto', borderTop: '1px solid #f0f0f0', paddingTop: 12 }}>
                  <Row justify="space-between" align="middle">
                    <Col>
                      <Rate disabled defaultValue={item.rating} allowHalf style={{ fontSize: 14, color: '#fadb14' }} />
                      <Text style={{ marginLeft: 8 }}>{item.rating}</Text>
                    </Col>
                    <Col>
                      <Text strong style={{ color: '#ff4d4f', fontSize: 16 }}>
                        {item.price.toLocaleString('vi-VN')} đ
                      </Text>
                    </Col>
                  </Row>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </PageContainer>
  );
};

export default Discover;
