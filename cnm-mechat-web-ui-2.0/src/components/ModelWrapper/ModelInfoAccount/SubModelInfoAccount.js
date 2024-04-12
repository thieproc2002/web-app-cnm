// libs
import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faPenToSquare, faCamera } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// me
import styles from './ModelInfoAccount.module.scss';
import images from '~/assets/images';
import ModelWrapper from '../ModelWrapper';
import moment from 'moment';
import { Radio } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { userUpdate } from '~/redux/features/user/userSlice';
import { updateAvatar } from '~/redux/features/user/userSlice';
import { userInfoSelector } from '~/redux/selector';

const cx = classNames.bind(styles);

function SubModelInfoAccount({ user }) {
    const [openUpdateInfoAccount, setOpenUpdateInfoAccount] = useState(false);
    const [optionSex, setOptionSex] = useState(user.gender);
    const [birthday, setBirthday] = useState(moment(user.birthday).format('YYYY-MM-DD'));
    const [fullName, setFullName] = useState(user.fullName);
    const infoUser = useSelector(userInfoSelector);
    const [avatar, setAvatar] = useState(user?.avatarLink); //

    useEffect(() => {
        return () => {
            avatar && URL.revokeObjectURL(avatar.previews);
        };
    }, [avatar]);

    const dispatch = useDispatch();

    // Handle open/ close model update info account
    const handleModelOpenUpdateInfoAccount = () => {
        setOpenUpdateInfoAccount(true);
    };
    const handleModelCloseUpdateInfoAccount = () => {
        setOpenUpdateInfoAccount(false);
    };

    // Handle change input full name
    const handleChangeFullName = (e) => {
        setFullName(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // check date
        let birthDay = birthday;
        birthDay = new Date(birthDay).getFullYear();
        let curr = new Date().getFullYear();
        let age = curr - birthDay;

        if (birthDay >= curr) {
            toast.error('Năm sinh phải nhỏ hơn năm hiện tại. Vui lòng thử lại!');
            return;
        }

        if (age < 11) {
            toast.error('Số tuổi cần phải lớn hơn 10. Vui lòng thử lại!');
            return;
        }

        const data = {
            fullName: fullName,
            gender: optionSex,
            birthday: birthday,
            idUser: infoUser._id,
        };
        dispatch(userUpdate(data));
        dispatch(
            updateAvatar({
                _id: infoUser._id,
                avatarLink: avatar,
            }),
        );
        if (userUpdate() || updateAvatar()) {
            toast.success('Cập nhật thông tin thành công');
        }
    };

    const handleChange1 = (e) => {
        setBirthday(e.target.value);
    };

    const handleChange = (e) => {
        const sex = e.target.value;
        if (sex === 'male') {
            setOptionSex(0);
        } else {
            setOptionSex(1);
        }
    };

    //doi avatar
    const handleChangeAvatar = (e) => {
        const file = e.target.files[0];
        file.previews = URL.createObjectURL(file);
        setAvatar(file);
        console.log(file);
    };

    return (
        <>
            <button className={cx('footer-update-btn')} onClick={handleModelOpenUpdateInfoAccount}>
                <FontAwesomeIcon className={cx('footer-update-ic')} icon={faPenToSquare} />
                Cập nhật thông tin
            </button>
            {/* Show model update info account */}
            <ModelWrapper
                className={cx('model-update-info-acc')}
                open={openUpdateInfoAccount}
                onClose={handleModelCloseUpdateInfoAccount}
            >
                <div className={cx('model-info-acc-bg')}>
                    <div className={cx('model-info-acc-header')}>
                        <div className={cx('info-acc-title')}>
                            <span className={cx('acc-title')}>Cập nhật thông tin</span>
                            <button className={cx('close-btn')}>
                                <FontAwesomeIcon
                                    className={cx('acc-close-ic')}
                                    icon={faXmark}
                                    onClick={handleModelCloseUpdateInfoAccount}
                                />
                            </button>
                        </div>
                        <div className={cx('info-acc')}>
                            <div className={cx('sub-info-image')}>
                                {/* Preview bg single */}
                                <img
                                    className={cx('img-cover')}
                                    src={user?.backgroundLink ? user?.backgroundLink : images.noImg}
                                    alt=""
                                />

                                {/* Preview avatar single */}
                                <img
                                    className={cx('sub-img-avatar')}
                                    src={avatar?.previews ? avatar?.previews : avatar}
                                    alt=""
                                />

                                {/* Option change avatar update */}
                                <label htmlFor="file-info" className={cx('option-avatar')}>
                                    <FontAwesomeIcon className={cx('icon-camera')} icon={faCamera} />
                                    <input
                                        className={cx('hide')}
                                        type="file"
                                        id="file-info"
                                        accept=".png, .jpg, .jpeg"
                                        onChange={handleChangeAvatar}
                                    />
                                </label>

                                {/* Option change bg update */}
                                {/* <label htmlFor="file-info-bg" className={cx('option-bg')}>
                                    <FontAwesomeIcon className={cx('icon-camera-bg')} icon={faCamera} />
                                    <input
                                        className={cx('hide')}
                                        type="file"
                                        id="file-info-bg"
                                        accept=".png, .jpg, .jpeg"
                                        // onChange={handleChangeAvatar}
                                    />
                                </label> */}
                            </div>
                        </div>
                    </div>
                    {/* render (map) after */}
                    <div className={cx('model-sub-info-acc-body')}>
                        <div className={cx('model-sub-info-acc')}>
                            <span className={cx('sub-title-desc')}>Tên hiển thị:</span>
                            <input
                                className={cx('sub-input-info-acc')}
                                type="text"
                                value={fullName}
                                onChange={handleChangeFullName}
                            />
                            <span className={cx('sub-desc')}>Sử dụng tên thật để bạn bè dễ dàng nhận diện hơn.</span>
                        </div>

                        <div className={cx('separator')}></div>

                        <div className={cx('model-sub-info-acc')}>
                            <p className={cx('sub-title-info')}>Thông tin cá nhân</p>
                            {/* Gender */}
                            <div className={cx('sub-title-gender')}>
                                <span className={cx('sub-title-desc')}>Giới tính: </span>
                                <div className={cx('gender-radio')}>
                                    <div className={cx('radio-option')}>
                                        <Radio
                                            checked={optionSex === 0}
                                            onChange={handleChange}
                                            value="male"
                                            name="radio-buttons"
                                            inputProps={{ 'aria-label': '0' }}
                                        />
                                        <div className={cx('gender')}>Nam</div>
                                    </div>
                                    <div className={cx('radio-option')}>
                                        <Radio
                                            checked={optionSex === 1}
                                            onChange={handleChange}
                                            value="female"
                                            name="radio-buttons"
                                            inputProps={{ 'aria-label': '1' }}
                                        />
                                        <div className={cx('gender')}>Nữ</div>
                                    </div>
                                </div>
                            </div>
                            {/* Date of birthday */}

                            <div className={cx('sub-title-birthday')}>
                                <span className={cx('sub-title-desc')}>Ngày sinh: </span>
                                <input
                                    className={cx('sub-input-info-acc')}
                                    type="date"
                                    name="requested_order_ship_date"
                                    value={birthday}
                                    onChange={handleChange1}
                                />
                            </div>
                        </div>
                    </div>
                    <div className={cx('model-update-info-acc-footer')}>
                        <button className={cx('footer-sub-close-btn')}>Hủy</button>
                        <button className={cx('footer-sub-update-btn')} onClick={handleSubmit}>
                            Cập nhật
                        </button>
                    </div>
                </div>
            </ModelWrapper>

            {/* Show toast status */}
            <ToastContainer position="top-right" autoClose={4000} closeOnClick={false} />
        </>
    );
}

export default SubModelInfoAccount;
