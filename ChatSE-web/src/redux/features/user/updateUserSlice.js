import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import socket from '~/util/socket';

// lay danh sach da gui yeu cau ket ban
// export const userUpdate = createAsyncThunk(
//     // Tên action
//     'user/userUpdate ',
//     async (data) => {
//         // Gọi lên API backend
//         const { idUser } = data;
//         const { fullName, gender, birthday } = data;
//         const response = await fetch(`${process.env.REACT_APP_BASE_URL}users/${idUser}`, {
//             method: 'PUT',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ fullName, gender, birthday }),
//         });

//         // Convert dữ liệu ra json
//         const jsonData = await response.json();
//         console.log('json updated ->', jsonData);
//         return jsonData;
//     },
// );

const updateUserSlice = createSlice({
    name: 'user',
    initialState: { data: [] },
    extraReducers: (builder) => {
        //builder
        // .addCase(userUpdate.fulfilled, (state, action) => {
        //     console.log('act-pay', action.payload);
        //     const preUser = action.payload;
        //     const currUser = state.data.find((user) => user._id === preUser._id);
        //     // updated
        //     currUser._id = preUser._id;
        //     currUser.fullName = preUser.fullName;
        //     currUser.gender = preUser.gender;
        //     currUser.birthday = preUser.birthday;
        //     if (currUser) {
        //         state.data = currUser;
        //     }
        //     socket.emit('change_info_user', {
        //         info: action.payload,
        //     });
        // });
    },
});
export default updateUserSlice;
