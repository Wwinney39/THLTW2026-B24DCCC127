import React from 'react';
import { Card, Col, Row, Statistic, Timeline, Typography } from 'antd';
import { FireOutlined, CalendarOutlined, TrophyOutlined, SyncOutlined } from '@ant-design/icons';
import { Column, Line } from '@ant-design/plots';
import { useSelector } from 'react-redux';
import { RootState } from '@/models/store';
import moment from 'moment';

const { Title, Text } = Typography;

const Dashboard: React.FC = () => {
  const { workouts, healthMetrics, goals } = useSelector((state: RootState) => state.fitnessState);

  const currentMonth = moment().format('YYYY-MM');
  const thisMonthWorkouts = workouts.filter(w => w.date.startsWith(currentMonth));
  
  const totalWorkouts = thisMonthWorkouts.length;
  const totalCalories = thisMonthWorkouts.reduce((sum, w) => sum + w.calories, 0);
  
  let streak = 0;
  const today = moment().format('YYYY-MM-DD');
  const yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD');
  if (workouts.some(w => w.date === today && w.status === 'Completed')) streak += 1;
  if (workouts.some(w => w.date === yesterday && w.status === 'Completed')) streak += 1;

  const completedGoals = goals.filter(g => g.status === 'Achieved').length;
  const goalProgress = goals.length > 0 ? Math.round((completedGoals / goals.length) * 100) : 0;

  const columnData = [
    { week: 'Tuần 1', workouts: 3 },
    { week: 'Tuần 2', workouts: 4 },
    { week: 'Tuần 3', workouts: 2 },
    { week: 'Tuần 4', workouts: totalWorkouts > 9 ? totalWorkouts - 9 : 0 },
  ];

  const columnConfig = {
    data: columnData,
    xField: 'week',
    yField: 'workouts',
    color: '#1890ff',
    label: {
      position: 'middle' as const,
      style: { fill: '#FFFFFF', opacity: 0.6 },
    },
    meta: {
      week: { alias: 'Tuần' },
      workouts: { alias: 'Số buổi tập' },
    },
  };

  const lineData = healthMetrics.map(h => ({
    date: h.date,
    weight: h.weight,
  })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const lineConfig = {
    data: lineData,
    xField: 'date',
    yField: 'weight',
    point: { size: 5, shape: 'diamond' },
    label: {
      style: { fill: '#aaa' },
    },
  };

  const recentWorkouts = [...workouts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div style={{ padding: '24px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <Title level={2} style={{ marginBottom: '24px' }}>Tổng quan Sức khỏe</Title>
      
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <Statistic 
              title="Buổi tập tháng này" 
              value={totalWorkouts} 
              prefix={<CalendarOutlined style={{ color: '#1890ff' }} />} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <Statistic 
              title="Tổng Calo đã đốt" 
              value={totalCalories} 
              prefix={<FireOutlined style={{ color: '#fa8c16' }} />} 
              suffix="kcal"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <Statistic 
              title="Streak (Ngày liên tiếp)" 
              value={streak} 
              prefix={<SyncOutlined style={{ color: '#52c41a' }} />} 
              suffix="ngày"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <Statistic 
              title="Mục tiêu hoàn thành" 
              value={goalProgress} 
              prefix={<TrophyOutlined style={{ color: '#eb2f96' }} />} 
              suffix="%"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title="Hoạt động trong tháng" bordered={false} style={{ marginBottom: '16px', borderRadius: '8px' }}>
            <Column {...columnConfig} height={250} />
          </Card>
          
          <Card title="Biến động cân nặng" bordered={false} style={{ borderRadius: '8px' }}>
            <Line {...lineConfig} height={250} />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Hoạt động gần đây" bordered={false} style={{ borderRadius: '8px', height: '100%' }}>
            <Timeline>
              {recentWorkouts.map(w => (
                <Timeline.Item 
                  key={w.id} 
                  color={w.status === 'Completed' ? 'green' : 'red'}
                >
                  <div style={{ marginBottom: '4px' }}>
                    <Text strong>{w.type}</Text> - <Text type="secondary">{moment(w.date).format('DD/MM/YYYY')}</Text>
                  </div>
                  <div>
                    {w.duration} phút • {w.calories} kcal
                  </div>
                  {w.notes && <div style={{ fontSize: '12px', color: '#888' }}>{w.notes}</div>}
                </Timeline.Item>
              ))}
              {recentWorkouts.length === 0 && (
                <Timeline.Item>Chưa có hoạt động nào</Timeline.Item>
              )}
            </Timeline>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
