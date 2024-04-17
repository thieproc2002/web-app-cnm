// libs
import classNames from 'classnames/bind';
import TippyHeadless from '@tippyjs/react/headless';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faGear,
    faFloppyDisk,
    faAngleRight,
    faGlobe,
    faCircleInfo,
    faRightFromBracket,
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
// me
import styles from './Menu.module.scss';
import images from '~/assets/images';
import Popper from '~/components/Popper';
import ModelWrapper from '~/components/ModelWrapper';
import ModelInfoAccount from '~/components/ModelWrapper/ModelInfoAccount';
import { useDispatch } from 'react-redux';
import userSlice from '~/redux/features/user/userSlice';

const cx = classNames.bind(styles);

function MenuItem({ user }) {
    const [openIntroVersion, setOpenIntroVersion] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Handle open/ close model intro version
    const handleModelOpenIntroVersion = () => {
        setOpenIntroVersion(true);
    };
    const handleModelCloseIntroVersion = () => {
        setOpenIntroVersion(false);
    };

    // Menu popper sub language
    const renderMenuPopperSubLanguage = () => {
        return (
            <>
                <div className={cx('setting-option')}>
                    <button className={cx('setting-item-btn')}>Tiếng Việt</button>
                </div>
                <div className={cx('setting-option')}>
                    <button className={cx('setting-item-btn')}>Tiếng Anh</button>
                </div>
            </>
        );
    };
    //logout
    const userlogout = () => {
        localStorage.removeItem('user_login');
        dispatch(userSlice.actions.resetUserInfo([]));
        navigate('/login');
    };
    // Menu popper sub intro
    const renderMenuPopperSubIntroVersion = () => {
        return (
            <>
                <div className={cx('setting-option')}>
                    <button className={cx('setting-item-btn')} onClick={handleModelOpenIntroVersion}>
                        Thông tin phiên bản
                    </button>
                    {/* Model intro */}
                    <ModelWrapper
                        className={cx('model-intro')}
                        open={openIntroVersion}
                        onClose={handleModelCloseIntroVersion}
                    >
                        <>
                            <div className={cx('model-intro-header')}>
                                <h1 className={cx('model-intro-header-name')}>Chat Web</h1>
                                <img className={cx('model-intro-header-img')} src={images.logo} alt="logo-mechat" />
                            </div>
                            <div className={cx('model-intro-body')}>
                                <div className={cx('info-desc-title')}>Liên hệ hỗ trợ</div>
                                <div className={cx('info-desc-line')}>
                                    <div className={cx('info-title')}>Tổng đài: </div>
                                    <div>19001789</div>
                                </div>
                                <div className={cx('info-desc-line')}>
                                    <div className={cx('info-title')}>Email: </div>
                                    <div>chathelp@gmail.com</div>
                                </div>
                                <div className={cx('info-desc-line')}>
                                    <div className={cx('info-title')}>Website: </div>
                                    <div>https://alo.chat/pc</div>
                                </div>
                            </div>
                        </>
                    </ModelWrapper>
                </div>
                <div className={cx('setting-option')}>
                    <button className={cx('setting-item-btn')}>Trung tâm hỗ trợ</button>
                </div>
            </>
        );
    };

    return (
        <>
            <div className={cx('setting-header')}>
                <div className={cx('setting-option')}>
                    {/* Model info account */}
                    <ModelInfoAccount user={user} />
                </div>
                <div className={cx('setting-option')}>
                    <FontAwesomeIcon className={cx('setting-icon')} icon={faGear} />
                    <button className={cx('setting-item-btn')}>Cài đặt</button>
                </div>
            </div>

            <div className={cx('separator')}></div>

            <div className={cx('setting-body')}>
                <div className={cx('setting-list')}>
                    {/* Popper Menu children */}
                    <TippyHeadless
                        render={(attrs) => (
                            <div tabIndex="-1" {...attrs}>
                                <Popper className={cx('menu-popper-sub-file')}>
                                    <div className={cx('setting-option')}>
                                        <button className={cx('setting-item-btn')}>Quản lý file</button>
                                    </div>
                                </Popper>
                            </div>
                        )}
                        delay={[0, 100]}
                        offset={[16, 0]}
                        placement="right-end"
                        hideOnClick={false}
                        interactive
                    >
                        <div className={cx('setting-option')}>
                            <FontAwesomeIcon className={cx('setting-icon')} icon={faFloppyDisk} />
                            <button className={cx('setting-item-btn')}>Lưu trữ</button>
                            <div className={cx('icon-right')}>
                                <FontAwesomeIcon className={cx('setting-icon')} icon={faAngleRight} />
                            </div>
                        </div>
                    </TippyHeadless>
                </div>

                <div className={cx('setting-list')}>
                    {/* Popper Menu children */}
                    <TippyHeadless
                        render={(attrs) => (
                            <div tabIndex="-1" {...attrs}>
                                <Popper className={cx('menu-popper-sub-language')}>
                                    {renderMenuPopperSubLanguage()}
                                </Popper>
                            </div>
                        )}
                        delay={[0, 100]}
                        offset={[46, 0]}
                        placement="right-end"
                        hideOnClick={false}
                        interactive
                    >
                        <div className={cx('setting-option')}>
                            <FontAwesomeIcon className={cx('setting-icon')} icon={faGlobe} />
                            <button className={cx('setting-item-btn')}>Ngôn ngữ</button>
                            <div className={cx('icon-right')}>
                                <FontAwesomeIcon className={cx('setting-icon')} icon={faAngleRight} />
                            </div>
                        </div>
                    </TippyHeadless>
                </div>

                <div className={cx('setting-list')}>
                    {/* Popper Menu children */}
                    <TippyHeadless
                        render={(attrs) => (
                            <div tabIndex="-1" {...attrs}>
                                <Popper className={cx('menu-popper-sub-intro')}>
                                    {renderMenuPopperSubIntroVersion()}
                                </Popper>
                            </div>
                        )}
                        delay={[0, 100]}
                        offset={[46, 0]}
                        placement="right-end"
                        hideOnClick={false}
                        interactive
                    >
                        <div className={cx('setting-option')}>
                            <FontAwesomeIcon className={cx('setting-icon')} icon={faCircleInfo} />
                            <button className={cx('setting-item-btn')}>Giới thiệu</button>
                            <div className={cx('icon-right')}>
                                <FontAwesomeIcon className={cx('setting-icon')} icon={faAngleRight} />
                            </div>
                        </div>
                    </TippyHeadless>
                </div>
            </div>

            <div className={cx('separator')}></div>

            <div className={cx('footer')}>
                <div className={cx('setting-option')}>
                    <FontAwesomeIcon className={cx('setting-icon')} icon={faRightFromBracket} />
                    <button className={cx('setting-item-btn')} onClick={userlogout}>
                        Đăng xuất
                    </button>
                </div>
            </div>
        </>
    );
}

export default MenuItem;
