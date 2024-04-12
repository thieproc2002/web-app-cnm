import classNames from 'classnames/bind';

// me
import styles from './Boxchat.module.scss';
import images from '~/assets/images';
const cx = classNames.bind(styles);
function BoxChat(group) {
    return (
        <div
            className={cx('list-boxchat')}
        >
            <img
                className={cx('avatar-img')}
                src={group.group.imageLinkOfConver ? group.group.imageLinkOfConver : images.noImg}
                alt="avatar"
            />
            <div className={cx('box-name')}>
                <h1>{group.group.name}</h1>
            </div>
            <div className={cx('box-number')}>
                <h1>{group.group.members.length} thành viên</h1>
            </div>
        </div>
    );
}
export default BoxChat;
