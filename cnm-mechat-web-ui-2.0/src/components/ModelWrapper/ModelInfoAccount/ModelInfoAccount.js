// libs
import classNames from 'classnames/bind';
import { useState } from 'react';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faUser } from '@fortawesome/free-solid-svg-icons';
// me
import styles from './ModelInfoAccount.module.scss';
import ModelWrapper from '~/components/ModelWrapper';
import SubModelInfoAccount from './SubModelInfoAccount';
import images from '~/assets/images';

const cx = classNames.bind(styles);

function ModelInfoAccount({ yourProfile, user, friend, ConversationInfo, seenInfoInGroup }) {
    const [openInfoAccount, setOpenInfoAccount] = useState(false);

    // Handle open/ close model info account
    const handleModelOpenInfoAccount = () => {
        setOpenInfoAccount(true);
    };
    const handleModelCloseInfoAccount = () => {
        setOpenInfoAccount(false);
    };

    return (
        <>
            {seenInfoInGroup ? (
                <>{/* <button onClick={handleModelOpenInfoAccount} className={cx('tam')}></button> */}</>
            ) : (
                <>
                    {ConversationInfo ? (
                        <img
                            className={cx('img-avatar-ConversationInfo')}
                            src={user?.avatarLink ? user?.avatarLink : images.noImg}
                            alt="img-avatar"
                            onClick={handleModelOpenInfoAccount}
                        />
                    ) : (
                        <>
                            {yourProfile ? (
                                <button className={cx('item-btn')} onClick={handleModelOpenInfoAccount}>
                                    {friend ? 'Xem thông tin' : ' Hồ sơ của bạn'}
                                </button>
                            ) : (
                                <>
                                    <FontAwesomeIcon className={cx('setting-icon')} icon={faUser} />
                                    <button className={cx('setting-item-btn')} onClick={handleModelOpenInfoAccount}>
                                        Thông tin tài khoản
                                    </button>
                                </>
                            )}
                        </>
                    )}
                </>
            )}

            <ModelWrapper className={cx('model-info-acc')} open={openInfoAccount} onClose={handleModelCloseInfoAccount}>
                <div className={cx('model-info-acc-bg')}>
                    <div className={cx('model-info-acc-header')}>
                        <div className={cx('info-acc-title')}>
                            <span className={cx('acc-title')}>Thông tin tài khoản</span>
                            <button className={cx('close-btn')}>
                                <FontAwesomeIcon
                                    className={cx('acc-close-ic')}
                                    icon={faXmark}
                                    onClick={handleModelCloseInfoAccount}
                                />
                            </button>
                        </div>
                        <div className={cx('info-acc')}>
                            <div className={cx('info-image')}>
                                <img
                                    className={cx('img-cover')}
                                    src={user?.backgroundLink ? user?.backgroundLink : images.noImg}
                                    alt="img-cover"
                                />
                                <img
                                    className={cx('img-avatar')}
                                    src={user?.avatarLink ? user?.avatarLink : images.noImg}
                                    alt="img-avatar"
                                />
                            </div>
                            <div className={cx('info-name')}>
                                <div className={cx('name')}>{user?.fullName}</div>
                            </div>
                        </div>
                    </div>
                    {/* render (map) after */}
                    <div className={cx('model-info-acc-body')}>
                        <div className={cx('info-desc-title')}>Thông tin cá nhân</div>
                        <div className={cx('info-desc-line')}>
                            <div className={cx('info-title')}>Điện thoại: </div>
                            <div>{user?.phoneNumber}</div>
                        </div>
                        <div className={cx('info-desc-line')}>
                            <div className={cx('info-title')}>Giới tính: </div>
                            <div>{user?.gender === 0 ? 'Nam' : 'Nữ'}</div>
                        </div>
                        <div className={cx('info-desc-line')}>
                            <div className={cx('info-title')}>Ngày sinh: </div>
                            <div>{moment(user?.birthday).format('DD/MM/YYYY')}</div>
                        </div>
                    </div>

                    <div className={cx('model-info-acc-footer')}>
                        {/* model update info account */}
                        {friend || ConversationInfo ? null : <SubModelInfoAccount user={user} />}
                    </div>
                </div>
            </ModelWrapper>
        </>
    );
}

export default ModelInfoAccount;
