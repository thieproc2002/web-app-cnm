// lib
import classNames from 'classnames/bind';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// me
import styles from './AddFriend.module.scss';
import { addFriendRequest, addFriendRequestAccept, searchFilterFriend, userLogin } from '~/redux/selector';
import filterSlice from '~/redux/features/filter/filterSlice';
import useDebounce from '../hooks/useDebounce';
import { usersRemainingSelector } from '~/redux/selector';
import {
    fetchApiAcceptRequestFriend,
    fetchApiRecallRequestAddFriend,
    friendRequests,
} from '~/redux/features/friend/friendRequestSlice';

const cx = classNames.bind(styles);
function AddFriend() {
    const [searchPhone, setSearchPhone] = useState('');
    const [searchResult, setSearchResult] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState([]);
    const debouncedValue = useDebounce(searchPhone, 500);
    const userSearching = useSelector(usersRemainingSelector);
    const infoUser = useSelector(userLogin);
    const searchFilterFriends = useSelector(searchFilterFriend);
    const listMeRequest = useSelector(addFriendRequest);
    const listRequestFriend = useSelector(addFriendRequestAccept);
    console.log('listRequestFriend', listRequestFriend);
    const meRequest = listMeRequest.filter((friend) => friend.receiverId.includes(phoneNumber._id));
    const friendRequest = listRequestFriend.filter((friend) => friend.senderId.includes(phoneNumber._id));
    console.log('friendRequest', friendRequest);
    const dispatch = useDispatch();

    // Handle open/ close model info account
    useEffect(() => {
        dispatch(filterSlice.actions.searchFilterChange(searchPhone));
    }, [debouncedValue]);

    const handleSearch = (e) => {
        e.preventDefault();

        if (searchPhone === infoUser.phoneNumber) {
            toast.info('Số điện thoại này là tài khoản của bạn!');
        } else {
            if (userSearching && userSearching !== 1) {
                setSearchResult(true);
                setPhoneNumber(userSearching[0]);
            } else {
                toast.error('Số điện thoại này không tồn tại hoặc chưa được đăng ký tài khoản. Vui lòng thử lại!');
            }
        }
    };
    const handleBtnClearText = (e) => {
        setSearchPhone('');
        setPhoneNumber('');
        setSearchResult(false);
        dispatch(filterSlice.actions.searchFilterChange(null));
    };
    const handleRequest = () => {
        const data = { senderID: infoUser._id, receiverID: phoneNumber._id };

        let tam = dispatch(friendRequests(data));

        if (tam) {
            toast.success('Gửi lời mời kết bạn thành công.');
            setSearchPhone('');
            setPhoneNumber('');
            dispatch(filterSlice.actions.searchFilterChange(null));
            setSearchResult(false);
        }
    };
    // thu hoi ket ban
    const handleCallback = () => {
        const data = {
            status: true,
            senderID: infoUser._id,
            idRequest: meRequest[0].idFriendRequest,
        };
        dispatch(fetchApiRecallRequestAddFriend(data));

        toast.success('Bạn đã thu hồi lời mời kết bạn.');
    };
    //handleAccept
    const handleAccept = () => {
        const data = {
            status: true,
            senderID: friendRequest[0].senderId,
            receiverID: infoUser._id,
            idRequest: friendRequest[0].idFriendRequest,
        };

        dispatch(fetchApiAcceptRequestFriend(data));

        if (fetchApiAcceptRequestFriend()) {
            toast.success('Chấp nhận kết bạn thành công.');
        } else {
            toast.error('Số điện thoại chưa đăng ký tài khoản!');
        }
    };
    return (
        <div>
            <div className={cx('add-phoneNumber')}>
                <input
                    type="text"
                    placeholder="Số điện thoại"
                    value={searchPhone}
                    onChange={(e) => setSearchPhone(e.target.value)}
                />
                {!!searchPhone && (
                    <button className={cx('clear-btn1')} onClick={handleBtnClearText}>
                        <FontAwesomeIcon className={cx('clear-icon')} icon={faCircleXmark} />
                    </button>
                )}
            </div>

            {!!searchResult ? (
                <div className={cx('list-conversation')}>
                    <img className={cx('avatar-img')} src={phoneNumber.avatar} alt="avatar" />

                    <div className={cx('content')}>
                        <h4 className={cx('username')}>{phoneNumber.fullName}</h4>
                        <p className={cx('message')}>{phoneNumber.phoneNumber}</p>
                    </div>
                    {searchFilterFriends === true ? (
                        <>
                            {meRequest?.length !== 0 ? (
                                <div className={cx('result-add-friend')}>
                                    <button onClick={handleCallback}>Thu hồi</button>
                                </div>
                            ) : (
                                <>
                                    {friendRequest?.length !== 0 ? (
                                        <div className={cx('result-add-friend')}>
                                            <button onClick={handleAccept}>Chấp nhận</button>
                                        </div>
                                    ) : (
                                        <div className={cx('result-add-friend')}>
                                            <button onClick={handleRequest}>Kết bạn</button>
                                        </div>
                                    )}
                                </>
                            )}
                        </>
                    ) : (
                        <div className={cx('result-friend')}>
                            <p>Bạn bè</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className={cx('tam')}></div>
            )}
            <div className={cx('add-friend-bottom')}>
                <div className={cx('bottom-button')}>
                    <button className={cx('cancel')} onClick={handleBtnClearText}>
                        Hủy
                    </button>
                    <button className={cx('search')} onClick={handleSearch}>
                        Tìm kiếm
                    </button>
                </div>
            </div>

            {/* Show toast status */}
            <ToastContainer position="top-right" autoClose={4000} closeOnClick={false} />
        </div>
    );
}
export default AddFriend;
