import React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { useTasks, Task, TaskStatus } from '../useTasks';
import { Typography, Card, Tag, Tooltip, Avatar } from 'antd';
import { ClockCircleOutlined, UserOutlined } from '@ant-design/icons';
import moment from 'moment';
import './index.less';

const { Title } = Typography;

const COLUMN_TYPES: { id: TaskStatus; title: string }[] = [
  { id: 'TODO', title: 'Cần làm' },
  { id: 'IN_PROGRESS', title: 'Đang làm' },
  { id: 'DONE', title: 'Hoàn thành' },
];

const priorityColorMap: Record<string, string> = {
  HIGH: 'red',
  MEDIUM: 'orange',
  LOW: 'green',
};

const KanbanBoard: React.FC = () => {
  const { tasks, reorderTask } = useTasks();

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const taskId = draggableId;
    const newStatus = destination.droppableId as TaskStatus;
    
    reorderTask(taskId, newStatus, destination.index);
  };

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter((t) => t.status === status);
  };

  return (
    <div className="todo-kanban">
      <div className="kanban-header">
        <Title level={2}>Kanban Board</Title>
        <p>Kéo thả công việc giữa các cột để cập nhật trạng thái</p>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="kanban-board">
          {COLUMN_TYPES.map((column) => {
            const columnTasks = getTasksByStatus(column.id);
            return (
              <div className="kanban-column" key={column.id}>
                <div className="column-header">
                  <h3>{column.title}</h3>
                  <span className="task-count">{columnTasks.length}</span>
                </div>
                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      className={`column-content ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      {columnTasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                ...provided.draggableProps.style,

                              }}
                            >
                              <Card 
                                className={`kanban-task-card ${snapshot.isDragging ? 'is-dragging' : ''}`} 
                                bordered={false}
                              >
                                <div className="task-labels">
                                    <Tag color={priorityColorMap[task.priority] || 'blue'}>
                                        {task.priority === 'HIGH' ? 'Cao' : task.priority === 'MEDIUM' ? 'Trung bình' : 'Thấp'}
                                    </Tag>
                                    {task.tag && <Tag color="cyan">{task.tag}</Tag>}
                                </div>
                                <h4 className="task-title">{task.name}</h4>
                                <div className="task-footer">
                                    <div className="task-deadline">
                                        <ClockCircleOutlined /> 
                                        <span>{moment(task.deadline).format('DD/MM/YYYY')}</span>
                                    </div>
                                    <Avatar size="small" icon={<UserOutlined />} />
                                </div>
                              </Card>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
};

export default KanbanBoard;
