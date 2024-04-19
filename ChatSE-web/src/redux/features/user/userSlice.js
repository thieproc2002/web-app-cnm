// lib
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import socket from '~/util/socket';

// fetch api user
export const fetchApiUser = createAsyncThunk('user/fetchApiUser', async (arg, { rejectWithValue }) => {
    try {
        const getToken = JSON.parse(localStorage.getItem('user_login'));
        // check token
        if (getToken !== null) {
            const decodedToken = jwt_decode(getToken._token);

            const res = await axios.get(`${process.env.REACT_APP_BASE_URL}users/${decodedToken._id}`);

            return res.data.data;
        }
    } catch (err) {
        console.log(err);
        rejectWithValue(err);
    }
});

//Quen mật khẩu
export const forgetPassWord = createAsyncThunk(
    // Tên action
    'user/forgetPassWord ',
    async (data) => {
        // Gọi lên API backend
        const { phoneNumber, newPassword } = data;

        const response = await fetch(`${process.env.REACT_APP_BASE_URL}accounts/forget-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ phoneNumber, newPassword }),
        });

        // Convert dữ liệu ra json
        const jsonData = await response.json();
        return jsonData;
    },
);

const createFormData = (data) => {
    const { _id, avatarLink } = data;
    //console.log(data);
    const dataForm = new FormData();

    dataForm.append('_id', _id);
    dataForm.append('avatarLink', avatarLink);

    return dataForm;
};

// update info single
export const updateAvatar = createAsyncThunk(
    // Tên action
    'user/updateAvatar ',
    async (data) => {
        if (data) {
            let formData = createFormData(data);

            const res = await axios.post(`${process.env.REACT_APP_BASE_URL}users/update-avatar-web/${data._id}`, formData, {
                headers: {
                    'content-type': 'multipart/form-data',
                },
            });

            return res.data;
        }
    },
);

// handle updated info user
export const userUpdate = createAsyncThunk(
    // Tên action
    'user/userUpdate ',
    async (data) => {
        // Gọi lên API backend
        const { idUser } = data;
        const { fullName, gender, birthday } = data;
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}users/${idUser}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ fullName, gender, birthday }),
        });

        // Convert dữ liệu ra json
        const jsonData = await response.json();
        console.log('json updated ->', jsonData);
        return jsonData;
    },
);

// handle delete friend
export const fetchApiDeleteFriend = createAsyncThunk('user/fetchApiDeleteFriend ', async (data) => {
    // Gọi lên API backend
    const { idUser } = data;
    const { status, userDeleteId } = data;
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}users/delete-friend/${idUser}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, userDeleteId }),
    });

    const jsonData = await response.json();

    return jsonData;
});

const userSlice = createSlice({
    name: 'user',
    initialState: {
        data: [],
        userClick: null,
        isSuccess: false,
        isLoading: false,
    },
    reducers: {
        resetUserInfo: (state, action) => {
            state.data = action.payload;
        },
        arrivalDeleteFriendFromSocket: (state, action) => {
            const preReq = action.payload;

            state.data.friends = preReq;
        },
        arrivalSendFriendFromSocket: (state, action) => {
            const preReq = action.payload;

            state.data.friends = preReq;
        },
        setUserClick: (state, action) => {
            state.userClick = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchApiUser.fulfilled, (state, action) => {
                state.data = action.payload;
            })
            .addCase(updateAvatar.fulfilled, (state, action) => {
                state.data = action.payload;

                // socket
                socket.emit('change_avatar_single', {
                    request: action.payload,
                });
            })
            .addCase(userUpdate.fulfilled, (state, action) => {
                // updated
                state.data = action.payload;
            })
            .addCase(fetchApiDeleteFriend.fulfilled, (state, action) => {
                const preReq = action.payload;

                // updated
                state.data.friends = preReq.listFriendsUser;

                // socket
                socket.emit('delete_friend', {
                    request: action.payload,
                });
            });
    },
});

export default userSlice;
