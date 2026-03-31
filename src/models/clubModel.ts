import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Club {
  id: string;
  name: string;
  avatar: string;
  foundingDate: string;
  description: string;
  leader: string;
  isActive: boolean;
}

interface ClubState {
  clubs: Club[];// hoặc định nghĩa kiểu cụ thể cho members nếu cần
}

const initialState: ClubState = {
  clubs: [
    {
      id: '1',
      name: 'Câu lạc bộ Lập trình',
      avatar: 'https://via.placeholder.com/60',
      foundingDate: '2023-01-15',
      description: '<p>Câu lạc bộ dành cho các bạn đam mê lập trình.</p>',
      leader: 'Nguyễn Văn A',
      isActive: true,
    },
    
    {
      id: '2',
      name: 'Câu lạc bộ Thiết kế',
      avatar: 'https://via.placeholder.com/60',
      foundingDate: '2023-03-20',
      description: '<p>Câu lạc bộ dành cho các bạn yêu thiết kế.</p>',
      leader: 'Trần Thị B',
      isActive: true,
    },
  ],
};

export const clubSlice = createSlice({
  name: 'clubs',
  initialState,
  reducers: {
    saveClub: (state, action: PayloadAction<Club>) => {
      const index = state.clubs.findIndex(c => c.id === action.payload.id);
      if (index > -1) {
        state.clubs[index] = action.payload;
      } else {
        state.clubs.push(action.payload);
      }
    },
    deleteClub: (state, action: PayloadAction<string>) => {
      state.clubs = state.clubs.filter(c => c.id !== action.payload);
    },
  },
});

export const { saveClub, deleteClub } = clubSlice.actions;
export default clubSlice.reducer;