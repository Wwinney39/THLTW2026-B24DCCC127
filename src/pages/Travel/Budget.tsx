import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Row, Col, Typography, Alert, Divider, InputNumber, Button, message, Statistic } from 'antd';
import { Pie } from '@ant-design/plots';
import { getDestinations, getItinerary, saveItinerary } from '@/models/datatravel';
import { Destination, Itinerary } from '@/models/datatravel';

const { Title, Text } = Typography;

const Budget: React.FC = () => {
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [newBudgetLimit, setNewBudgetLimit] = useState<number>(0);

  useEffect(() => {
    const fetchedItinerary = getItinerary();
    setItinerary(fetchedItinerary);
    setDestinations(getDestinations());
    setNewBudgetLimit(fetchedItinerary.budgetLimit);
  }, []);

  if (!itinerary) return null;

  // Calculate detailed costs
  let totalFood = 0;
  let totalAccommodation = 0;
  let totalTravel = 0;
  let totalOther = 0; // The difference between total price and components

  itinerary.days.forEach(day => {
    day.destinationIds.forEach(id => {
      const dest = destinations.find(d => d.id === id);
      if (dest) {
        totalFood += dest.costFood;
        totalAccommodation += dest.costAccommodation;
        totalTravel += dest.costTravel;
        // Remaining cost is 'Other'
        const other = dest.price - (dest.costFood + dest.costAccommodation + dest.costTravel);
        totalOther += other > 0 ? other : 0;
      }
    });
  });

  const totalCost = totalFood + totalAccommodation + totalTravel + totalOther;
  const isOverBudget = totalCost > itinerary.budgetLimit;

  // Data for the Pie Chart
  const pieData = [
    { type: 'Ăn uống', value: totalFood },
    { type: 'Lưu trú', value: totalAccommodation },
    { type: 'Di chuyển', value: totalTravel },
    { type: 'Khác', value: totalOther },
  ].filter(item => item.value > 0);

  const config = {
    appendPadding: 10,
    data: pieData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.9,
    innerRadius: 0.6,
    label: {
      type: 'inner',
      offset: '-50%',
      content: '{value}',
      style: {
        textAlign: 'center',
        fontSize: 14,
      },
    },
    interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
    statistic: {
      title: false,
      content: {
        style: {
          whiteSpace: 'pre-wrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          fontSize: '24px',
        },
        content: `Tổng\n${totalCost.toLocaleString()} đ`,
      },
    },
  };

  const handleUpdateBudget = () => {
    const updated = { ...itinerary, budgetLimit: newBudgetLimit };
    setItinerary(updated);
    saveItinerary(updated);
    message.success('Cập nhật hạn mức dự toán thành công!');
  };

  return (
    <PageContainer title="Quản Lý Ngân Sách" subTitle={`Chuyến đi: ${itinerary.name}`}>
      <Row gutter={[24, 24]}>
        <Col xs={24}>
          {isOverBudget ? (
            <Alert
              message="Cảnh báo vượt hạn mức ngân sách!"
              description={`Tổng dự toán đang vượt quá ngân sách bạn đề ra là ${(totalCost - itinerary.budgetLimit).toLocaleString()} đ. Vui lòng điều chỉnh lại lịch trình hoặc tăng ngân sách.`}
              type="error"
              showIcon
              style={{ marginBottom: 24 }}
            />
          ) : (
            <Alert
              message="Tuyệt vời!"
              description={`Dự toán hiện tại đang nằm trong phạm vi ngân sách. Bạn còn dư ${(itinerary.budgetLimit - totalCost).toLocaleString()} đ.`}
              type="success"
              showIcon
              style={{ marginBottom: 24 }}
            />
          )}
        </Col>

        <Col xs={24} md={8}>
          <Card title="Chỉ số tổng quan" style={{ borderRadius: 8, height: '100%' }}>
             <div style={{ marginBottom: 24 }}>
                <Text type="secondary">Hạn mức ngân sách</Text>
                <div style={{ display: 'flex', alignItems: 'center', marginTop: 8 }}>
                  <InputNumber 
                    value={newBudgetLimit} 
                    onChange={(val) => setNewBudgetLimit(val || 0)} 
                    style={{ width: '100%', marginRight: 8 }}
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    step={1000000}
                  />
                  <Button type="primary" onClick={handleUpdateBudget}>Lưu</Button>
                </div>
             </div>
             
             <Divider />

             <Row gutter={16}>
               <Col span={12}>
                 <Statistic title="Tổng chi phí" value={totalCost} suffix="đ" valueStyle={{ color: isOverBudget ? '#cf1322' : '#3f8600' }} />
               </Col>
               <Col span={12}>
                 <Statistic title="Sự chênh lệch" value={Math.abs(itinerary.budgetLimit - totalCost)} suffix="đ" valueStyle={{ color: isOverBudget ? '#cf1322' : '#3f8600' }} prefix={isOverBudget ? '-' : '+'} />
               </Col>
             </Row>
          </Card>
        </Col>

        <Col xs={24} md={16}>
          <Card title="Phân bổ chi phí" style={{ borderRadius: 8, height: '100%' }}>
            {totalCost === 0 ? (
              <div style={{ padding: '40px 0', textAlign: 'center', color: '#999' }}>
                Chưa có dữ liệu. Vui lòng thêm điểm đến vào lịch trình.
              </div>
            ) : (
              <div style={{ height: 350 }}>
                {/* @ts-ignore - The types from @ant-design/plots might have a slight mismatch in project */}
                <Pie {...config} />
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default Budget;
