import styles from './ForgetPassWord.module.scss';
import classNames from 'classnames/bind';
import images from '~/assets/images';
import { Link, useNavigate } from 'react-router-dom';
import { PhoneIphone, Lock, ArrowLeft } from '@material-ui/icons';
import { useEffect, useState } from 'react';
import { accountExists } from '~/redux/selector';
import { useDispatch, useSelector } from 'react-redux';
import useDebounce from '~/components/hooks/useDebounce';
import filterSlice from '~/redux/features/filter/filterSlice';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { authentication } from '~/util/firebase';
const cx = classNames.bind(styles);
function ForgetPassWord() {
    useEffect(() => {
        document.title = 'Trang quên mật khẩu';
    });
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [show, setShow] = useState(false);
    //
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const searchAccountExists = useSelector(accountExists);
    const debouncedValue = useDebounce(phoneNumber, 500);

    //loi
    const [errorPhoneNumber, setErrorPhoneNumber] = useState('');
    const [errorPassWord, setErrorPassword] = useState('');
    const [errorConfirmPassWord, setErrorConfirmPassWord] = useState('');
    useEffect(() => {
        dispatch(filterSlice.actions.searchFilterChange(phoneNumber));
    }, [debouncedValue]);
    const generateRecaptcha = () => {
        window.recaptchaVerifier = new RecaptchaVerifier(
            'tam',
            {
                size: 'invisible',
                callback: (response) => {},
            },
            authentication,
        );
    };
    const handleSubmitForm = (e) => {
        e.preventDefault();
        if (password === '' && confirmPassword === '') {
            setErrorPassword('Vui lòng nhập đầy đủ thông tin');
            setErrorConfirmPassWord('Vui lòng nhập đầy đủ thông tin');
        } else if (password !== confirmPassword) {
            setErrorConfirmPassWord('Mật khẩu không trùng khớp');
        } else {
            generateRecaptcha();
            const phoneNumbers = '+84' + phoneNumber.slice(1);
            console.log(phoneNumbers + 'sao khi +84');
            const appVerifier = window.recaptchaVerifier;
            signInWithPhoneNumber(authentication, phoneNumbers, appVerifier)
                .then((confirmationResult) => {
                    // SMS sent. Prompt user to type the code from the message, then sign the
                    // user in with confirmationResult.confirm(code).

                    window.confirmationResult = confirmationResult;
                    console.log('ĐÃ gửi OTP');
                    // ...
                    navigate('/ConFirmOTP', { state: { phoneNumber, password } });
                })
                .catch((error) => {
                    // Error; SMS not sent
                    // ...
                    alert('Tài khoản đã yêu cầu quá nhiều lần!!!');
                    console.log('Chưa gửi về OTP' + error);
                });
        }
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        var phoneNumberForm = /^(09|03|07|08|05)\d{4}\d{4}$/;
        var number = /^[0-9]{10}$/;

        if (phoneNumber === '') {
            setErrorPhoneNumber('Vui lòng nhập số điện thoại');
        } else if (searchAccountExists !== 1) {
            setShow(true);
        } else {
            setShow(false);
            setErrorPhoneNumber('Số điện thoại chưa đăng ký tài khoảng');
        }
    };
    //loi
    useEffect(() => {
        var number = /^[0-9]{10}$/;
        var phoneNumberForm = /^(09|03|07|08|05)\d{4}\d{4}$/;
        if (phoneNumber.length >= 10) {
            if (!number.test(phoneNumber)) {
                setErrorPhoneNumber('Số điện thoại phải là số và đủ 10 số');
            } else if (!phoneNumberForm.test(phoneNumber)) {
                setErrorPhoneNumber('Số điện thoại không đúng');
            } else {
                setErrorPhoneNumber('');
            }
        }
    }, [phoneNumber]);
    useEffect(() => {
        var mk = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
        if (password.length > 5) {
            if (!mk.test(password)) {
                setErrorPassword('Mật khẩu phải lớn 8 ký tự 1 ký tự viết hoa, 1 ký tự viết thường và số');
            } else {
                setErrorPassword('');
            }
        }
        if (confirmPassword > 0) {
            setErrorConfirmPassWord('');
        }
    }, [password, confirmPassword]);
    const handleCancel = () => {
        setPhoneNumber('');
        setPassword('');
        setConfirmPassword('');
        setErrorPassword('');
        setErrorConfirmPassWord('');
        setShow(false);
    };
    return (
        <div className={cx('body-forget')}>
            <div className={cx('wrapper')}>
                <div className={cx('logo')}>
                    <img className={cx('logo-image')} src={images.logo} alt="" />
                </div>
                <div className={cx('login-title')}>
                    <h1>Khôi phục mật khẩu</h1>
                </div>

                <div className={cx('forget-form')}>
                    <form onSubmit={handleSubmitForm}>
                        <div className={cx('form-phoneNumber')}>
                            <PhoneIphone className={cx('item')} />
                            {show === false ? (
                                <input
                                    type="text"
                                    placeholder="Số điện thoại"
                                    name="phoneNumber"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                />
                            ) : (
                                <input
                                    type="text"
                                    placeholder="Số điện thoại"
                                    name="phoneNumber"
                                    value={phoneNumber}
                                    disabled
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                />
                            )}
                        </div>
                        <span className={cx('error')}>{errorPhoneNumber}</span>
                        {show === true ? (
                            <>
                                <div className={cx('form-password')}>
                                    <Lock className={cx('item')} />
                                    <input
                                        type="password"
                                        placeholder="Mật khẩu mới"
                                        name="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <span className={cx('error')}>
                                    <p>{errorPassWord}</p>
                                </span>
                            </>
                        ) : null}
                        {show === true ? (
                            <>
                                <div className={cx('form-password')}>
                                    <Lock className={cx('item')} />
                                    <input
                                        type="password"
                                        placeholder="Nhập lại mật khẩu mới"
                                        name="enterPassword"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>
                                <span className={cx('error')}>{errorConfirmPassWord}</span>
                            </>
                        ) : null}
                        {show === true ? (
                            <div className={cx('form-button')}>
                                <button variant="contained" className={cx('cancel')} onClick={handleCancel}>
                                    Hủy
                                </button>
                                <button type="submit" variant="contained" color="primary" className={cx('confirm')}>
                                    Xác nhận
                                </button>

                                <div id="tam"></div>
                            </div>
                        ) : (
                            <div className={cx('form-button')}>
                                <button variant="contained" color="primary" onClick={handleSubmit}>
                                    Kiểm tra
                                </button>
                                <div id="tam"></div>
                            </div>
                        )}
                        <div className={cx('form-back')}>
                            <ArrowLeft className={cx('item-back')} />
                            <Link to="/" className={cx('back')}>
                                Quay lại
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
export default ForgetPassWord;
