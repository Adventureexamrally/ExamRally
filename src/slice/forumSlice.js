import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Api from "../service/Api"; // Assuming Api is aliased or accessible from this path, need to check where it sits

// Async Thunks
export const fetchForumStats = createAsyncThunk("forum/fetchStats", async (_, { rejectWithValue }) => {
    try {
        const response = await Api.get("/forum/stats");
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const fetchCategories = createAsyncThunk("forum/fetchCategories", async (_, { rejectWithValue }) => {
    try {
        const response = await Api.get("/forum/categories");
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const fetchThreadsByCategory = createAsyncThunk("forum/fetchThreadsByCategory", async (categoryId, { rejectWithValue }) => {
    try {
        const response = await Api.get(`/forum/categories/${categoryId}/threads`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const fetchThreadDetails = createAsyncThunk("forum/fetchThreadDetails", async (threadId, { rejectWithValue }) => {
    try {
        const response = await Api.get(`/forum/threads/${threadId}`);
        return response.data; // { thread, posts }
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const createThread = createAsyncThunk("forum/createThread", async (formData, { rejectWithValue }) => {
    try {
        const response = await Api.post("/forum/threads", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const likeThread = createAsyncThunk("forum/likeThread", async ({ threadId, userId }, { rejectWithValue }) => {
    try {
        const response = await Api.patch(`/forum/threads/${threadId}/like`);
        return { threadId, isLiked: response.data.isLiked, likesCount: response.data.likesCount, userId };
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const updateThread = createAsyncThunk("forum/updateThread", async ({ threadId, formData }, { rejectWithValue }) => {
    try {
        const response = await Api.put(`/forum/threads/${threadId}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const deleteThread = createAsyncThunk("forum/deleteThread", async (threadId, { rejectWithValue }) => {
    try {
        await Api.delete(`/forum/threads/${threadId}`);
        return threadId;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const createPost = createAsyncThunk("forum/createPost", async ({ threadId, formData }, { rejectWithValue }) => {
    try {
        const response = await Api.post(`/forum/threads/${threadId}/posts`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const likePost = createAsyncThunk("forum/likePost", async ({ postId, userId }, { rejectWithValue }) => {
    try {
        const response = await Api.patch(`/forum/posts/${postId}/like`);
        return { postId, isLiked: response.data.isLiked, likesCount: response.data.likesCount, userId };
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const deletePost = createAsyncThunk("forum/deletePost", async (postId, { rejectWithValue }) => {
    try {
        await Api.delete(`/forum/posts/${postId}`);
        return postId;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const updatePost = createAsyncThunk("forum/updatePost", async ({ postId, formData }, { rejectWithValue }) => {
    try {
        const response = await Api.put(`/forum/posts/${postId}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

// Initial State
const initialState = {
    stats: {
        totalThreads: 0,
        activeThreads: 0,
        totalPosts: 0,
        activeNow: 0
    },
    categories: [],
    threads: [],
    currentThread: null,
    posts: [],
    loading: false,
    threadStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
};

const forumSlice = createSlice({
    name: "forum",
    initialState,
    reducers: {
        clearCurrentThread: (state) => {
            state.currentThread = null;
            state.posts = [];
            state.threadStatus = 'idle';
        },
        clearForumError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Stats
            .addCase(fetchForumStats.fulfilled, (state, action) => {
                state.stats = action.payload;
            })
            // Categories
            .addCase(fetchCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = action.payload;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Threads by Category
            .addCase(fetchThreadsByCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchThreadsByCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.threads = action.payload;
            })
            .addCase(fetchThreadsByCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Thread Details
            .addCase(fetchThreadDetails.pending, (state) => {
                state.threadStatus = 'loading';
                state.error = null;
            })
            .addCase(fetchThreadDetails.fulfilled, (state, action) => {
                state.threadStatus = 'succeeded';
                state.currentThread = action.payload.thread;
                state.posts = action.payload.posts;
            })
            .addCase(fetchThreadDetails.rejected, (state, action) => {
                state.threadStatus = 'failed';
                state.error = action.payload;
            })
            // Create Thread
            .addCase(createThread.fulfilled, (state, action) => {
                state.threads.unshift(action.payload);
            })
            // Like Thread
            .addCase(likeThread.fulfilled, (state, action) => {
                const { threadId, isLiked, userId } = action.payload;

                // Update in list
                const threadInList = state.threads.find(t => t._id === threadId);
                if (threadInList) {
                    threadInList.likes = isLiked
                        ? [...(threadInList.likes || []), userId]
                        : (threadInList.likes || []).filter(id => id !== userId);
                }

                // Update in detail view
                if (state.currentThread && state.currentThread._id === threadId) {
                    state.currentThread.likes = isLiked
                        ? [...(state.currentThread.likes || []), userId]
                        : (state.currentThread.likes || []).filter(id => id !== userId);
                }
            })
            // Update Thread
            .addCase(updateThread.fulfilled, (state, action) => {
                const updatedThread = action.payload;
                const index = state.threads.findIndex(t => t._id === updatedThread._id);
                if (index !== -1) {
                    state.threads[index] = { ...state.threads[index], ...updatedThread };
                }
                if (state.currentThread && state.currentThread._id === updatedThread._id) {
                    state.currentThread = { ...state.currentThread, ...updatedThread };
                }
            })
            // Delete Thread
            .addCase(deleteThread.fulfilled, (state, action) => {
                const threadId = action.payload;
                state.threads = state.threads.filter(t => t._id !== threadId);
                if (state.currentThread && state.currentThread._id === threadId) {
                    state.currentThread = null;
                }
            })
            // Create Post
            .addCase(createPost.fulfilled, (state, action) => {
                state.posts.push(action.payload);
                if (state.currentThread) {
                    state.currentThread.repliesCount = (state.currentThread.repliesCount || 0) + 1;
                }
            })
            // Like Post
            .addCase(likePost.fulfilled, (state, action) => {
                const { postId, isLiked, userId } = action.payload;
                const post = state.posts.find(p => p._id === postId);
                if (post) {
                    post.likes = isLiked
                        ? [...(post.likes || []), userId]
                        : (post.likes || []).filter(id => id !== userId);
                }
            })
            // Delete Post
            .addCase(deletePost.fulfilled, (state, action) => {
                state.posts = state.posts.filter(p => p._id !== action.payload);
                if (state.currentThread && state.currentThread.repliesCount > 0) {
                    state.currentThread.repliesCount -= 1;
                }
            })
            // Update Post
            .addCase(updatePost.fulfilled, (state, action) => {
                const updatedPost = action.payload;
                const index = state.posts.findIndex(p => p._id === updatedPost._id);
                if (index !== -1) {
                    state.posts[index] = { ...state.posts[index], ...updatedPost };
                }
            });
    },
});

export const { clearCurrentThread, clearForumError } = forumSlice.actions;

// Selectors
export const selectForumStats = (state) => state.forum.stats;
export const selectCategories = (state) => state.forum.categories;
export const selectThreads = (state) => state.forum.threads;
export const selectCurrentThread = (state) => state.forum.currentThread;
export const selectPosts = (state) => state.forum.posts;
export const selectForumLoading = (state) => state.forum.loading;
export const selectThreadStatus = (state) => state.forum.threadStatus;
export const selectForumError = (state) => state.forum.error;

export default forumSlice.reducer;
