// libs
import classNames from 'classnames/bind';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Peer from 'simple-peer';
// me
import styles from './Home.module.scss';
import Sidebar from '~/layouts/components/Sidebar';
import Center from '~/layouts/components/Middle';
import Rightbar from '~/layouts/components/Rightbar';
import userSlice, { fetchApiUser } from '~/redux/features/user/userSlice';
import socket from '~/util/socket';

import { useState } from 'react';
import { userInfoSelector, userLogin } from '~/redux/selector';
import ModelWrapper from '~/components/ModelWrapper';
import {
    faMicrophone,
    faMicrophoneSlash,
    faPhone,
    faVideo,
    faVideoSlash,
    faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { infoUserConversation } from '~/redux/features/user/userCurrent';
import images from '~/assets/images';
import { useRef } from 'react';
import Webcam from 'react-webcam';

const cx = classNames.bind(styles);

function Home() {
    //Da doi qua ben app.js
    const dispatch = useDispatch();
    const [openCall, setOpenCall] = useState(false);
    const user = useSelector(userInfoSelector);
    const [caller, setCaller] = useState('');
    const [name, setName] = useState('');
    const connectionRef = useRef();

    const [callAccepted, setCallAccepted] = useState(false);
    const [stream, setStream] = useState();
    const userVideo = useRef();
    const myVideo = useRef();
    const [callerSignal, setCallerSignal] = useState();
    const [callEnded, setCallEnded] = useState(false);
    const [showFooter, setShowFooter] = useState(false);
    const [changeIconVideo, setChangeIconVideo] = useState(false);
    const [changeIconMic, setChangeIconMic] = useState(false);

    const navigate = useNavigate();

    const infoUser = useSelector(userLogin);

    useEffect(() => {
        if (user?.status === false) {
            setTimeout(() => {
                toast.warning('Tài khoản của bạn đã bị khóa vì vi phạm chính sách của chúng tôi nhiều lần!');
            }, 1000);

            localStorage.removeItem('user_login');
            dispatch(userSlice.actions.resetUserInfo([]));
            navigate('/login');
        } else if (user?.warning > 0) {
            toast.warning(
                `Bạn đã vi phạm chính sách của chúng tôi ${user.warning} lần. Vui lòng kiểm soát hoạt động của mình, xin cảm ơn!`,
            );
            return;
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigate, user]);

    useEffect(() => {
        document.title = 'ChatSE Web';
    }, []);

    useEffect(() => {
        dispatch(fetchApiUser());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        socket.emit('status_user', user?._id);
    }, [user?._id]);

    // useEffect(() => {
    //     notificationAddMemberInGroup && toast.info('Bạn đã được thêm vào nhóm.');
    // }, [notificationAddMemberInGroup]);

    useEffect(() => {
        socket.on('callUser', (data) => {
            if (data) {
                setOpenCall(true);
                setCaller(data.from);
                setName(data.name);
                setCallerSignal(data.signal);
                dispatch(
                    infoUserConversation({
                        userID: data.from,
                    }),
                );
            } else {
                alert('loi');
            }
        });
    }, []);

    useEffect(() => {
        socket.on('endCall', () => {
            console.log('okokokokokEncallll');
            setOpenCall(false);
            setShowFooter(false);
            setChangeIconVideo(false);
            setCallAccepted(false);
            setCallEnded(false);

            connectionRef.current.destroy();
        });
    }, []);

    const handleChangeIconVideo = () => {
        const tracks = userVideo.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
        myVideo.current.srcObject = null;
        setChangeIconVideo(true);
    };
    const handleModelCloseOpenCallVideo = () => {
        connectionRef.current.destroy();
        console.log('caller', caller);
        socket.emit('endCallToClient', { id: caller });
        setOpenCall(false);
        setShowFooter(false);
        setChangeIconVideo(false);
        setCallAccepted(false);
        setCallEnded(false);
    };
    const handleRefuseCall = () => {
        setOpenCall(false);
        socket.emit('endCallToClient', { id: caller });
        setOpenCall(false);
        setShowFooter(false);
        setChangeIconVideo(false);
        setCallAccepted(false);
        setCallEnded(false);
        connectionRef.current.destroy();
    };
    const handleReceiveCall = () => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
            console.log('peer1111111111111111', stream);
            setStream(stream);
            myVideo.current.srcObject = stream;
        });
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream: stream,
        });
        console.log('---------', peer);
        peer.on('signal', (data) => {
            console.log('133-----', data);
            socket.emit('answerCall', { signal: data, to: caller });
        });
        peer.on('stream', (streams) => {
            userVideo.current.srcObject = streams;
            console.log('138--------', streams);
        });
        connectionRef.current = peer;
        peer.signal(callerSignal);

        setCallAccepted(true);

        setShowFooter(true);
    };
    const handleChangeIconOpenvideo = () => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
            setStream(stream);
            myVideo.current.srcObject = stream;
        });
        setChangeIconVideo(false);
    };

    const handleChangeIconMic = () => {
        setChangeIconMic(true);
    };
    const handleChangeIconOpenMic = () => {
        setChangeIconMic(false);
    };
    return (
        <>
            <div className={cx('wrapper')}>
                <Sidebar />
                <Center />
                <Rightbar />
            </div>

            <ModelWrapper className={cx('model-add-friend')} open={openCall} onClose={handleModelCloseOpenCallVideo}>
                <div className={cx('model-add-group-bg')}>
                    <div className={cx('add-friend-title')}>
                        <span className={cx('friend-title')}>ChatSE Call - {name}</span>
                        <button className={cx('close-btn')}>
                            <FontAwesomeIcon
                                className={cx('friend-close-ic')}
                                icon={faXmark}
                                onClick={handleModelCloseOpenCallVideo}
                            />
                        </button>
                    </div>

                    {callAccepted && !callEnded ? (
                        <>
                            {!changeIconVideo ? (
                                <div className={cx('video')}>
                                    <Webcam playsInline ref={myVideo} autoPlay />
                                    <Webcam playsInline ref={userVideo} autoPlay />
                                </div>
                            ) : (
                                <img
                                    className={cx('avatar-img')}
                                    src={infoUser?.avatarLink ? infoUser?.avatarLink : images.noImg}
                                    alt="avatar"
                                />
                            )}
                        </>
                    ) : (
                        <>
                            {' '}
                            <div className={cx('avatar-sub')}>
                                <img
                                    className={cx('avatar-img-sub')}
                                    // src={userCurrents?.avatarLink ? userCurrents?.avatarLink : images.noImg}
                                    src={user?.avatarLink}
                                    alt="avatar"
                                />
                            </div>
                            <div className={cx('user-call')}>ChatSE Cuộc gọi video đến</div>
                        </>
                    )}

                    {!showFooter ? (
                        <div className={cx('footer-video')}>
                            <div className={cx('footer-icon')}>
                                <FontAwesomeIcon
                                    className={cx('footer-callVideo-icon')}
                                    icon={faPhone}
                                    onClick={handleRefuseCall}
                                />
                            </div>
                            <div className={cx('footer-icon-1')}>
                                <FontAwesomeIcon
                                    className={cx('footer-callVideo-icon-1')}
                                    icon={faVideo}
                                    onClick={handleReceiveCall}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className={cx('footer-callVideo')}>
                            {!changeIconVideo ? (
                                <FontAwesomeIcon
                                    className={cx('footer-callVideo-icon-2')}
                                    icon={faVideo}
                                    onClick={handleChangeIconVideo}
                                />
                            ) : (
                                <FontAwesomeIcon
                                    className={cx('footer-callVideo-icon-2')}
                                    icon={faVideoSlash}
                                    onClick={handleChangeIconOpenvideo}
                                />
                            )}

                            <div className={cx('footer-icon')}>
                                <FontAwesomeIcon
                                    className={cx('footer-callVideo-icon')}
                                    icon={faPhone}
                                    onClick={handleModelCloseOpenCallVideo}
                                />
                            </div>

                            {!changeIconMic ? (
                                <FontAwesomeIcon
                                    className={cx('footer-callVideo-icon-3')}
                                    icon={faMicrophone}
                                    onClick={handleChangeIconMic}
                                />
                            ) : (
                                <FontAwesomeIcon
                                    className={cx('footer-callVideo-icon-3')}
                                    icon={faMicrophoneSlash}
                                    onClick={handleChangeIconOpenMic}
                                />
                            )}
                        </div>
                    )}
                </div>
            </ModelWrapper>

            {/* Show toast status */}
            <ToastContainer position="top-right" autoClose={4000} closeOnClick={false} />
        </>
    );
}

export default Home;
