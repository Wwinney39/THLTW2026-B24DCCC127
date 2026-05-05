import { useState, useEffect } from 'react';
import { message } from 'antd';

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
export type TaskPriority = 'HIGH' | 'MEDIUM' | 'LOW';

export interface Task {
  id: string;
  name: string;
  description: string;
  deadline: string;
  priority: TaskPriority;
  status: TaskStatus;
  tag: string;
  createdAt: string;
}

const STORAGE_KEY = 'PERSONAL_TASK_TRACKER_DATA';

const DEFAULT_TASKS: Task[] = [
  {
    id: '1',
    name: 'Thiết kế giao diện Dashboard',
    description: 'Thiết kế UI/UX cho trang tổng quan bằng Figma',
    deadline: new Date(Date.now() + 86400000).toISOString(),
    priority: 'HIGH',
    status: 'TODO',
    tag: 'UI/UX',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Tích hợp react-beautiful-dnd',
    description: 'Xử lý kéo thả task giữa các cột mượt mà',
    deadline: new Date(Date.now() + 172800000).toISOString(),
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    tag: 'Frontend',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Sửa lỗi CSS trên Mobile',
    description: 'Kiểm tra và responsive cho màn hình điện thoại',
    deadline: new Date(Date.now() - 86400000).toISOString(),
    priority: 'MEDIUM',
    status: 'TODO',
    tag: 'Bug',
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Viết tài liệu hướng dẫn sử dụng',
    description: 'Viết file markdown giải thích các tính năng',
    deadline: new Date(Date.now() - 172800000).toISOString(),
    priority: 'LOW',
    status: 'DONE',
    tag: 'Document',
    createdAt: new Date().toISOString(),
  }
];

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      const hasLoadedDefaults = localStorage.getItem(STORAGE_KEY + '_INIT');
      
      let initialTasks: Task[] = [];
      if (data && data !== '[]') {
        initialTasks = JSON.parse(data);
      }

      // If we haven't merged the default data yet, merge it now
      if (!hasLoadedDefaults) {
        // Filter out any defaults that might accidentally have same IDs (unlikely but safe)
        const existingIds = new Set(initialTasks.map(t => t.id));
        const defaultsToAdd = DEFAULT_TASKS.filter(t => !existingIds.has(t.id));
        
        initialTasks = [...defaultsToAdd, ...initialTasks];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialTasks));
        localStorage.setItem(STORAGE_KEY + '_INIT', 'true');
      }
      
      return initialTasks;
    } catch (e) {
      console.error('Failed to parse tasks from local storage', e);
      return DEFAULT_TASKS;
    }
  });

  useEffect(() => {
    const loadTasksFromEvent = () => {
      try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (data) setTasks(JSON.parse(data));
      } catch (e) {
        // Ignore
      }
    };
    
    window.addEventListener('storage', loadTasksFromEvent);
    
    const handleLocalUpdate = () => loadTasksFromEvent();
    window.addEventListener('tasks_updated', handleLocalUpdate);

    return () => {
      window.removeEventListener('storage', loadTasksFromEvent);
      window.removeEventListener('tasks_updated', handleLocalUpdate);
    };
  }, []);

  const saveTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newTasks));

    window.dispatchEvent(new Event('tasks_updated'));
  };

  const addTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    saveTasks([...tasks, newTask]);
    message.success('Thêm công việc thành công!');
  };

  const updateTask = (id: string, updatedFields: Partial<Task>) => {
    const newTasks = tasks.map(t => (t.id === id ? { ...t, ...updatedFields } : t));
    saveTasks(newTasks);
    message.success('Cập nhật công việc thành công!');
  };

  const updateTaskStatus = (id: string, status: TaskStatus) => {
    const newTasks = tasks.map(t => (t.id === id ? { ...t, status } : t));
    saveTasks(newTasks);
  };

  const reorderTask = (
    taskId: string,
    destinationStatus: TaskStatus,
    destinationIndex: number
  ) => {
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return;

    const task = { ...tasks[taskIndex], status: destinationStatus };
    const newTasks = [...tasks];
    newTasks.splice(taskIndex, 1);

    const destColumnTasks = newTasks.filter(t => t.status === destinationStatus);

    if (destinationIndex >= destColumnTasks.length) {
      newTasks.push(task);
    } else {
      const destTask = destColumnTasks[destinationIndex];
      const destMainIndex = newTasks.findIndex(t => t.id === destTask.id);
      newTasks.splice(destMainIndex, 0, task);
    }

    saveTasks(newTasks);
  };

  const deleteTask = (id: string) => {
    const newTasks = tasks.filter(t => t.id !== id);
    saveTasks(newTasks);
    message.success('Xóa công việc thành công!');
  };
  
  const clearAllTasks = () => {
    saveTasks([]);
    message.success('Đã xóa toàn bộ dữ liệu!');
  }

  const importTasks = (importedTasks: Task[]) => {
      saveTasks(importedTasks);
      message.success('Đã nhập dữ liệu thành công!');
  }

  return {
    tasks,
    addTask,
    updateTask,
    updateTaskStatus,
    reorderTask,
    deleteTask,
    clearAllTasks,
    importTasks,
  };
};
