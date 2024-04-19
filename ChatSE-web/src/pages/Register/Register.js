//lib
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PhoneIphone, Lock, Person, ArrowLeft, CheckBox } from '@material-ui/icons';
import classNames from 'classnames/bind';
//me
import styles from './Register.module.scss';
import images from '~/assets/images';
import { authentication } from '~/util/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { useDispatch, useSelector } from 'react-redux';
import useDebounce from '~/components/hooks/useDebounce';
import filterSlice from '~/redux/features/filter/filterSlice';
import { accountExists } from '~/redux/selector';
import ModelWrapper from '~/components/ModelWrapper';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const cx = classNames.bind(styles);

function Register() {
    useEffect(() => {
        document.title = 'Trang đăng ký';
    });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const debouncedValue = useDebounce(phoneNumber, 500);
    const searchAccountExists = useSelector(accountExists);

    // bat loi
    // const [check, setCheck] = useState(false);
    const [errorUserName, setErrorUserName] = useState('');
    const [errorPhoneNumber, setErrorPhoneNumber] = useState('');
    const [errorPassword, setErrorPassword] = useState('');
    const [errorConfirmPassword, setErrorConfirmPassword] = useState('');

    //chínhach
    const [openPolyci, setOpenPolyci] = useState(false);
    const [checkPolyci, setcheckPolyci] = useState(false);

    // useEffect(() => {
    //     dispatch(filterSlice.actions.searchFilterChange(phoneNumber));
    // }, [debouncedValue]);

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
        // var vnf_regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
        if (userName === '' && phoneNumber === '' && password === '' && confirmPassword === '') {
            setErrorUserName('Vui lòng nhập đầy đủ thông tin');
            setErrorPhoneNumber('Vui lòng nhập đầy đủ thông tin');
            setErrorPassword('Vui lòng nhập đầy đủ thông tin');
            setErrorConfirmPassword('Vui lòng nhập đầy đủ thông tin');
        } else if (userName === '') {
            setErrorUserName('Vui lòng nhập họ tên');
        } else if (phoneNumber === '') {
            setErrorPhoneNumber('Vui lòng nhập số điện thoại');
        } else if (password === '') {
            setErrorPassword('Vui lòng nhập mật khẩu');
        } else if (confirmPassword === '') {
            setErrorConfirmPassword('Vui lòng nhập xác nhận mật khẩu');
        } else if (password !== confirmPassword) {
            setErrorConfirmPassword('Mật khẩu không trùng khớp');
        } else if (checkPolyci === false) {
            alert('bạn chưa cam kết chính sách');
        } else {
            generateRecaptcha();
            const phoneNumbers = '+84' + phoneNumber.slice(1);
            const appVerifier = window.recaptchaVerifier;
            signInWithPhoneNumber(authentication, phoneNumbers, appVerifier)
                .then((confirmationResult) => {
                    // SMS sent. Prompt user to type the code from the message, then sign the
                    // user in with confirmationResult.confirm(code).

                    window.confirmationResult = confirmationResult;

                    // ...
                    navigate('/ConFirmOTP', { state: { userName, phoneNumber, password } });
                })
                .catch((error) => {
                    // Error; SMS not sent
                    // ...
                    //alert('Tài khoản đã yêu cầu quá nhiều lần!!!');
                    console.log('Chưa gửi về OTP ' + error);
                });
        }
    };

    // bat loi
    useEffect(() => {
        var number = /^[0-9]{10}$/;
        var phoneNumberForm = /^(09|03|07|08|05)\d{4}\d{4}$/;
        if (phoneNumber.length === 10) {
            if (!number.test(phoneNumber)) {
                setErrorPhoneNumber('Số điện thoại phải là số và đủ 10 số');
            } else if (!phoneNumberForm.test(phoneNumber)) {
                setErrorPhoneNumber('Số điện thoại không đúng');
            } else if (searchAccountExists !== 1) {
                setErrorPhoneNumber('Số điện thoại đã được đăng ký');
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
    }, [password]);
    useEffect(() => {
        if (userName.length > 0) {
            setErrorUserName('');
        }
        if (confirmPassword.length > 0) {
            setErrorConfirmPassword('');
        }
    }, [confirmPassword, userName]);

    ///chinh sách

    const handleModelCloseOpenPolyci = () => {
        setOpenPolyci(false);
    };
    const handleModelOpenPolyci = () => {
        setOpenPolyci(true);
    };
    const handleCheck = (e) => {
        if (e.target.checked === true) {
            setcheckPolyci(true);
            console.log(checkPolyci);
        } else {
            setcheckPolyci(false);
            console.log(checkPolyci);
        }
    };
    return (
        <div className={cx('body-register')}>
            <div className={cx('wrapper')}>
                <div className={cx('logo')}>
                    <img className={cx('logo-image')} src={images.logo} alt="" />
                </div>
                <div className={cx('login-title')}>
                    <h1>Đăng Ký</h1>
                </div>

                <div className={cx('register-form')}>
                    <form onSubmit={handleSubmitForm}>
                        <div className={cx('form-phoneNumber')}>
                            <PhoneIphone className={cx('item')} />
                            <input
                                type="text"
                                placeholder="Số điện thoại"
                                name="phoneNumber"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                            {/* {check === true ? <Check className={cx('item-check')} /> : null} */}
                        </div>
                        <span className={cx('error')}>{errorPhoneNumber}</span>
                        <div className={cx('form-user')}>
                            <Person className={cx('item')} />
                            <input
                                type="text"
                                placeholder="Tên người dùng"
                                name="userName"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                            />
                            {/* <Check className={cx('item-check')} /> */}
                        </div>
                        <span className={cx('error')}>{errorUserName}</span>
                        <div className={cx('form-password')}>
                            <Lock className={cx('item')} />
                            <input
                                type="password"
                                placeholder="Mật khẩu"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {/* <Check className={cx('item-check')} /> */}
                        </div>
                        <span className={cx('error')}>
                            <p>{errorPassword}</p>
                        </span>
                        <div className={cx('form-password')}>
                            <Lock className={cx('item')} />
                            <input
                                type="password"
                                placeholder="Nhập lại mật khẩu"
                                name="enterPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            {/* <Check className={cx('item-check')} /> */}
                        </div>
                        <span className={cx('error')}>{errorConfirmPassword}</span>
                        <div className={cx('policy')}>
                            <input type="checkBox" value={checkPolyci} onChange={handleCheck} />
                            <p onClick={handleModelOpenPolyci}>Bạn đồng ý với chính sách của chúng tôi </p>
                        </div>
                        <ModelWrapper
                            className={cx('model-add-friend')}
                            open={openPolyci}
                            onClose={handleModelCloseOpenPolyci}
                        >
                            <div className={cx('model-add-group-bg')}>
                                <div className={cx('add-friend-title')}>
                                    <span className={cx('friend-title')}>Chính sách ChatSE</span>
                                    <button className={cx('close-btn')}>
                                        <FontAwesomeIcon
                                            className={cx('friend-close-ic')}
                                            icon={faXmark}
                                            onClick={handleModelCloseOpenPolyci}
                                        />
                                    </button>
                                </div>
                                <div className={cx('content-polyci')}>
                                    <h5 className={cx('content-polyci-title')}> Chính sách sử dụng của ChatSE</h5>
                                    <p>
                                        Các chính sách của chúng tôi đóng vai trò quan trọng trong việc duy trì trải
                                        nghiệm tích cực cho người dùng. Vui lòng tuân thủ các chính sách này khi sử dụng
                                        Mechat.
                                    </p>
                                    <h4>Hành vi gian lận, lừa đảo và các hình thức lừa dối khác</h4>
                                    <p>
                                        Không dùng ứng dụng Mechat cho mục đích lừa đảo. Không yêu cầu hoặc thu thập dữ
                                        liệu nhạy cảm, thông tin tài chính và số an sinh xã hội. Không dùng ứng dụng
                                        MeChat để lừa những người dùng khác chia sẻ thông tin vì những lý do bịa đặt.
                                    </p>
                                    <p>
                                        Không mạo danh người khác hoặc cung cấp thông tin không đúng về bản thân hoặc về
                                        nguồn gốc của tin nhắn hay cuộc gọi trong Mechat.
                                    </p>
                                    <h4>Hành vi quấy rối </h4>
                                    <p>
                                        Không dùng ứng dụng MeChat để quấy rối, đe dọa hoặc dọa dẫm người khác. Không
                                        xúi giục người khác tham gia thực hiện hành vi này.
                                    </p>
                                    <h4>Thông tin cá nhân và thông tin bí mật</h4>
                                    <p>
                                        Không phát tán thông tin cá nhân và thông tin bí mật của người khác, chẳng hạn
                                        như số thẻ tín dụng, số an sinh xã hội hoặc mật khẩu tài khoản, khi họ chưa cho
                                        phép.
                                    </p>
                                    <h4>Hoạt động bất hợp pháp </h4>
                                    <p>
                                        Không dùng ứng dụng MeChat để quảng bá, tổ chức hoặc tham gia các hoạt động bất
                                        hợp pháp
                                    </p>
                                    <h4>
                                        Mọi hành vi trên nếu bị phát hiện hoặc người dùng tố cáo thì sẽ bị cảnh cáo hoặc
                                        khóa tài khoản. Nên vui lòng cân nhắc mục đích sử dụng ứng dụng trước khi dùng.{' '}
                                    </h4>
                                </div>
                            </div>
                        </ModelWrapper>
                        <div className={cx('form-button')}>
                            <button type="submit" variant="contained" color="primary">
                                ĐĂNG KÝ
                            </button>
                            <div id="tam"></div>
                        </div>
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
export default Register;
