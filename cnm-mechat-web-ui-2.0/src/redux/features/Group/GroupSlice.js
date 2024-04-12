import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import socket from '~/util/socket';

// fetch api conversation by id
export const fetchApiConversationById = createAsyncThunk('listGroupUser/fetchApiConversationById', async (userId) => {
    try {
        const res = await axios.get(`${process.env.REACT_APP_BASE_URL}conversations/${userId}`);

        return res.data.data.sort((a, b) => Date.parse(b.time) - Date.parse(a.time));
    } catch (err) {
        console.log(err);
    }
});

// delete conversation single
export const fetchApiDeleteConversationSingle = createAsyncThunk(
    'listGroupUser/fetchApiDeleteConversationSingle',
    async ({ conversationId, userId }) => {
        try {
            const res = await axios.delete(
                `${process.env.REACT_APP_BASE_URL}conversations/delete-for-you/${conversationId}`,
                {
                    data: { userId },
                    headers: { Authorization: '***' },
                },
            );

            return res.data;
        } catch (err) {
            console.log(err);
        }
    },
);

//
export const listGroupUser = createAsyncThunk('user/listGroupUser', async (arg, { rejectWithValue }) => {
    try {
        const getToken = JSON.parse(localStorage.getItem('user_login'));

        // check token
        if (getToken !== null) {
            const decodedToken = jwt_decode(getToken._token);
            const res = await axios.get(`${process.env.REACT_APP_BASE_URL}conversations/${decodedToken._id}`);
            return res.data.data;
        }
    } catch (err) {
        rejectWithValue(err);
    }
});

//tạo group
export const createGroup = createAsyncThunk(
    // Tên action
    'user/createGroup ',
    async (data) => {
        // Gọi lên API backend

        const response = await fetch(`${process.env.REACT_APP_BASE_URL}conversations/create-conversation`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        // Convert dữ liệu ra json
        const jsonData = await response.json();

        return jsonData;
    },
);

// add member to group
// export const fetchApiAddMemberToGroup = createAsyncThunk('listGroupUser/fetchApiAddMemberToGroup', async (memberId) => {
//     try {
//         const res = await axios.post(
//             `${process.env.REACT_APP_BASE_URL}conversations/add-member-conversation/${memberId}`,
//         );
//         console.log('44 - res -', res.data);

//     } catch (err) {
//         console.log(err);
//     }
// });

//xoa thanh vien
export const deleteMember = createAsyncThunk(
    // Tên action
    'user/deleteMember ',
    async (data) => {
        // Gọi lên API backend
        const { conversationId } = data;
        const { memberId, mainId } = data;

        const response = await fetch(`${process.env.REACT_APP_BASE_URL}conversations/delete-member/${conversationId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ memberId, mainId }),
        });

        const jsonData = await response.json();

        return jsonData;
    },
);
//them thanh vien
export const addMember = createAsyncThunk(
    // Tên action
    'user/addMember ',
    async (data) => {
        // Gọi lên API backend
        const { conversationId } = data;
        const { newMemberID, memberAddID } = data;

        const response = await fetch(
            `${process.env.REACT_APP_BASE_URL}conversations/add-member-conversation/${conversationId}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ newMemberID, memberAddID }),
            },
        );

        const jsonData = await response.json();

        return jsonData;
    },
);

//out nhom
export const outGroup = createAsyncThunk(
    // Tên action
    'user/outGroup ',
    async (data) => {
        // Gọi lên API backend
        const { conversationId } = data;
        const { userId } = data;

        const response = await fetch(
            `${process.env.REACT_APP_BASE_URL}conversations/out-conversation/${conversationId}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId }),
            },
        );

        const jsonData = await response.json();

        return jsonData;
    },
);

//doi ten nhom
export const changeNameGroups = createAsyncThunk(
    // Tên action
    'user/changeNameGroups ',
    async (data) => {
        // Gọi lên API backend
        const { conversationId } = data;
        const { newName, userId } = data;

        const response = await fetch(`${process.env.REACT_APP_BASE_URL}conversations/change-name/${conversationId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ newName, userId }),
        });

        const jsonData = await response.json();

        return jsonData;
    },
);

// update avatar
const createFormData = (data) => {
    const { userId, imageLink, conversationId } = data;
    //console.log(data);
    const dataForm = new FormData();

    dataForm.append('userId', userId);
    dataForm.append('imageLink', imageLink);
    dataForm.append('conversationId', conversationId);

    return dataForm;
};

