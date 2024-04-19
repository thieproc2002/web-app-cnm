import styles from './ConFirmOTP.module.scss';
import classNames from 'classnames/bind';
import images from '~/assets/images';
import { ArrowLeft } from '@material-ui/icons';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authentication } from '../../util/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { forgetPassWord } from '../../redux/features/user/userSlice';
import { useDispatch } from 'react-redux';

const cx = classNames.bind(styles);
function ConFirmOTP() {
    useEffect(() => {
        document.title = 'Trang xác thực';
    });
    const dispatch = useDispatch();
    const [OTP, setOTP] = useState('');
    const navigate = useNavigate();
    const [counter, setCounter] = useState(60);
    const location = useLocation();
    //dữ liệu tu truyền dki
    const phoneNumber = location.state.phoneNumber;
    const userName = location.state.userName;
    const password = location.state.password;
    //dữ liệu tu truyền quen mk

    //register
    const register = async () => {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}auths/signup`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                fullName: userName,
                phoneNumber: phoneNumber,
                passWord: password,
            }),
        });
        const data = await response.json();
        if (data.status === 'success') {
            console.log(data);
            return data;
        }
        if (data?.error.statusCode === 403) {
            throw new Error('Số điện thoại đã tồn tại');
        }
        if (data?.error.statusCode === 404) {
            throw new Error('Số điện thoại không đúng');
        }
    };
    useEffect(() => {
        const timer = counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
        return () => {
            clearInterval(timer);
        };
    }, [counter]);
    const sign = async () => {
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}auths/login`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                phoneNumber: phoneNumber,
                passWord: password,
            }),
        });
        const resData = await res.json();
        if (resData.status === 'success') {
            return resData;
        } else if (resData?.error.statusCode === 401) {
            throw new Error(401);
        } else if (resData?.error.statusCode === 403) {
            throw new Error(403);
        } else if (resData?.error.statusCode === 402) {
            throw new Error(402);
        }
        // .catch((err) => {
        //     return Promise.reject(new Error('404 else'));
        // });
    };
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
    const handleConfirm = async (e) => {
        e.preventDefault();
        console.log('da click');
        console.log('ngoai if');
        if (counter !== 0) {
            if (OTP.length === 6) {
                console.log('trong if');
                generateRecaptcha();
                if (OTP.length === 6) {
                    console.log('66666');
                    let confirmationResult = window.confirmationResult;
                    confirmationResult
                        .confirm(OTP)
                        .then((result) => {
                            // User signed in successfully.
                            // ...
                            if (typeof userName != 'undefined') {
                                //////////////////////////////////////////////////////////////////////////
                                register().then((token) => {
                                    if (typeof token != 'undefined') {
                                        alert('Đăng ký thành công');
                                        console.log('hoan thanh');
                                        localStorage.setItem('user_login', JSON.stringify(token));
                                        navigate('/addInfoUser', { state: { userName } });
                                    }
                                });
                            } else {
                                const data = {
                                    phoneNumber: phoneNumber,
                                    newPassword: password,
                                };
                                dispatch(forgetPassWord(data));
                                if (forgetPassWord()) {
                                    alert('Đổi mật khẩu thành công');

                                    sign()
                                        .then((token) => {
                                            if (typeof token != 'undefined') {
                                                // alert('Đăng nhập thành công');

                                                localStorage.setItem('user_login', JSON.stringify(token));
                                                navigate('/ChatSE', {
                                                    state: true,
                                                });
                                                setTimeout(() => {
                                                    navigate('/ChatSE');
                                                }, 2000);
                                            }
                                        })
                                        .catch((err) => {
                                            console.log(err);
                                        });
                                }
                            }
                        })
                        .catch((error) => {
                            // User couldn't sign in (bad verification code?)
                            // ...
                            console.log(error);
                            alert('Mã OTP sai');
                        });
                } else {
                    alert('Mã OTP Phải là 6 số');
                }
            }
        } else {
            alert('Hết thời gian xác thực');
        }
    };
    //lấy capcha
    const handleCallBackCode = () => {
        setCounter(60);
        if (phoneNumber.length > 0) {
            generateRecaptcha();
            const phoneNumbers = '+84' + phoneNumber.slice(1);
            console.log(phoneNumber + 'sao khi +84');
            const appVerifier = window.recaptchaVerifier;
            signInWithPhoneNumber(authentication, phoneNumbers, appVerifier)
                .then((confirmationResult) => {
                    // SMS sent. Prompt user to type the code from the message, then sign the
                    // user in with confirmationResult.confirm(code).
                    window.confirmationResult = confirmationResult;
                    console.log('ĐÃ gửi OTP');
                    // ...
                })
                .catch((error) => {
                    // Error; SMS not sent
                    // ...
                    console.log(error);
                    alert('Chưa gửi về OTP');
                    // console.log('Chưa gửi về OTP' + error);
                });
        }
    };
    return (
        <div className={cx('body-login')}>
            <div className={cx('wrapper')}>
                <div className={cx('logo')}>
                    <img className={cx('logo-image')} src={images.logo} alt="" />
                </div>
                <div className={cx('login-title')}>
                    <h1>Xác nhận mã OTP</h1>
                </div>
                <div className={cx('otp-form')}>
                    <form onSubmit={handleConfirm}>
                        <div className={cx('form-otp')}>
                            <input
                                type="tel"
                                placeholder="Nhập mã OTP"
                                value={OTP}
                                onChange={(e) => setOTP(e.target.value)}
                                name="otp"
                            />
                            <p>{counter}</p>
                        </div>
                        <div className={cx('form-button-otp')}>
                            <h5 className={cx('form-resend-code')} onClick={handleCallBackCode}>
                                Gửi lại mã
                            </h5>
                            <button type="submit" variant="contained" color="primary">
                                Xác nhận
                            </button>
                            <div id="tam"></div>
                        </div>
                        <div className={cx('form-back')}>
                            <ArrowLeft className={cx('item')} />{' '}
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
export default ConFirmOTP;
