import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Alert } from 'react-native';
import config, { createFormData, socket } from '../../config';
import{ S3 } from 'aws-sdk';
const messageListSlice = createSlice({
    name: 'messages',
    initialState: {
        data: [],
        loading: true,
        nextLoading: true,
    },
    reducers: {
        addMessageFromSocket: (state, action) => {
            const messageExist = state.data.find((message) => message._id === action.payload._id);
            if (!messageExist) {
                state.data.unshift(action.payload);
            } else {
                return;
            }
        },
        recallMessageFromSocket: (state, action) => {
            const message = action.payload;
            const messageList = state.data.map((_message) => (_message._id === message._id ? message : _message));
            state.data = messageList;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMessagesById.fulfilled, (state, action) => {
                state.data = action.payload;
                state.loading = true;
            })
            .addCase(fetchMessagesById.pending, (state, action) => {
                state.loading = false;
            })
            .addCase(fetch10NextMessagesById.fulfilled, (state, action) => {
                if (action.payload) {
                    const next10Message = [...action.payload];
                    const nowArray = state.data.concat(next10Message);
                    state.data = nowArray;
                    state.nextLoading = true;
                }
            })
            .addCase(fetch10NextMessagesById.pending, (state, action) => {
                state.nextLoading = false;
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                state.data.unshift(action.payload);
                //send success socket
                //console.log(action.payload);
                socket.emit('send_message', { message: action.payload });
            })
            .addCase(sendImageMessage.rejected, (state, action) => {
                console.log('err send message');
                Alert.alert('Thông báo', 'Tệp đa phương tiện này quá nặng!');
            })
            .addCase(sendImageMessage.fulfilled, (state, action) => {
                if (action.payload) {
                    socket.emit('send_message', { message: action.payload });
                    state.data.unshift(action.payload);
                } else {
                    Alert.alert('Thông báo', 'Tệp đa phương tiện này vượt quá 5MB');
                }
            })
            .addCase(sendFile.fulfilled, (state, action) => {
                if (action.payload) {
                    socket.emit('send_message', { message: action.payload });
                    state.data.unshift(action.payload);
                } else {
                    Alert.alert('Thông báo', 'File này lớn hơn 5 MB nên không gửi được');
                }
            })
            .addCase(recallMessage.fulfilled, (state, action) => {
                const message = action.payload;
                socket.emit('recall_message', { message });
                const messageList = state.data.map((_message) => (_message._id === message._id ? message : _message));
                state.data = messageList;
            })
            .addCase(deleteMessage.fulfilled, (state, action) => {
                const { id } = action.payload;
                const index = state.data.findIndex((_message) => _message._id === id);
                state.data.splice(index, 1);
            })
            .addCase(moveMessage.fulfilled, (state, action) => {
                const {messages, navigation} = action.payload;
                messages.forEach((message) => {
                    //console.log(message);
                    socket.emit('send_message', { message: message });
                });

                navigation.goBack();
            });
    },
});

/**
 * get 10 messages first by conversation id
 */
export const fetchMessagesById = createAsyncThunk('messages/fetchMessagesById', async ({ id }) => {
    if (id) {
        try {
            const res = await fetch(`${config.LINK_API}/messages/ten-last-messages/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ count: 0 }),
            });
            const messages = await res.json();
            return messages;
        } catch (err) {
            console.log(`[fetch messages]: ${err}`);
        }
    }
});

/**
 * get 10 messages next by conversation id
 */
export const fetch10NextMessagesById = createAsyncThunk(
    'messages/fetch10NextMessagesById',
    async ({ id, countMessage }) => {
        if (id) {
            try {
                const res = await fetch(`${config.LINK_API}/messages/ten-last-messages/${id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ count: countMessage }),
                });
                const messages = await res.json();
                return messages;
            } catch (err) {
                console.log(`[fetch messages]: ${err}`);
            }
        }
    },
);

/**
 * send message to server by conversation id
 * body: {conversation_id}
 * return message send success
 */
