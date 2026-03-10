import React, { useState } from 'react';
import { Button, Card, Table, Tag, Space, Statistic, Row, Col, Divider } from 'antd';

const OanTuTi = () => {
  const [history, setHistory] = useState<any[]>([]);
  
  // Thêm state để lưu tổng số lượt
  const [stats, setStats] = useState({ win: 0, draw: 0, loss: 0 });

  const choices = ['Kéo', 'Búa', 'Bao'] as const;

  const play = (user: typeof choices[number]) => {
    const bot = choices[Math.floor(Math.random() * 3)];
    let result: string;

    // Logic tính toán kết quả
    if (user === bot) {
      result = 'Hòa';
      setStats(prev => ({ ...prev, draw: prev.draw + 1 }));
    } else if (
      (user === 'Kéo' && bot === 'Bao') ||
      (user === 'Búa' && bot === 'Kéo') ||
      (user === 'Bao' && bot === 'Búa')
    ) {
      result = 'Thắng';
      setStats(prev => ({ ...prev, win: prev.win + 1 }));
    } else {
      result = 'Thua';
      setStats(prev => ({ ...prev, loss: prev.loss + 1 }));
    }

    setHistory([{ key: Date.now(), user, bot, result }, ...history]);
  };

  return (
    <Card title="Trò chơi Oẳn Tù Tì" style={{ maxWidth: 800, margin: '20px auto' }}>
      
      {/* Phần hiển thị thống kê số lượt */}
      <Row gutter={16} style={{ textAlign: 'center', marginBottom: 20 }}>
        <Col span={8}>
          <Statistic title="Thắng" value={stats.win} valueStyle={{ color: '#3f8600' }} />
        </Col>
        <Col span={8}>
          <Statistic title="Hòa" value={stats.draw} valueStyle={{ color: '#096dd9' }} />
        </Col>
        <Col span={8}>
          <Statistic title="Thua" value={stats.loss} valueStyle={{ color: '#cf1322' }} />
        </Col>
      </Row>

      <Divider>Chọn nước đi của bạn</Divider>

      <div style={{ textAlign: 'center', marginBottom: 30 }}>
        <Space size="large">
          {choices.map(c => (
            <Button 
              key={c} 
              type="primary" 
              size="large" 
              shape="round"
              onClick={() => play(c)}
            >
              {c}
            </Button>
          ))}
        </Space>
      </div>

      <Table 
        dataSource={history} 
        pagination={{ pageSize: 5 }}
        columns={[
          { title: 'Bạn', dataIndex: 'user', align: 'center' },
          { title: 'Máy', dataIndex: 'bot', align: 'center' },
          { 
            title: 'Kết quả', 
            dataIndex: 'result', 
            align: 'center',
            render: (res) => (
              <Tag color={res === 'Thắng' ? 'green' : res === 'Thua' ? 'red' : 'blue'}>
                {res.toUpperCase()}
              </Tag>
            ) 
          }
        ]} 
      />
      
      <div style={{ marginTop: 10, textAlign: 'right' }}>
        <Button danger onClick={() => {
          setHistory([]);
          setStats({ win: 0, draw: 0, loss: 0 });
        }}>
          Chơi lại từ đầu
        </Button>
      </div>
    </Card>
  );
};

export default OanTuTi;