// lib
import classNames from 'classnames/bind';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// me
import styles from './FriendRequestList.module.scss';
import images from '~/assets/images';
import { useDispatch, useSelector } from 'react-redux';
import { userLogin } from '~/redux/selector';
import { fetchApiAcceptRequestFriend, fetchApiExitRequestFriend } from '~/redux/features/friend/friendRequestSlice';
import { fetchApiRecallRequestAddFriend } from '~/redux/features/friend/friendRequestSlice';

const cx = classNames.bind(styles);

function FriendRequestList({ user, isPhoneBook }) {
    const dispatch = useDispatch();
    const infoUser = useSelector(userLogin);

    // realtime socket
    // useEffect(() => {}, []);

    const handleAccept = () => {
        const data = {
            status: true,
            senderID: user.senderId,
            receiverID: infoUser._id,
            idRequest: user.idFriendRequest,
        };

        dispatch(fetchApiAcceptRequestFriend(data));

        if (fetchApiAcceptRequestFriend()) {
            toast.success('Chấp nhận kết bạn thành công.');
        } else {
            toast.error('Số điện thoại chưa đăng ký tài khoản!');
        }
    };

    const handleCancel = () => {
        const data = {
            status: false,
            senderID: user.senderId,
            receiverID: infoUser._id,
            idRequest: user.idFriendRequest,
        };

        dispatch(fetchApiExitRequestFriend(data));

        if (fetchApiExitRequestFriend()) {
            toast.success('Từ chối kết bạn thành công.');
        } else {
            toast.error('Từ chối kết bạn thất bại');
        }
    };

    const handleCallback = () => {
        const data = {
            status: true,
            senderID: infoUser._id,
            idRequest: user.idFriendRequest,
        };

        dispatch(fetchApiRecallRequestAddFriend(data));
        toast.success('Bạn đã thu hồi lời mời kết bạn.');
    };
    return (
        <div className={cx('content')}>
            <div className={cx('request-List')}>
                <img className={cx('avatar-img')} src={user.imageLink ? user.imageLink : images.noImg} alt="avatar" />
                <div className={cx('content-2')}>
                    <p className={cx('username')}>{user.fullName}</p>
                    <p className={cx('message-1')}>Muốn kết bạn</p>
                    <p className={cx('message')}>{user.content}</p>
                </div>
                {isPhoneBook ? (
                    <div className={cx('relay')}>
                        <p className={cx('skip')} onClick={handleCancel}>
                            Bỏ qua
                        </p>
                        <button onClick={handleAccept}>Đồng ý</button>
                    </div>
                ) : (
                    <div className={cx('relay')}>
                        <button onClick={handleCallback}>Thu hồi</button>
                    </div>
                )}
            </div>

            {/* Show toast status */}
            <ToastContainer position="top-right" closeOnClick={false} />
        </div>
    );
}
export default FriendRequestList;