export const sendMessage = createAsyncThunk('messages/add', async (message) => {
    if (message) {
        const res = await fetch(`${config.LINK_API}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
        });
        const _message = await res.json();
        //console.log('text message -> ', _message);
        return _message;
    }
});

export const sendImageMessage = createAsyncThunk('messages/send-image', async (imageMessage) => {
    if (imageMessage) {
        const { senderID, conversationID } = imageMessage;
        // let formData = createFormData(imageLinks, 'imageLinks');
        // formData.append('senderID', senderID);
        // formData.append('conversationID', conversationID);
        const image = imageMessage.fileType.split('/');
        const fileType = image[image.length - 1];
        const response = await fetch(imageMessage.imageLinks);
        const blob = await response.blob();
        const filePath = `${imageMessage.conversationID}_${Date.now().toString()}.${fileType}`;
        const s3 = new S3({
            region: 'ap-southeast-1',
            accessKeyId: 'AKIAQ3EGQ4KSN7VPGJ7H',
            secretAccessKey: '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',
          });
          const paramsS3 = {
            Bucket: 'zalo1',
            Key: filePath,
            Body: blob,
            ContentType: imageMessage.fileType,
            ContentLength: blob.size,
          };    
          const dataupdate = await s3.upload(paramsS3).promise();
          let imageLinks = dataupdate.Location;
          let name =filePath;
          console.log('link: ',imageLinks);
        const res = await fetch(`${config.LINK_API}/messages`, {
            method: 'POST',
            body: JSON.stringify({ senderID, conversationID, imageLinks, name}),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const _message = await res.json();
        if (_message?._id) {
            //console.log('image message -> ', _message);
            return _message;
        } else {
            return null;
        }
    }
});

export const sendFile = createAsyncThunk('message/sendFile', async (message) => {
    if (message) {
        const { senderID, conversationID, fileToUpload } = message;
        // const formData = new FormData();
        // formData.append('senderID', message.senderID);
        // formData.append('conversationID', message.conversationID);
        // formData.append('fileLink', message.fileToUpload);
        // console.log('formdata:', formData);
        const response = await fetch(message.fileToUpload.uri);
        const blob = await response.blob();
        const namepath = message.fileToUpload.name.split('.');
        const name = namepath[0];
        const filePath = `${name}.${message.fileToUpload.type}`;
        const s3 = new S3({
            region: 'ap-southeast-1',
            accessKeyId: 'AKIAQ3EGQ4KSN7VPGJ7H',
            secretAccessKey: '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',
          });
          const paramsS3 = {
            Bucket: 'zalo1',
            Key: filePath,
            Body: blob,
            ContentType: message.fileType,
            ContentLength: blob.size,
          };    
          const dataupdate = await s3.upload(paramsS3).promise();
          let fileLink = dataupdate.Location;
          const imageLinks = "";
          console.log('link: ',fileLink);
        const res = await fetch(`${config.LINK_API}/messages`, {
            method: 'POST',
            body: JSON.stringify({ senderID, conversationID, fileLink, name, imageLinks }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const _message = await res.json();
        // console.log(_message);
        if (_message?._id) {
            //console.log('file message -> ', _message);
            return _message;
        } else {
            // console.log(_message);
            return null;
        }
    }
});
export const recallMessage = createAsyncThunk('message/recall', async (id) => {
    if (id) {
        try {
            const res = await fetch(`${config.LINK_API}/messages/recall/${id}`);
            const message = await res.json();
            //console.log("message", message);
            return message;
        } catch (err) {
            console.log(`[fetch messages]: ${err}`);
        }
    }
});

export const deleteMessage = createAsyncThunk('message/delete', async (data) => {
    if (data) {
        try {
            const res = await fetch(`${config.LINK_API}/messages/delete-for-you/${data.messageId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: data.userId }),
            });
            const id = await res.json();
            return id;
        } catch (err) {
            console.log(`[fetch delete message]: ${err}`);
        }
    }
});

export const moveMessage = createAsyncThunk('message/move', async (data) => {
    if (data) {
        const { idConversation, idMessage, userId, navigation } = data;
        try {
            const req = await fetch(`${config.LINK_API}/messages/move-message/${idMessage}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ conversationId: idConversation, userId }),
            });

            const res = await req.json();
            if (res?.newMessage) {
                return {
                    messages: res.newMessage,
                    navigation,
                };
            } else {
                Alert.alert('Chuyển tiếp tin nhắn thất bại!');
            }
        } catch (error) {
            console.warn(`[moveMessage] -> ${error}`);
        }
    }
});

export default messageListSlice;
