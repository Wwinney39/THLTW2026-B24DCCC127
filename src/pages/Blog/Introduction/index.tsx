import React from 'react';
import { Card, Avatar, Typography, Row, Col, Space, Divider, Tag } from 'antd';
import { GithubOutlined, LinkedinOutlined, TwitterOutlined, MailOutlined, EnvironmentOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const Introduction: React.FC = () => {
  return (
    <div style={{ padding: 24, minHeight: '100vh', background: '#f0f2f5', display: 'flex', justifyContent: 'center' }}>
      <Card
        style={{ width: '100%', maxWidth: 800, borderRadius: 16, overflow: 'hidden' }}
        bodyStyle={{ padding: 0 }}
      >
        <div style={{ height: 200, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }} />

        <div style={{ padding: '0 32px 32px', textAlign: 'center', marginTop: -64 }}>
          <Avatar
            size={128}
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQVaO0lwnSvb7RpQ7uOtgmeq3SbGtRotZI0w&s"
            style={{ border: '4px solid white', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          />
          <Title level={2} style={{ marginTop: 16, marginBottom: 4 }}>Trần Editor</Title>
          <Text type="secondary" style={{ fontSize: 16 }}><EnvironmentOutlined /> Hà Nội, Việt Nam</Text>

          <Paragraph style={{ marginTop: 24, fontSize: 16, maxWidth: 600, margin: '24px auto', lineHeight: 1.8 }}>
            Xin chào! Tôi là một kỹ sư phần mềm đam mê xây dựng các sản phẩm tuyệt vời và mang lại giá trị cho người dùng.
            Blog này được tạo ra để chia sẻ kiến thức, kinh nghiệm, và những điều vặt vãnh tôi học được trên hành trình theo đuổi lĩnh vực công nghệ.
          </Paragraph>

          <Space size="large" style={{ marginTop: 16 }}>
            <a href="https://github.com" target="_blank" rel="noreferrer"><GithubOutlined style={{ fontSize: 24, color: '#333' }} /></a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer"><LinkedinOutlined style={{ fontSize: 24, color: '#0077b5' }} /></a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer"><TwitterOutlined style={{ fontSize: 24, color: '#1da1f2' }} /></a>
            <a href="mailto:hello@example.com"><MailOutlined style={{ fontSize: 24, color: '#d44638' }} /></a>
          </Space>

          <Divider dashed />

          <Row gutter={[32, 32]} style={{ textAlign: 'left', marginTop: 24 }}>
            <Col xs={24} md={12}>
              <Title level={4}>Kỹ năng cốt lõi</Title>
              <Space wrap>
                <Tag color="blue">React</Tag>
                <Tag color="cyan">TypeScript</Tag>
                <Tag color="purple">Redux</Tag>
                <Tag color="magenta">Ant Design</Tag>
                <Tag color="green">Node.js</Tag>
                <Tag color="orange">HTML5/CSS3</Tag>
                <Tag color="volcano">Git</Tag>
              </Space>
            </Col>
            <Col xs={24} md={12}>
              <Title level={4}>Sở thích & Đam mê</Title>
              <ul style={{ paddingLeft: 20, margin: 0, lineHeight: 1.8, color: '#595959' }}>
                <li>Viết code mở mã nguồn (Open Source)</li>
                <li>Nghiên cứu về UI/UX và thiết kế sản phẩm</li>
                <li>Đọc sách và viết blog chia sẻ kiến thức</li>
                <li>Chụp ảnh và du lịch</li>
              </ul>
            </Col>
          </Row>
        </div>
      </Card>
    </div>
  );
};

export default Introduction;
