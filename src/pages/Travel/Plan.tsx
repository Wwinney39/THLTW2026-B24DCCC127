import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Button, Typography, Row, Col, Drawer, List, Tag, message, Divider, DatePicker, Tooltip } from 'antd';
import locale from 'antd/es/date-picker/locale/vi_VN';
import { PlusOutlined, DeleteOutlined, ClockCircleOutlined, DragOutlined } from '@ant-design/icons';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { getDestinations, getItinerary, saveItinerary } from '@/models/datatravel';
import { Destination, Itinerary } from '@/models/datatravel';
import moment from 'moment';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const Plan: React.FC = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);

  useEffect(() => {
    setDestinations(getDestinations());
    setItinerary(getItinerary());
  }, []);

  const handleAddDestination = (destId: string) => {
    if (!itinerary || selectedDayIndex === null) return;

    const newItinerary = { ...itinerary };
    newItinerary.days[selectedDayIndex].destinationIds.push(destId);

    setItinerary(newItinerary);
    saveItinerary(newItinerary);
    message.success('Đã thêm điểm đến vào lịch trình!');
    setIsDrawerVisible(false);
  };

  const handleRemoveDestination = (dayIndex: number, destIndex: number) => {
    if (!itinerary) return;

    const newItinerary = { ...itinerary };
    newItinerary.days[dayIndex].destinationIds.splice(destIndex, 1);

    setItinerary(newItinerary);
    saveItinerary(newItinerary);
    message.success('Đã xóa điểm đến khỏi lịch trình!');
  };

  const handleAddDay = () => {
    if (!itinerary) return;

    const newItinerary = { ...itinerary };
    const lastDay = newItinerary.days[newItinerary.days.length - 1];
    const nextDate = lastDay ? moment(lastDay.date).add(1, 'day').startOf('day') : moment(itinerary.startDate).startOf('day');

    newItinerary.days.push({
      date: nextDate.toISOString(),
      destinationIds: []
    });
    newItinerary.endDate = nextDate.toISOString();

    setItinerary(newItinerary);
    saveItinerary(newItinerary);
  };

  const handleRemoveDay = (dayIndex: number) => {
    if (!itinerary) return;

    const newItinerary = { ...itinerary };
    newItinerary.days.splice(dayIndex, 1);

    if (newItinerary.days.length === 0) {
      const today = new Date().toISOString();
      newItinerary.days.push({ date: today, destinationIds: [] });
      newItinerary.startDate = today;
      newItinerary.endDate = today;
    } else {
      const lastDay = newItinerary.days[newItinerary.days.length - 1];
      newItinerary.endDate = lastDay.date;
      if (dayIndex === 0) {
        newItinerary.startDate = newItinerary.days[0].date;
      }
    }

    setItinerary(newItinerary);
    saveItinerary(newItinerary);
    message.success('Đã xóa ngày khỏi lịch trình!');
  };

  const handleChangeDateRange = (dates: [moment.Moment | null, moment.Moment | null] | null) => {
    if (!itinerary || !dates) return;
    const [start, end] = dates;
    if (!start || !end) return;

    const totalDays = end.startOf('day').diff(start.startOf('day'), 'days') + 1;
    const adjustedDays = Array.from({ length: totalDays }, (_, index) => ({
      date: start.clone().add(index, 'days').toISOString(),
      destinationIds: itinerary.days[index]?.destinationIds || [],
    }));

    const updatedItinerary = {
      ...itinerary,
      startDate: start.startOf('day').toISOString(),
      endDate: end.startOf('day').toISOString(),
      days: adjustedDays,
    };

    setItinerary(updatedItinerary);
    saveItinerary(updatedItinerary);
    message.success('Đã cập nhật ngày bắt đầu và kết thúc cho lịch trình');
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination || !itinerary) return;

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    const sourceDayIndex = parseInt(source.droppableId.split('-')[1]);
    const destDayIndex = parseInt(destination.droppableId.split('-')[1]);

    const newItinerary = { ...itinerary };
    const sourceDestId = newItinerary.days[sourceDayIndex].destinationIds[source.index];

    // Remove from source
    newItinerary.days[sourceDayIndex].destinationIds.splice(source.index, 1);

    // Add to destination
    newItinerary.days[destDayIndex].destinationIds.splice(destination.index, 0, sourceDestId);

    setItinerary(newItinerary);
    saveItinerary(newItinerary);
  };

  const getDestinationObj = (id: string) => destinations.find(d => d.id === id);

  const calculateTotals = () => {
    if (!itinerary) return { cost: 0, time: 0, food: 0, accommodation: 0, travel: 0, tripDays: 0 };
    let totalCost = 0;
    let totalTime = 0;
    let totalFood = 0;
    let totalAccommodation = 0;
    let totalTravel = 0;

    itinerary.days.forEach(day => {
      day.destinationIds.forEach(id => {
        const dest = getDestinationObj(id);
        if (dest) {
          totalCost += dest.price;
          totalTime += dest.visitTime;
          totalFood += dest.costFood;
          totalAccommodation += dest.costAccommodation;
          totalTravel += dest.costTravel;
        }
      });
    });

    const tripDays = itinerary.days.length;

    return { cost: totalCost, time: totalTime, food: totalFood, accommodation: totalAccommodation, travel: totalTravel, tripDays };
  };

  if (!itinerary) return null;

  const totals = calculateTotals();
  const isOverBudget = totals.cost > itinerary.budgetLimit;

  return (
    <PageContainer title={`Lịch trình: ${itinerary.name}`} subTitle={`${new Date(itinerary.startDate).toLocaleDateString()} - ${new Date(itinerary.endDate).toLocaleDateString()}`}>
      <Row gutter={24} style={{ marginBottom: 24 }}>
        <Col xs={24}>
          <Card size="small" style={{ borderRadius: 8 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <Text strong>Khoảng thời gian chuyến đi</Text>
              <RangePicker
                locale={locale}
                value={[moment(itinerary.startDate), moment(itinerary.endDate)]}
                onChange={handleChangeDateRange}
                format="DD/MM/YYYY"
              />
            </div>
          </Card>
        </Col>
      </Row>
      <Row gutter={24} style={{ alignItems: 'stretch' }}>
        <Col xs={24} lg={16}>
          <DragDropContext onDragEnd={onDragEnd}>
            <Card
              title="Các điểm đến du lịch"
              style={{ marginBottom: 16, borderRadius: 8 }}
              extra={
                <Button
                  type="dashed"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    setSelectedDayIndex(itinerary.days.length - 1);
                    setIsDrawerVisible(true);
                  }}
                >
                  Thêm điểm đến
                </Button>
              }
            >
              {itinerary.days.map((day, dayIndex) => (
                <div key={dayIndex} style={{ marginBottom: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <Text strong>Ngày {dayIndex + 1} • {moment(day.date).format('DD/MM/YYYY')}</Text>
                    <div>
                      <Button type="link" onClick={() => {
                        setSelectedDayIndex(dayIndex);
                        setIsDrawerVisible(true);
                      }}>
                        Thêm điểm đến
                      </Button>
                      <Button type="text" danger onClick={() => handleRemoveDay(dayIndex)}>
                        Xóa ngày
                      </Button>
                    </div>
                  </div>

                  <Droppable droppableId={`day-${dayIndex}`}>
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={{
                          minHeight: 100,
                          background: snapshot.isDraggingOver ? '#f0f5ff' : 'transparent',
                          padding: 8,
                          borderRadius: 4
                        }}
                      >
                        {day.destinationIds.length === 0 && (
                          <div style={{ textAlign: 'center', color: '#bfbfbf', padding: '20px 0' }}>
                            Chưa có điểm đến nào. Hãy thêm điểm đến!
                          </div>
                        )}

                        {day.destinationIds.map((destId, index) => {
                          const dest = getDestinationObj(destId);
                          if (!dest) return null;

                          return (
                            <Draggable key={`${dayIndex}-${destId}-${index}`} draggableId={`${dayIndex}-${destId}-${index}`} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={{
                                    userSelect: 'none',
                                    padding: 16,
                                    margin: '0 0 8px 0',
                                    backgroundColor: snapshot.isDragging ? '#e6f7ff' : '#fafafa',
                                    border: '1px solid #e8e8e8',
                                    borderRadius: 4,
                                    display: 'flex',
                                    alignItems: 'center',
                                    ...provided.draggableProps.style,
                                  }}
                                >
                                  <DragOutlined style={{ marginRight: 16, color: '#bfbfbf', cursor: 'grab' }} />
                                  <img src={dest.image} alt={dest.name} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4, marginRight: 16 }} />
                                  <div style={{ flex: 1 }}>
                                    <Text strong>{dest.name}</Text>
                                    <div style={{ marginTop: 4 }}>
                                      <Tag color="blue">{dest.type}</Tag>
                                      <Text type="secondary" style={{ fontSize: 12 }}><ClockCircleOutlined /> {dest.visitTime} giờ</Text>
                                    </div>
                                  </div>
                                  <div style={{ textAlign: 'right', marginRight: 16 }}>
                                    <Tooltip
                                      title={
                                        <div>
                                          <div>Chi tiết chi phí:</div>
                                          <div>Ăn uống: {dest.costFood.toLocaleString()} đ</div>
                                          <div>Lưu trú: {dest.costAccommodation.toLocaleString()} đ</div>
                                          <div>Di chuyển: {dest.costTravel.toLocaleString()} đ</div>
                                        </div>
                                      }
                                    >
                                      <Text strong style={{ color: '#ff4d4f', cursor: 'pointer' }}>{dest.price.toLocaleString()} đ</Text>
                                    </Tooltip>
                                  </div>
                                  <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleRemoveDestination(dayIndex, index)} />
                                </div>
                              )}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              ))}
            </Card>
          </DragDropContext>

          <Button
            type="dashed"
            block
            icon={<PlusOutlined />}
            onClick={handleAddDay}
            style={{ height: 48, borderRadius: 8, marginBottom: 24 }}
          >
            Thêm ngày mới
          </Button>
        </Col>

        <Col xs={24} lg={8} style={{ display: 'flex', flexDirection: 'column' }}>
          <Card title="Tổng kết chuyến đi" style={{ borderRadius: 8, width: '100%', flex: 1 }}>
            <div style={{ marginBottom: 16 }}>
              <Text type="secondary">Ngân sách dự kiến</Text>
              <Title level={4} style={{ marginTop: 4, color: '#52c41a' }}>
                {itinerary.budgetLimit.toLocaleString()} đ
              </Title>
            </div>

            <Divider />

            <div style={{ marginBottom: 16 }}>
              <Text type="secondary">Chi tiết chi phí</Text>
              <div style={{ marginTop: 8, fontSize: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Text type="secondary">Ăn uống:</Text>
                  <Text>{totals.food.toLocaleString()} đ</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Text type="secondary">Lưu trú:</Text>
                  <Text>{totals.accommodation.toLocaleString()} đ</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Text type="secondary">Di chuyển:</Text>
                  <Text>{totals.travel.toLocaleString()} đ</Text>
                </div>
              </div>
            </div>

            <Divider />

            <div style={{ marginBottom: 16 }}>
              <Text type="secondary">Tổng chi phí ước tính</Text>
              <Title level={4} style={{ marginTop: 4, color: isOverBudget ? '#f5222d' : '#1890ff' }}>
                {totals.cost.toLocaleString()} đ
              </Title>
              {isOverBudget && (
                <Text type="danger" style={{ fontSize: 12 }}>
                  Cảnh báo: Bạn đã vượt quá ngân sách {(totals.cost - itinerary.budgetLimit).toLocaleString()} đ
                </Text>
              )}
            </div>

            <Divider />

            <div style={{ marginBottom: 16 }}>
              <Text type="secondary">Tổng thời gian chuyến đi</Text>
              <Title level={4} style={{ marginTop: 4 }}>
                {totals.tripDays} ngày
              </Title>
            </div>

            <div style={{ marginBottom: 16 }}>
              <Text type="secondary">Tổng thời gian tham quan</Text>
              <Title level={4} style={{ marginTop: 4 }}>
                {totals.time} giờ
              </Title>
            </div>

            <Button type="primary" block size="large" style={{ marginTop: 16 }}>
              Lưu & Xuất lịch trình
            </Button>
          </Card>
        </Col>
      </Row>

      <Drawer
        title="Chọn điểm đến"
        placement="right"
        width={400}
        onClose={() => setIsDrawerVisible(false)}
        visible={isDrawerVisible}
      >
        <List
          itemLayout="horizontal"
          dataSource={destinations}
          renderItem={item => (
            <List.Item
              actions={[<Button type="link" onClick={() => handleAddDestination(item.id)}>Thêm</Button>]}
            >
              <List.Item.Meta
                avatar={<img src={item.image} alt={item.name} style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 4 }} />}
                title={item.name}
                description={
                  <div>
                    <Text type="secondary" style={{ fontSize: 12 }}>{item.location}</Text>
                    <br />
                    <Text strong style={{ color: '#ff4d4f', fontSize: 12 }}>{item.price.toLocaleString()} đ</Text>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Drawer>
    </PageContainer>
  );
};

export default Plan;
