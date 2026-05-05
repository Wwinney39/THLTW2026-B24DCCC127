import React from 'react';
import { Row, Col, Card, Statistic, Typography } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, FileTextOutlined } from '@ant-design/icons';
import { useTasks } from '../useTasks';
import moment from 'moment';
import './index.less';

const { Title } = Typography;

const Dashboard: React.FC = () => {
  const { tasks } = useTasks();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'DONE').length;
  

  const overdueTasks = tasks.filter(t => {
    if (t.status === 'DONE') return false;
    return moment(t.deadline).isBefore(moment(), 'day');
  }).length;

  return (
    <div className="todo-dashboard">
      <div className="dashboard-header">
        <Title level={2}>Tổng quan công việc</Title>
        <p>Theo dõi tiến độ và hiệu suất làm việc của bạn</p>
      </div>

      <Row gutter={[24, 24]} className="statistics-row">
        <Col xs={24} sm={8}>
          <Card className="stat-card total-card" hoverable>
            <Statistic
              title="Tổng số Task"
              value={totalTasks}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="stat-card completed-card" hoverable>
            <Statistic
              title="Đã hoàn thành"
              value={completedTasks}
              prefix={<CheckCircleOutlined />}
              suffix={`/ ${totalTasks}`}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="stat-card overdue-card" hoverable>
            <Statistic
              title="Quá hạn"
              value={overdueTasks}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: overdueTasks > 0 ? '#cf1322' : '#3f8600' }}
            />
          </Card>
        </Col>
      </Row>

      <div className="dashboard-charts">
         {/* Add some empty states or decorative elements for aesthetics */}
         <Card className="glass-card">
            <div className="empty-chart-placeholder">
                <h3>Bạn đang làm rất tốt!</h3>
                <p>Hãy tiếp tục duy trì tiến độ hoàn thành công việc của mình nhé. Kéo thả các thẻ trên Kanban board để cập nhật tiến trình.</p>
            </div>
         </Card>
      </div>
    </div>
  );
};

export default Dashboard;
