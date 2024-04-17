// libs
import classNames from 'classnames/bind';
import { useSelector } from 'react-redux';

// me
import styles from './Rightbar.module.scss';
import images from '~/assets/images';
import Messenger from './Messenger';
import ConversationInfo from './ConversationInfo';
import { conversationSlice } from '~/redux/selector';

const cx = classNames.bind(styles);

function Rightbar({ peer }) {
    const conversation = useSelector(conversationSlice);

    return (
        <div className={cx('wrapper')}>
            {/* Để show ra Chat current -> get theo conversationId */}
            {conversation ? (
                <div className={cx('container')}>
                    <Messenger peer={peer} />
                    <ConversationInfo />
                </div>
            ) : (
                <div className={cx('container-messages')}>
                    <div className={cx('intro')}>
                        <span className={cx('title')}>
                            Chào mừng đến với <b>AloChat PC!</b>
                        </span>
                        <p className={cx('description')}>
                            Khám phá những tiện ích hỗ trợ làm việc và trò chuyện cùng người thân, bạn bè được tối ưu
                            hóa trên máy tính của bạn.
                        </p>
                        <div className={cx('slide-bar-img')}>
                            <img className={cx('logo-img')} src={images.logo} alt="Logo" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Rightbar;
