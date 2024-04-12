import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import jwt_decode from 'jwt-decode';
import axios from 'axios';

// me
import socket from '~/util/socket';

// store
const listFriendRequests = createSlice({
    name: 'friendRequest',
    initialState: { data: [], dataSended: [], dataAccepted: [], delFriends: [] },
    reducers: {
        arrivalFriendRequestFromSocket: (state, action) => {
            const preReq = action.payload;
            console.log('preReq', preReq);
            const currReq = state.dataSended.some((req) => req.idFriendRequest === preReq.idFriendRequest);
            console.log('currReq', currReq);

            if (!currReq) {
                state.dataSended.push(action.payload);
            }
        },
        arrivalAcceptFriendRequestFromSocket: (state, action) => {
            const preReq = action.payload;
            const currReq = state.data.some((req) => req.idFriendRequest === preReq.idFriendRequest);

            if (!currReq) {
                state.data.push(action.payload);
            }
        },
        arrivalRecallRequestAddFriendFromSocket: (state, action) => {
            const preReq = action.payload;
            const currReq = state.data.findIndex((req) => req.idFriendRequest === preReq);

            state.data.splice(currReq, 1);
        },
        arrivalExitRequestAddFriendFromSocket: (state, action) => {
            const preReq = action.payload;
            const currReq = state.dataSended.findIndex((req) => req.idFriendRequest === preReq);

            state.dataSended.splice(currReq, 1);
        },
    },
    extraReducers: (builder) => {
        builder
            // send request add friend
            .addCase(friendRequests.fulfilled, (state, action) => {
                console.log('act-pay', action.payload.data);
                const pre = state.dataSended.find((pre) => pre.idFriendRequest === action.payload.data.idFriendRequest);
                console.log('pre', pre);
                state.dataSended.push(action.payload.data);

                // socket
                socket.emit('send_friend_request', {
                    request: action.payload.data,
                });
            })
            // accept request friend
            .addCase(fetchApiAcceptRequestFriend.fulfilled, (state, action) => {
                const { friendRequestID, listFriendsReceiver, listFriendsSender, sender, receiver, conversation } =
                    action.payload;
                const del = state.data.findIndex((friend) => friend.idFriendRequest === friendRequestID);

                state.data.splice(del, 1);

                // socket accept friend
                if (listFriendsReceiver && listFriendsSender && sender && receiver && conversation) {
                    socket.emit('accept_friend_request', {
                        listFriendsReceiver,
                        listFriendsSender,
                        sender,
                        receiver,
                        conversation,
                    });
                }

                socket.emit('cancel_friend_request', {
                    data: action.payload,
                });
            })
            // exit request friend
            .addCase(fetchApiExitRequestFriend.fulfilled, (state, action) => {
                const { friendRequestID } = action.payload;
                const del = state.data.findIndex((friend) => friend.idFriendRequest === friendRequestID);

                state.data.splice(del, 1);

                socket.emit('cancel_friend_request', {
                    data: action.payload,
                });
            })
            // accept friend request
            .addCase(friendAccept.fulfilled, (state, action) => {
                if (action.payload) {
                    state.data = action.payload;
                }
            })
            // get request add friend
            .addCase(meRequestFriend.fulfilled, (state, action) => {
                console.log('action.payload', action.payload);
                if (action.payload) {
                    state.dataSended = action.payload;
                }
            })
            .addCase(fetchApiRecallRequestAddFriend.fulfilled, (state, action) => {
                state.dataSended = action.payload.data;

                // socket
                socket.emit('recall_friend_request', {
                    deleted: action.payload.deleted,
                });
            });
    },
});

// handle send request add friend
export const friendRequests = createAsyncThunk(
    'user/friendRequests',
    // Code async logic, tham số đầu tiên data là dữ liệu truyền vào khi gọi action
    async (data) => {
        // Gọi lên API backend
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}friendRequests/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        // Convert dữ liệu ra json
        const jsonData = await response.json();
        console.log('128 ->', jsonData);
        return jsonData;
    },
);

// handle accept friends request
export const fetchApiAcceptRequestFriend = createAsyncThunk(
    // Tên action
    'user/accept ',
    async (data) => {
        // Gọi lên API backend
        const { idRequest } = data;
        const { status, senderID, receiverID } = data;
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}friendRequests/friend-request/${idRequest}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status, senderID, receiverID }),
        });

        // Convert dữ liệu ra json
        const jsonData = await response.json();

        return jsonData;
    },
);

// handle accept friends request
export const fetchApiExitRequestFriend = createAsyncThunk(
    // Tên action
    'user/fetchApiExitRequestFriend',
    async (data) => {
        // Gọi lên API backend
        const { idRequest } = data;
        const { status, senderID, receiverID } = data;
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}friendRequests/friend-request/${idRequest}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status, senderID, receiverID }),
        });

        // Convert dữ liệu ra json
        const jsonData = await response.json();
        return jsonData;
    },
);

// handle get request add friend
export const meRequestFriend = createAsyncThunk('user/meRequestFriend', async (arg, { rejectWithValue }) => {
    try {
        const getToken = JSON.parse(localStorage.getItem('user_login'));

        // check token
        if (getToken !== null) {
            const decodedToken = jwt_decode(getToken._token);
            const res = await axios.get(
                `${process.env.REACT_APP_BASE_URL}friendRequests/get-of-me/${decodedToken._id}`,
            );

            return res.data;
        }
    } catch (err) {
        rejectWithValue(err);
    }
});

// handle get list request add friend
export const friendAccept = createAsyncThunk('user/friendAccept', async (arg, { rejectWithValue }) => {
    try {
        const getToken = JSON.parse(localStorage.getItem('user_login'));

        // check token
        if (getToken !== null) {
            const decodedToken = jwt_decode(getToken._token);
            const res = await axios.get(
                `${process.env.REACT_APP_BASE_URL}friendRequests/get-list-request/${decodedToken._id}`,
            );

            return res.data.data;
        }
    } catch (err) {
        rejectWithValue(err);
    }
});

// handle re-call request add friend
export const fetchApiRecallRequestAddFriend = createAsyncThunk(
    // Tên action
    'user/fetchApiRecallRequestAddFriend ',
    async (data) => {
        // Gọi lên API backend
        const { status, senderID, idRequest } = data;
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}friendRequests/${idRequest}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status, senderID }),
        });

        // Convert dữ liệu ra json
        const jsonData = await response.json();

        return jsonData;
    },
);

export default listFriendRequests;
