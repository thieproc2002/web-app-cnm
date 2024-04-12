// libs
import classNames from 'classnames/bind';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

// me
import styles from './Menu.module.scss';
import ModelInfoAccount from '~/components/ModelWrapper/ModelInfoAccount';
import userSlice from '~/redux/features/user/userSlice';

const cx = classNames.bind(styles);

function MenuItem({ user }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    //logout
    const userlogout = () => {
        localStorage.removeItem('user_login');
        dispatch(userSlice.actions.resetUserInfo([]));
        navigate('/login');
    };

    return (
        <>
            <h3 className={cx('fullname')}>{user?.fullName}</h3>

            <div className={cx('separator')}></div>

            <div className={cx('body-inner')}>
                {/* Model info account */}
                <ModelInfoAccount yourProfile user={user} />

                <button className={cx('item-btn')}>Cài đặt</button>
            </div>

            <div className={cx('separator')}></div>

            <div className={cx('footer')}>
                <button className={cx('item-btn')} onClick={userlogout}>
                    Đăng xuất
                </button>
            </div>
        </>
    );
}

export default MenuItem;
