import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Workout {
  id: string;
  date: string;
  type: string;
  duration: number;
  calories: number;
  notes: string;
  status: 'Completed' | 'Missed';
}

export interface HealthMetric {
  id: string;
  date: string;
  weight: number;
  height: number;
  bmi: number;
  restingHeartRate: number;
  sleepHours: number;
}

export interface Goal {
  id: string;
  name: string;
  type: string;
  targetValue: number;
  currentValue: number;
  deadline: string;
  status: 'In Progress' | 'Achieved' | 'Cancelled';
}

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  difficulty: string;
  description: string;
  caloriesPerHour: number;
}

interface FitnessState {
  workouts: Workout[];
  healthMetrics: HealthMetric[];
  goals: Goal[];
  exercises: Exercise[];
}

const initialState: FitnessState = {
  workouts: [
    { id: '1', date: '2026-05-01', type: 'Cardio', duration: 45, calories: 400, notes: 'Morning run', status: 'Completed' },
    { id: '2', date: '2026-05-02', type: 'Strength', duration: 60, calories: 500, notes: 'Leg day', status: 'Completed' },
    { id: '3', date: '2026-05-03', type: 'Yoga', duration: 30, calories: 150, notes: 'Recovery', status: 'Completed' },
    { id: '4', date: '2026-05-04', type: 'HIIT', duration: 25, calories: 350, notes: 'Intense session', status: 'Missed' },
  ],
  healthMetrics: [
    { id: '1', date: '2026-05-01', weight: 70, height: 1.75, bmi: 22.86, restingHeartRate: 65, sleepHours: 7.5 },
    { id: '2', date: '2026-05-02', weight: 70.2, height: 1.75, bmi: 22.92, restingHeartRate: 62, sleepHours: 8 },
    { id: '3', date: '2026-05-03', weight: 69.8, height: 1.75, bmi: 22.79, restingHeartRate: 64, sleepHours: 6.5 },
  ],
  goals: [
    { id: '1', name: 'Lose 5kg', type: 'Giảm cân', targetValue: 65, currentValue: 69.8, deadline: '2026-08-01', status: 'In Progress' },
    { id: '2', name: 'Run 5km under 25m', type: 'Cải thiện sức bền', targetValue: 25, currentValue: 28, deadline: '2026-06-15', status: 'In Progress' },
    { id: '3', name: 'Squat 100kg', type: 'Tăng cơ', targetValue: 100, currentValue: 80, deadline: '2026-07-01', status: 'In Progress' },
  ],
  exercises: [
    { id: '1', name: 'Push Up', muscleGroup: 'Chest', difficulty: 'Dễ', description: 'Basic push up for chest and triceps', caloriesPerHour: 400 },
    { id: '2', name: 'Squat', muscleGroup: 'Legs', difficulty: 'Trung bình', description: 'Barbell squat', caloriesPerHour: 500 },
    { id: '3', name: 'Pull Up', muscleGroup: 'Back', difficulty: 'Khó', description: 'Overhand grip pull up', caloriesPerHour: 450 },
    { id: '4', name: 'Plank', muscleGroup: 'Core', difficulty: 'Trung bình', description: 'Hold position for core strength', caloriesPerHour: 300 },
    { id: '5', name: 'Burpee', muscleGroup: 'Full Body', difficulty: 'Khó', description: 'Full body conditioning', caloriesPerHour: 600 },
  ],
};

const fitnessSlice = createSlice({
  name: 'fitness',
  initialState,
  reducers: {
    // Workouts
    addWorkout(state, action: PayloadAction<Workout>) {
      state.workouts.push(action.payload);
    },
    updateWorkout(state, action: PayloadAction<Workout>) {
      const index = state.workouts.findIndex(w => w.id === action.payload.id);
      if (index !== -1) {
        state.workouts[index] = action.payload;
      }
    },
    deleteWorkout(state, action: PayloadAction<string>) {
      state.workouts = state.workouts.filter(w => w.id !== action.payload);
    },
    
    // Health Metrics
    addHealthMetric(state, action: PayloadAction<HealthMetric>) {
      state.healthMetrics.push(action.payload);
    },
    updateHealthMetric(state, action: PayloadAction<HealthMetric>) {
      const index = state.healthMetrics.findIndex(h => h.id === action.payload.id);
      if (index !== -1) {
        state.healthMetrics[index] = action.payload;
      }
    },
    deleteHealthMetric(state, action: PayloadAction<string>) {
      state.healthMetrics = state.healthMetrics.filter(h => h.id !== action.payload);
    },

    // Goals
    addGoal(state, action: PayloadAction<Goal>) {
      state.goals.push(action.payload);
    },
    updateGoal(state, action: PayloadAction<Goal>) {
      const index = state.goals.findIndex(g => g.id === action.payload.id);
      if (index !== -1) {
        state.goals[index] = action.payload;
      }
    },
    updateGoalValue(state, action: PayloadAction<{id: string, currentValue: number}>) {
      const index = state.goals.findIndex(g => g.id === action.payload.id);
      if (index !== -1) {
        state.goals[index].currentValue = action.payload.currentValue;
      }
    },
    deleteGoal(state, action: PayloadAction<string>) {
      state.goals = state.goals.filter(g => g.id !== action.payload);
    },

    // Exercises
    addExercise(state, action: PayloadAction<Exercise>) {
      state.exercises.push(action.payload);
    },
    updateExercise(state, action: PayloadAction<Exercise>) {
      const index = state.exercises.findIndex(e => e.id === action.payload.id);
      if (index !== -1) {
        state.exercises[index] = action.payload;
      }
    },
    deleteExercise(state, action: PayloadAction<string>) {
      state.exercises = state.exercises.filter(e => e.id !== action.payload);
    },
  },
});

export const {
  addWorkout, updateWorkout, deleteWorkout,
  addHealthMetric, updateHealthMetric, deleteHealthMetric,
  addGoal, updateGoal, updateGoalValue, deleteGoal,
  addExercise, updateExercise, deleteExercise
} = fitnessSlice.actions;

export default fitnessSlice.reducer;
