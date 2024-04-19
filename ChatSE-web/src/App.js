// libs
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// me
import Home from './pages/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import PhoneBook from './pages/PhoneBook/PhoneBook';
import ConFirmOTP from './pages/ConFirmOTP';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { fetchUsers } from './redux/features/user/usersSlice';
import { fetchApiUser } from './redux/features/user/userSlice';
import { friendAccept } from './redux/features/friend/friendRequestSlice'; // friendAcceptSlice
import { meRequestFriend } from './redux/features/friend/friendRequestSlice';
import ForgetPassWord from './pages/Login/ForgetPassWord';
import { listGroupUser } from './redux/features/Group/GroupSlice';
import AddInfoUser from './pages/AddInfoUser';

function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchUsers());
        dispatch(fetchApiUser());
        dispatch(friendAccept());
        dispatch(meRequestFriend());
        dispatch(listGroupUser());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <Router>
            <Routes>
                {/* Register */}
                <Route path="/register" element={<Register />} />
                <Route path="/addInfoUser" element={<AddInfoUser />} />

                {/* Login */}
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Navigate replace to="/login" />} />

                {/* Home page */}
                <Route exact path="/ChatSE" element={<Home />} />

                {/* Confirm otp */}
                <Route path="/confirmotp" element={<ConFirmOTP />} />

                {/* PhoneBook */}
                <Route path="/phonebook" element={<PhoneBook />} />
                <Route path="/forget-password" element={<ForgetPassWord />} />
            </Routes>
        </Router>
    );
}

export default App;
