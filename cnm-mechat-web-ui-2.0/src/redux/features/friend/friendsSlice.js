import axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const friendsSlice = createSlice({
    name: 'friends',
    initialState: {
        data: [],
        isLoading: false,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchApiFriendsById.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(fetchApiFriendsById.fulfilled, (state, action) => {
                state.data = action.payload;
            });
    },
});

export const fetchApiFriendsById = createAsyncThunk('friends/fetchApiFriendsById', async (userId) => {
    try {
        const res = await axios.get(`${process.env.REACT_APP_BASE_URL}users/get-friends-user/${userId}`);

        return res.data.data;
    } catch (err) {
        console.log(err);
    }
});

export default friendsSlice;
