import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Post {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string; // Markdown string
  thumbnail: string;
  author: string;
  createdAt: string;
  tags: string[];
  views: number;
  status: 'draft' | 'published';
}

export interface Tag {
  id: string;
  name: string;
  postCount: number;
}

interface BlogState {
  posts: Post[];
  tags: Tag[];
}

const initialPosts: Post[] = Array.from({ length: 15 }).map((_, i) => ({
  id: `${i + 1}`,
  title: `Bài viết lập trình nâng cao phần ${i + 1}`,
  slug: `bai-viet-lap-trinh-nang-cao-phan-${i + 1}`,
  summary: `Tóm tắt nội dung cực chất lượng cho bài viết số ${i + 1}. Chia sẻ kiến thức bổ ích để mọi người dễ dàng xây dựng trang web của riêng mình tuyệt đẹp.`,
  content: `## Xin chào!\n\nĐây là nội dung **bài viết số ${i + 1}**.\n\nHôm nay chúng ta sẽ tìm hiểu về:\n- React\n- Typescript\n- Ant Design\n\n### Mã nguồn ví dụ:\n\`\`\`javascript\nconsole.log("Hello, World!");\n\`\`\`\n\nCảm ơn các bạn đã đọc.`,
  thumbnail: `https://picsum.photos/seed/${i + 10}/400/250`,
  author: i % 2 === 0 ? 'Admin Nguyễn' : 'Trần Editor',
  createdAt: `2026-04-${(i + 1).toString().padStart(2, '0')}`,
  tags: i % 2 === 0 ? ['React', 'Frontend'] : ['Typescript', 'Backend'],
  views: i * 15 + 10,
  status: i < 2 ? 'draft' : 'published',
}));

const initialTags: Tag[] = [
  { id: '1', name: 'React', postCount: initialPosts.filter(p => p.tags.includes('React')).length },
  { id: '2', name: 'Frontend', postCount: initialPosts.filter(p => p.tags.includes('Frontend')).length },
  { id: '3', name: 'Typescript', postCount: initialPosts.filter(p => p.tags.includes('Typescript')).length },
  { id: '4', name: 'Backend', postCount: initialPosts.filter(p => p.tags.includes('Backend')).length },
];

const initialState: BlogState = {
  posts: initialPosts,
  tags: initialTags,
};

export const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    addPost: (state, action: PayloadAction<Post>) => {
      state.posts.push(action.payload);
      // update tags count
      action.payload.tags.forEach(tag => {
        const t = state.tags.find(x => x.name === tag);
        if (t) t.postCount += 1;
      });
    },
    updatePost: (state, action: PayloadAction<Post>) => {
      const index = state.posts.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.posts[index] = action.payload;
      }
    },
    deletePost: (state, action: PayloadAction<string>) => {
      const post = state.posts.find(p => p.id === action.payload);
      if (post) {
        post.tags.forEach(tag => {
          const t = state.tags.find(x => x.name === tag);
          if (t && t.postCount > 0) t.postCount -= 1;
        });
      }
      state.posts = state.posts.filter(p => p.id !== action.payload);
    },
    incrementView: (state, action: PayloadAction<string>) => {
      const post = state.posts.find(p => p.id === action.payload);
      if (post) {
        post.views += 1;
      }
    },
    addTag: (state, action: PayloadAction<Tag>) => {
      state.tags.push(action.payload);
    },
    updateTag: (state, action: PayloadAction<Tag>) => {
      const index = state.tags.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.tags[index] = action.payload;
      }
    },
    deleteTag: (state, action: PayloadAction<string>) => {
      state.tags = state.tags.filter(t => t.id !== action.payload);
    },
  },
});

export const { addPost, updatePost, deletePost, incrementView, addTag, updateTag, deleteTag } = blogSlice.actions;

export default blogSlice.reducer;