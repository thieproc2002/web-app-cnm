//danh sach bạn đã yêu cầu kết bạn
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// me
import socket from '~/util/socket';

// //thu hoi ket bạn
// export const callBack = createAsyncThunk(
//     // Tên action
//     'user/callBack ',
//     async (data) => {
//         // Gọi lên API backend
//         console.log(data);
//         const { status, senderID, idRequest } = data;
//         const response = await fetch(`${process.env.REACT_APP_BASE_URL}friendRequests/${idRequest}`, {
//             method: 'DELETE',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ status, senderID }),
//         });

//         // Convert dữ liệu ra json
//         const jsonData = await response.json();
//         console.log(jsonData);
//         return jsonData;
//     },
// );

// const listMeRequestFriend = createSlice({
//     name: 'listMeRequest',
//     initialState: { data: [] },
//     extraReducers: (builder) => {
//         builder
//             // .addCase(meRequestFriend.fulfilled, (state, action) => {
//             //     state.data = action.payload;
//             // })
//             .addCase(callBack.fulfilled, (state, action) => {
//                 // const { status, senderID, idRequest } = action.payload;
//                 console.log('[re-call-send-id]', action.payload);
//                 state.data = action.payload;

//                 // socket
//                 socket.emit('recall_add_friend', {
//                     request: state.payload,
//                 });
//             });
//     },
// });

// export default listMeRequestFriend;
