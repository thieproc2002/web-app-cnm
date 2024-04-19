import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
export const infoUserConversation = createAsyncThunk(
    // Tên action
    'user/infoUserConversation ',
    async (data) => {
        // Gọi lên API backend
        const { userID } = data;

        const response = await fetch(`${process.env.REACT_APP_BASE_URL}users/${userID}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Convert dữ liệu ra json
        const jsonData = await response.json();

        return jsonData.data;
    },
);
const userCurrents = createSlice({
    name: 'userCurrents',
    initialState: { data: [] },
    extraReducers: (builder) => {
        builder.addCase(infoUserConversation.fulfilled, (state, action) => {
            state.data = action.payload;
        });
    },
});
export default userCurrents;
