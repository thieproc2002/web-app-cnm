import { configureStore } from '@reduxjs/toolkit';

// me
import userSlice from './features/user/userSlice';
import userListSlice from './features/user/usersSlice';
import messagesSlice from './features/messages/messagesSlice';
import filterSlice from './features/filter/filterSlice';
import listFriendAccept from './features/friend/friendAcceptSlice';
import updateUserSlice from './features/user/updateUserSlice';
import userCurrents from './features/user/userCurrent';
import friendsSlice from './features/friend/friendsSlice';
import listGroupUsers from './features/Group/GroupSlice';
import friendRequestSlice from './features/friend/friendRequestSlice';
import reportSlice from './features/report/reportSlice';

const store = configureStore({
    reducer: {
        user: userSlice.reducer,
        filters: filterSlice.reducer,
        users: userListSlice.reducer,
        listAccept: listFriendAccept.reducer,
        messages: messagesSlice.reducer,
        updateUser: updateUserSlice.reducer,
        userCurrents: userCurrents.reducer,
        friends: friendsSlice.reducer,
        listGroupUser: listGroupUsers.reducer,
        friendRequests: friendRequestSlice.reducer,
        reportSlice: reportSlice.reducer,
    },
});

export default store;