export const fetchApiUpdateAvatarOfGroup = createAsyncThunk(
    'updateInfoGroup/fetchApiUpdateAvatarOfGroup',
    async (data) => {
        try {
            if (data) {
                let formData = createFormData(data);
                const res = await axios.post(
                    `${process.env.REACT_APP_BASE_URL}conversations/change-avatar/${data.conversationId}`,
                    formData,
                    {
                        headers: {
                            'content-type': 'multipart/form-data',
                        },
                    },
                );

                return res.data;
            }
        } catch (err) {
            console.log(err);
        }
    },
);

//giai tan nhom
export const deleteConversation = createAsyncThunk(
    // Tên action
    'user/deleteConversation ',
    async (data) => {
        // Gọi lên API backend
        const { conversationId } = data;
        const { mainId } = data;
        console.log(data);
        const response = await fetch(
            `${process.env.REACT_APP_BASE_URL}conversations/delete-conversation/${conversationId}`,
            {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ mainId }),
            },
        );

        const jsonData = await response.json();

        return jsonData;
    },
);

// chặn tin nhắn của 1 thành viên
export const blockMember = createAsyncThunk(
    // Tên action
    'user/blockMember ',
    async (data) => {
        // Gọi lên API backend
        const { conversationId } = data;
        const { userId } = data;
        const response = await fetch(
            `${process.env.REACT_APP_BASE_URL}conversations/block-conversation/${conversationId}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId }),
            },
        );

        const jsonData = await response.json();

        return jsonData;
    },
);

//bor chan tin nhan
export const cancelBlockMember = createAsyncThunk(
    // Tên action
    'user/cancelBlockMember ',
    async (data) => {
        // Gọi lên API backend
        const { conversationId } = data;
        const { userId } = data;
        const response = await fetch(
            `${process.env.REACT_APP_BASE_URL}conversations/remove-block-conversation/${conversationId}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId }),
            },
        );

        const jsonData = await response.json();

        return jsonData;
    },
);
//thay doi truong nhom
export const changeLearder = createAsyncThunk(
    // Tên action
    'user/changeLearder ',
    async (data) => {
        // Gọi lên API backend
        const { conversationId } = data;
        const { userId } = data;
        const response = await fetch(
            `${process.env.REACT_APP_BASE_URL}conversations/change-createBy/${conversationId}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId }),
            },
        );

        const jsonData = await response.json();

        return jsonData;
    },
);
const listGroupUsers = createSlice({
    name: 'listGroupUser',
    initialState: {
        data: [],
        isLoading: false,
        isLoadingOutGroup: false,
        conversationClick: null,
        notificationOutGroup: false,
        notificationBlockMessage: false,
        notificationAddMemberToGroup: false,
        arrBlocked: [],
    },
    reducers: {
        clickConversation: (state, action) => {
            // console.log('[click conversation by id] - ', action.payload);
            state.conversationClick = action.payload;
        },
        arrivalCreateGroupFromSocket: (state, action) => {
            const conversation = action.payload;
            const _con = state.data.find((con) => con.id === conversation.id);

            if (!_con) {
                state.data.unshift(action.payload);
            } else {
                console.log('Existing conversation id!!!');
                return;
            }
        },
        arrivalMemberJoinGroupFromSocket: (state, action) => {
            const preConversation = action.payload;
            const currConversation = state.data.find((con) => con.id === preConversation.id);

            if (currConversation) {
                state.data.push(currConversation);
            } else {
                console.log('Error add member with socket!');
                return;
            }
        },
        arrivalDeleteConversationOutGroupFromSocket: (state, action) => {
            const _con = state.data.findIndex((con) => con.id === action.payload);

            state.data.splice(_con, 1);
            state.conversationClick = null;
        },
        arrivalUpdatedMembersInGroup: (state, action) => {
            const preConversation = action.payload;
            const currConversation = state.data.find((con) => con.id === preConversation._id);

            // updated
            currConversation._id = preConversation._id;
            currConversation.idMember = preConversation.idMember;
            currConversation.members = preConversation.members;
            currConversation.action = preConversation.action;
            currConversation.time = preConversation.time;

            if (currConversation) {
                state.conversationClick = currConversation;
            }
        },
        arrivalUpdatedWhenAddMemberOtherInGroupFromSocket: (state, action) => {
            const preConversation = action.payload;
            const currConversation = state.data.find((con) => con.id === preConversation.id);

            // updated
            currConversation.id = preConversation.id;
            currConversation.newMember = preConversation.newMember;
            currConversation.members = preConversation.members;
            currConversation.lastMessage = preConversation.lastMessage;

            if (currConversation) {
                state.conversationClick = currConversation;
            }
        },
        arrivalUpdatedWhenDeleteMemberOtherInGroupFromSocket: (state, action) => {
            const preConversation = action.payload;
            const currConversation = state.data.find((con) => con.id === preConversation._id);

            // updated
            currConversation._id = preConversation._id;
            currConversation.idMember = preConversation.idMember;
            currConversation.deleteBy = preConversation.deleteBy;
            currConversation.members = preConversation.members;
            currConversation.action = preConversation.action;
            currConversation.time = preConversation.time;

            // updated

            if (currConversation) {
                state.conversationClick = currConversation;
            }
        },
        arrivalUpdateLastMessageFromSocket: (state, action) => {
            // pre-last message
            const preConversationLastMessage = action.payload;
            const updateConversationLastMessage = state.data.find(
                (con) => con.id === preConversationLastMessage.conversationID,
            );

            // update last message
            updateConversationLastMessage.content =
                preConversationLastMessage.contentMessage || preConversationLastMessage.content;
            updateConversationLastMessage.time = preConversationLastMessage.createAt;

            // index conversation
            const conversationIndex = state.data.findIndex(
                (con) => con.id === preConversationLastMessage.conversationID,
            );

            state.data.splice(conversationIndex, 1);
            state.data.unshift(updateConversationLastMessage);
        },
        arrivalBlockMessageUserInGroupFromSocket: (state, action) => {
            const preConversation = action.payload;
            const currConversation = state.data.find((con) => con.id === preConversation.conversationId);

            // update
            currConversation.blockBy = preConversation.blockBy;
            currConversation.conversationId = preConversation.conversationId;

            if (currConversation) {
                state.conversationClick = currConversation;
            } else {
                console.log('Error blocked message user!');
                return;
            }
        },
        arrivalChangeNameConversationOfGroupFromSocket: (state, action) => {
            const preNameGroup = action.payload;
            const currNameGroup = state.data.find((con) => con.id === preNameGroup.conversationID);

            currNameGroup.conversationID = preNameGroup.conversationID;
            currNameGroup.name = preNameGroup.name;
            currNameGroup.action = preNameGroup.action;

            if (currNameGroup) {
                state.conversationClick = currNameGroup;
            }
        },
        arrivalChangeAvatarConversationOfGroupFromSocket: (state, action) => {
            const preAvatarGroup = action.payload;
            const currAvatarGroup = state.data.find((con) => con.id === preAvatarGroup.conversationID);

            currAvatarGroup.conversationID = preAvatarGroup.conversationID;
            currAvatarGroup.imageLinkOfConver = preAvatarGroup.imageLink;

            if (currAvatarGroup) {
                state.conversationClick = currAvatarGroup;
            }
        },
        arrivalChangeLeaderInGroupFromSocket: (state, action) => {
            const preConversation = action.payload;
            const currConversation = state.data.find((con) => con.id === preConversation.idConversation);

            // updated
            currConversation.idConversation = preConversation.idConversation;
            currConversation.createdBy = preConversation.createBy;
            currConversation.action = preConversation.action;

            if (currConversation) {
                state.conversationClick = currConversation;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchApiConversationById.pending, (state, action) => {
                if (action.payload) {
                    state.isLoading = true;
                    // state.data = action.payload;
                }
            })
            .addCase(fetchApiConversationById.fulfilled, (state, action) => {
                if (action.payload) {
                    state.data = action.payload;
                    state.isLoading = false;
                }
            })
            .addCase(fetchApiDeleteConversationSingle.fulfilled, (state, action) => {
                const preConversation = action.payload;
                const currConversation = state.data.findIndex((con) => con.id === preConversation.id);

                state.data.splice(currConversation, 1);
                state.conversationClick = null;
            })
            .addCase(createGroup.fulfilled, (state, action) => {
                if (action.payload) {
                    state.data.push(action.payload);
                }

                // socket
                socket.emit('create_group', {
                    conversation: action.payload,
                });
            })
            .addCase(deleteMember.fulfilled, (state, action) => {
                const preMember = action.payload;

                const currConversation = state.data.find((con) => con.id === preMember._id);

                // updated
                currConversation.deleteBy = preMember.deleteBy;
                currConversation.idMember = preMember.idMember;
                currConversation._id = preMember._id;
                currConversation.members = preMember.members;

                if (currConversation) {
                    state.conversationClick = currConversation;
                }

                socket.emit('block_user_in_group', {
                    info: action.payload,
                });
            })
            .addCase(addMember.fulfilled, (state, action) => {
                const preConversation = action.payload;
                const currConversation = state.data.find((con) => (con.id = preConversation.id));

                // updated
                currConversation.id = preConversation.id;
                currConversation.newMember = preConversation.newMember;
                currConversation.members = preConversation.members;
                currConversation.lastMessage = preConversation.lastMessage;

                if (currConversation) {
                    state.conversationClick = currConversation;
                    state.notificationAddMemberToGroup = true;
                }

                socket.emit('add_user_to_group', {
                    info: action.payload,
                });
            })
            .addCase(outGroup.pending, (state, payload) => {
                // if (state.isLoadingOutGroup) {
                // state.isLoadingOutGroup = true;
                // }
            })
            .addCase(outGroup.fulfilled, (state, action) => {
                state.conversationClick = null;

                // socket
                socket.emit('user_out_group', {
                    info: action.payload,
                });
            })
            .addCase(changeNameGroups.fulfilled, (state, action) => {
                const preNameGroup = action.payload;
                const currNameGroup = state.data.find((con) => con.id === preNameGroup.id);

                currNameGroup.id = preNameGroup.id;
                currNameGroup.name = preNameGroup.name;
                currNameGroup.action = preNameGroup.action;

                if (currNameGroup) {
                    state.conversationClick = currNameGroup;
                }

                socket.emit('change_name_group', {
                    conversation: action.payload,
                });
            })
            .addCase(deleteConversation.fulfilled, (state, action) => {
                state.conversationClick = null;

                socket.emit('remove_group', {
                    info: action.payload,
                });
            })
            .addCase(blockMember.fulfilled, (state, action) => {
                const preConversation = action.payload;
                const currConversation = state.data.find((con) => con.id === preConversation.id);

                // updated blocked
                currConversation.blockBy = preConversation.blockBy;
                currConversation.conversationId = preConversation.conversationId;

                if (currConversation) {
                    state.conversationClick = currConversation;
                }

                socket.emit('block_message_user_in_group', {
                    info: action.payload,
                });
            })
            .addCase(cancelBlockMember.fulfilled, (state, action) => {
                const preConversation = action.payload;

                const currConversation = state.data.findIndex((con) => con.id === preConversation.conversationId);
                const currBlockedConversation = state.data.find((con) => con.id === preConversation.id);

                // updated un-block
                currBlockedConversation.blockBy = preConversation.blockBy;
                currBlockedConversation.conversationId = preConversation.conversationId;

                if (currConversation) {
                    state.data.splice(currConversation, 1);
                }

                if (currBlockedConversation) {
                    state.conversationClick = currBlockedConversation;
                }

                socket.emit('block_message_user_in_group', {
                    info: action.payload,
                });
            })
            .addCase(fetchApiUpdateAvatarOfGroup.fulfilled, (state, action) => {
                const preAvatarGroup = action.payload;
                const currAvatarGroup = state.data.find((con) => con.id === preAvatarGroup.id);

                if (currAvatarGroup?.imageLinkOfConver) {
                    currAvatarGroup.imageLinkOfConver = preAvatarGroup.imageLink;
                }

                if (currAvatarGroup) {
                    state.conversationClick = currAvatarGroup;
                }

                socket.emit('change_avatar_group', {
                    conversation: action.payload,
                });
            })
            .addCase(changeLearder.fulfilled, (state, action) => {
                const preConversation = action.payload;
                const currConversation = state.data.find((con) => con.id === preConversation.idConversation);

                // updated
                currConversation.idConversation = preConversation.idConversation;
                currConversation.createdBy = preConversation.createBy;
                currConversation.action = preConversation.action;

                if (currConversation) {
                    state.conversationClick = currConversation;
                }

                // socket
                socket.emit('change_leader', {
                    request: action.payload,
                });
            });
    },
});

export default listGroupUsers;
