// lib
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// import axios from 'axios';

const conversationSlice = createSlice({
    name: 'conversations',
    initialState: {
        data: [],
        conversationClick: null,
    },
    reducers: {
        clickConversation: (state, action) => {
            state.conversationClick = action.payload;
        },
    },
});

export default conversationSlice;
