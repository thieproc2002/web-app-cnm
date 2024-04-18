// lib
import classNames from 'classnames/bind';
import TippyHeadless from '@tippyjs/react/headless';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogleDrive } from '@fortawesome/free-brands-svg-icons';
import {
    faClose,
    faFaceSmile,
    faFile,
    faImage,
    faLock,
    faMicrophone,
    faMicrophoneSlash,
    faPaperclip,
    faPhone,
    faThumbsUp,
    faVideo,
    faVideoSlash,
    faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { CircularProgress } from '@material-ui/core';
import EmojiPicker, { SkinTones } from 'emoji-picker-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Peer from 'simple-peer';

// me
import styles from './Messenger.module.scss';
import Message from '~/components/Message';
import Popper from '~/components/Popper';
import OnlineStatus from '~/components/OnlineStatus';
import socket from '~/util/socket';
import PreviewFileMessage from '~/components/FileMessage/PreviewFileMessage';
import messagesSlice, {
    fetchApiSendMessage,
    fetchApiMessagesByConversationId,
} from '~/redux/features/messages/messagesSlice';
import {
    userLogin,
    userInfoSelector,
    conversationSlice,
    isLoadingMessenger,
    getMessageFromUserInGroupFromSelector,
    findUserOtherInConversationSingle,
} from '~/redux/selector';
import listGroupUsers, { blockMember, cancelBlockMember } from '~/redux/features/Group/GroupSlice';
import ModelWrapper from '~/components/ModelWrapper';
import Webcam from 'react-webcam';
import images from '~/assets/images';

const cx = classNames.bind(styles);

function Messenger({ conversationPhoneBook }) {
    const [newMessage, setNewMessage] = useState('');
    const [newImageMessage, setNewImageMessage] = useState([]);
    const [newFileMessage, setNewFileMessage] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [btnClosePreview, setBtnClosePreview] = useState(false);
    const [previewEmoji, setPreviewEmoji] = useState(false);

    // call video
    const [openCall, setOpenCall] = useState(false);
    const [changeIconVideo, setChangeIconVideo] = useState(false);
    const [changeIconMic, setChangeIconMic] = useState(false);
    const [stream, setStream] = useState();
    const [callAccepted, setCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);

    const dispatch = useDispatch();

    //call video
    const userCurrent = useSelector((state) => state.userCurrents.data);
    const infoUser = useSelector(userLogin);
    const userBlock = useSelector(findUserOtherInConversationSingle);
    const listMessage = useSelector(getMessageFromUserInGroupFromSelector);
    const user = useSelector(userInfoSelector);
    const _conversation = useSelector(conversationSlice);
    const isLoading = useSelector(isLoadingMessenger);

    const conversation = conversationPhoneBook ? conversationPhoneBook : _conversation;

    const infoConversation =
        infoUser._id === conversation?.members[0] ? conversation?.members[1] : conversation?.members[0];

    const myVideo = useRef();
    const userVideo = useRef();
    const connectionRef = useRef();
    const scrollMessenger = useRef();

    // fetch message from conversationId
    useEffect(() => {
        //remove conversation & remove friend => conversation => null
        if (conversation?.id) {
            dispatch(fetchApiMessagesByConversationId(conversation.id));
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [conversation?.id]);

    // realtime change leader
    useEffect(() => {
        socket.on('confirm_change_leader', (request) => {
            dispatch(listGroupUsers.actions.arrivalChangeLeaderInGroupFromSocket(request));
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        socket.on('updated_member_in_group', (info) => {
            dispatch(listGroupUsers.actions.arrivalUpdatedMembersInGroup(info));
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // realtime change name conversation of group
    useEffect(() => {
        socket.on('change_name_conversation_of_group', (_conversation) => {
            dispatch(listGroupUsers.actions.arrivalChangeNameConversationOfGroupFromSocket(_conversation));
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    //realtime change avatar conversation of group
    useEffect(() => {
        socket.on('change_avatar_conversation_of_group', (_conversation) => {
            dispatch(listGroupUsers.actions.arrivalChangeAvatarConversationOfGroupFromSocket(_conversation));
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // realtime with block message user in group
    useEffect(() => {
        socket.on('blocked_message_user', (arrBlocked) => {
            dispatch(listGroupUsers.actions.arrivalBlockMessageUserInGroupFromSocket(arrBlocked));
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // user join room
    useEffect(() => {
        socket.emit('join_room', conversation.id);
        socket.emit('status_user', user._id);

        socket.on('get_users', (users) => {
            // console.log('USER - ONLINE -', users);
            setOnlineUsers(conversation?.members.filter((member) => users.some((us) => us.userId === member)));
        });
    }, [user._id, conversation]);

    // realtime message of receiver
    useEffect(() => {
        socket.on('receiver_message', (message) => {
            dispatch(messagesSlice.actions.arrivalMessageFromSocket(message));
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // realtime re-call message of receiver
    useEffect(() => {
        socket.on('receiver_recall_message', (message) => {
            dispatch(messagesSlice.actions.recallMessageFromSocket(message));
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        socket.on('me', (id) => {
            console.log(id);
        });
    }, []);

    // call video
    useEffect(() => {
        socket.on('endCallToClient', () => {
            console.log('ok----------------', connectionRef);
            setOpenCall(false);
            setCallEnded(true);
            setChangeIconVideo(false);
            connectionRef.current.destroy();
        });
    }, []);
    
    const handleKeyDown = (e) => {
        // Nếu người dùng nhấn phím "Enter" và không giữ phím "Shift"
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // Ngăn chặn việc xuống dòng trong textarea
            handleSendMessage(); // Gửi tin nhắn
        }
    };

    const handleOpenCallVideo = () => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
            setStream(stream);
            myVideo.current.srcObject = stream;
        });
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream: stream,
        });
        peer.on('signal', (data) => {
            socket.emit('callUser', {
                userToCall: infoConversation,
                signalData: data,
                from: infoUser._id,
                name: infoUser.fullName,
            });
        });
        peer.on('stream', (stream) => {
            console.log(stream);
            userVideo.current.srcObject = stream;
        });
        socket.on('callAccepted', (signal) => {
            console.log('da nge diejn', signal);
            setCallAccepted(true);

            peer.signal(signal);
        });

        connectionRef.current = peer;
        setOpenCall(true);
    };
    const handleModelCloseOpenCallVideo = () => {
        connectionRef.current.destroy();

        socket.emit('endCall', { id: infoConversation });
        setOpenCall(false);
        setCallEnded(true);
    };

    const handleChangeIconVideo = () => {
        const tracks = myVideo.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
        myVideo.current.srcObject = null;
        setChangeIconVideo(true);
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

    // handle change message
    const handleChangeMessage = (e) => {
        const mess = e.target.value;

        if (!mess.startsWith(' ')) {
            setNewMessage(mess);
        }
    };

    // handle change image and preview image
    const handleChangeImageMessage = (e) => {
        const files = e.target.files;
        const listImg = [];

        [...files].forEach((file) => {
            listImg.push({
                data: file,
                preview: URL.createObjectURL(file),
            });
        });

        setNewImageMessage(listImg);
        setBtnClosePreview(true); // !btnClosePreview
    };

    // handle change file
    const handleChangeFileMessage = (e) => {
        const file = e.target.files[0];

        file.previewFile = URL.createObjectURL(file);

        setNewFileMessage(file);
        setBtnClosePreview(true); // !btnClosePreview
    };

    // cleanup func
    useEffect(() => {
        return () => {
            newImageMessage && URL.revokeObjectURL(newImageMessage.preview);
        };
    }, [newImageMessage]);

    useEffect(() => {
        return () => {
            newFileMessage && URL.revokeObjectURL(newFileMessage.previewFile);
        };
    }, [newFileMessage]);

    // handle preview emoji
    const handlePreviewEmoji = () => {
        setPreviewEmoji(true);
    };

    const handleEmojiClicked = (emojiObj, e) => {
        let emojis = emojiObj.emoji;
        const _message = [...newMessage, emojis];

        setNewMessage(_message.join(''));
    };

    // handle button send message
    const handleSendMessage = async (e) => {
        // e.preventDefault();

        // check size file
        if (newFileMessage?.size / 1024 / 1024 > 5 || newImageMessage?.size / 1024 / 1024 > 5) {
            toast.error('Xin lỗi, file của bạn vượt quá 5 MB. Vui lòng chọn file khác để gửi!');
            return;
        }

        dispatch(
            fetchApiSendMessage({
                conversationID: conversation.id,
                senderID: user._id,
                content: newMessage.emoji ? newMessage.emoji : newMessage,
                imageLinks: newImageMessage,
                fileLink: newFileMessage,
            }),
        );

        setNewMessage('');
        setNewImageMessage([]);
        setNewFileMessage(null);
        setBtnClosePreview(false);
    };

    const handleSendFlastLikeMessage = async (e) => {
        e.preventDefault();

        dispatch(
            fetchApiSendMessage({
                conversationID: conversation.id,
                senderID: user._id,
                content: '👍',
                imageLinks: newImageMessage,
                fileLink: newFileMessage,
            }),
        );

        setNewMessage('');
        setNewImageMessage([]);
        setNewFileMessage(null);
        setBtnClosePreview(false);
    };

    // handle close preview
    const handleClosePreview = () => {
        setNewImageMessage([]);
        setNewFileMessage(null);
        setBtnClosePreview(false);
    };

    // scroll messenger
    useEffect(() => {
        conversation && listMessage && scrollMessenger.current?.scrollIntoView({ behavior: 'smooth' });
    }, [conversation, listMessage]);

    // handle blocked message user
    const handleBlockedSingle = () => {
        let choice = window.confirm(`Bạn có chắc chắn muốn chặn tin nhắn của ${conversation.name} không?`);

        if (choice === true) {
            const data = {
                conversationId: conversation.id,
                userId: userBlock.find((block) => block !== user._id), // userBlock
            };

            dispatch(blockMember(data));
            toast.success(`Bạn đã chặn tin nhắn với ${conversation.name}.`);
        } else {
            toast.info('Bạn đã hủy chặn tin nhắn.');
        }
    };

    // handle un-blocked message user
    const handleUnBlockedSingle = () => {
        let choice = window.confirm(`Bạn có chắc chắn muốn bỏ chặn tin nhắn của ${conversation.name} không?`);

        if (choice === true) {
            const data = {
                conversationId: conversation.id,
                userId: userBlock.find((block) => block !== user._id),
            };

            dispatch(cancelBlockMember(data));
            toast.success(`Bạn đã bỏ chặn tin nhắn với ${conversation.name}.`);
        } else {
            toast.info(`Bạn không muốn bỏ chặn tin nhắn với ${conversation.name}.`);
        }
    };

    return (
        <div className={cx('messenger')}>
            <div className={cx('messenger-header')}>
                {/* Online user (status) */}

                <OnlineStatus onlineUsers={onlineUsers} conversation={conversation} />

                <div>
                    <Tippy className={cx('tool-tip')} content="Cuộc gọi video" delay={[200, 0]}>
                        <button className={cx('btn-click-icon')} onClick={handleOpenCallVideo}>
                            <FontAwesomeIcon className={cx('icon')} icon={faVideo} />
                        </button>
                    </Tippy>

                    {/* block single */}
                    {conversation.isGroup ? null : (
                        <>
                            {conversation?.blockBy?.includes(userBlock.find((block) => block !== user._id)) ? (
                                <button className={cx('un-blocked-single')} onClick={handleUnBlockedSingle}>
                                    Bỏ chặn
                                </button>
                            ) : (
                                <Tippy
                                    className={cx('tool-tip')}
                                    content={`Chặn tin nhắn của ${conversation.name}`}
                                    delay={[200, 0]}
                                >
                                    <button className={cx('blocked-single')} onClick={handleBlockedSingle}>
                                        <FontAwesomeIcon icon={faLock} />
                                    </button>
                                </Tippy>
                            )}
                        </>
                    )}
                </div>
            </div>
            {/* Call video */}

            <ModelWrapper className={cx('model-add-friend')} open={openCall} onClose={handleModelCloseOpenCallVideo}>
                <div className={cx('model-add-group-bg')}>
                    <div className={cx('add-friend-title')}>
                        <span className={cx('friend-title')}>Alo.Chat Call - {userCurrent?.fullName}</span>
                        <button className={cx('close-btn-close-video-call')}>
                            <FontAwesomeIcon
                                className={cx('friend-close-ic')}
                                icon={faXmark}
                                onClick={handleModelCloseOpenCallVideo}
                            />
                        </button>
                    </div>
                    <div className={cx('camera-callVideo')}>
                        <div className={cx('video-container')}>
                            {callAccepted && !callEnded ? (
                                <>
                                    <div className={cx('video')}>
                                        {stream && (
                                            <Webcam
                                                className={cx('video-webcam-2')}
                                                playsInline
                                                ref={myVideo}
                                                autoPlay
                                            />
                                        )}
                                        {stream && (
                                            <Webcam
                                                className={cx('video-webcam-2')}
                                                playsInline
                                                ref={userVideo}
                                                autoPlay
                                            />
                                        )}
                                    </div>
                                </>
                            ) : (
                                <div className={cx('video')}>
                                    {stream && !changeIconVideo ? (
                                        <div className={cx('avatar-backgroud')}>
                                            <Webcam className={cx('video-webcam')} playsInline ref={myVideo} autoPlay />

                                            <div className={cx('avatar-sub')}>
                                                <img
                                                    className={cx('avatar-img-sub')}
                                                    src={
                                                        userCurrent?.avatarLink ? userCurrent?.avatarLink : images.noImg
                                                    }
                                                    alt="avatar"
                                                />
                                            </div>
                                            <div className={cx('user-call')}>Đang đổ chuông ...</div>
                                        </div>
                                    ) : (
                                        <div className={cx('avatar-backgroud')}>
                                            <img
                                                className={cx('avatar-img')}
                                                src={infoUser?.avatarLink ? infoUser?.avatarLink : images.noImg}
                                                alt="avatar"
                                            />

                                            <div className={cx('avatar-sub')}>
                                                <img
                                                    className={cx('avatar-img-sub')}
                                                    src={
                                                        userCurrent?.avatarLink ? userCurrent?.avatarLink : images.noImg
                                                    }
                                                    alt="avatar"
                                                />
                                            </div>
                                            <div className={cx('user-call')}>Đang đổ chuông ...</div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
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
                </div>
            </ModelWrapper>

            {/* onScroll={handleLoadingMessagesLast} */}
            <div className={cx('messenger-body')}>
                {/* Messages */}
                {isLoading ? (
                    <CircularProgress className={cx('loading-messages')} />
                ) : (
                    <>
                        {listMessage.map((message) => {
                            return (
                                <div key={message?._id} ref={scrollMessenger}>
                                    <Message
                                        message={message}
                                        own={message?.senderID === user?._id}
                                        conversation={conversation}
                                        // user={user}
                                    />
                                </div>
                            );
                        })}
                    </>
                )}
            </div>

            {/* Message conversation */}
            {conversation?.blockBy?.includes(infoUser._id) ? (
                <>
                    {conversation.isGroup ? (
                        <div className={cx('Block')}>
                            <h2>Bạn đã bị chặn nhắn tin bởi Trưởng nhóm...</h2>
                        </div>
                    ) : (
                        <div className={cx('Block')}>
                            <h2>Bạn đã bị chặn nhắn tin bởi {conversation.name}...</h2>
                        </div>
                    )}
                </>
            ) : (
                <>
                    <div className={cx('messenger-footer')}>
                        <div className={cx('toolbar-on-chat-input')}>
                            {/* option image */}
                            <label htmlFor="file">
                                <div className={cx('option-image-icon')}>
                                    <Tippy
                                        className={cx('tool-tip')}
                                        content="Gửi hình ảnh hoặc video"
                                        delay={[200, 0]}
                                    >
                                        <FontAwesomeIcon className={cx('option-icon')} icon={faImage} />
                                    </Tippy>
                                    <input
                                        className={cx('hide')}
                                        type="file"
                                        id="file"
                                        accept=".png, .jpg, .jpeg, .mov, .mp4"
                                        onChange={handleChangeImageMessage}
                                        multiple
                                    />
                                </div>
                            </label>
                            {/* option file */}
                            <TippyHeadless
                                render={(attrs) => (
                                    <div tabIndex="-1" {...attrs}>
                                        {/* Sub menu option footer */}
                                        <Popper className={cx('menu-option-file')}>
                                            <>
                                                <label htmlFor="files">
                                                    <div className={cx('option-file-btn-fix')}>
                                                        <FontAwesomeIcon
                                                            className={cx('sub-menu-icon-footer')}
                                                            icon={faFile}
                                                        />
                                                        Chọn File
                                                        <input
                                                            className={cx('hide')}
                                                            type="file"
                                                            id="files"
                                                            accept=".docx, .pptx, .pdf, .xlsx"
                                                            onChange={handleChangeFileMessage}
                                                        />
                                                    </div>
                                                </label>
                                                <button className={cx('option-file-btn')}>
                                                    <FontAwesomeIcon
                                                        className={cx('sub-menu-icon-footer')}
                                                        icon={faGoogleDrive}
                                                    />
                                                    Gửi File từ Google Driver
                                                </button>
                                            </>
                                        </Popper>
                                    </div>
                                )}
                                delay={[0, 100]}
                                placement="top-start"
                                trigger="click"
                                interactive
                            >
                                <Tippy className={cx('tool-tip')} content="Đính kèm File" delay={[200, 0]}>
                                    <div className={cx('option-file-icon')}>
                                        <FontAwesomeIcon className={cx('option-icon')} icon={faPaperclip} />
                                    </div>
                                </Tippy>
                            </TippyHeadless>
                        </div>
                        <div className={cx('message-container')}>
                            {/* Input message */}
                            {/* const blockMembers = useSelector(filterBlockMembers); infoUser */}
                            {/*  ? ( */}

                            <textarea
                                className={cx('message-input')}
                                value={
                                    newMessage && newMessage.emoji?.join('')
                                        ? newMessage && newMessage.emoji?.join('')
                                        : newMessage.emoji?.join('')
                                        ? newMessage.emoji?.join('')
                                        : newMessage
                                }
                                onChange={handleChangeMessage}
                                onKeyDown={handleKeyDown}
                                placeholder="Nhập tin nhắn ..."
                            ></textarea>

                            {/* Preview emoji */}
                            <TippyHeadless
                                render={(attrs) => (
                                    <div tabIndex="-1" {...attrs}>
                                        <Popper>
                                            {previewEmoji && (
                                                <div className={cx('display-preview-emoji')}>
                                                    <EmojiPicker
                                                        onEmojiClick={handleEmojiClicked}
                                                        defaultSkinTone={SkinTones}
                                                        width={300}
                                                    />
                                                </div>
                                            )}
                                        </Popper>
                                    </div>
                                )}
                                delay={[0, 100]}
                                trigger="click"
                                interactive
                                appendTo={document.body}
                            >
                                <button className={cx('preview-emoji')} onClick={handlePreviewEmoji}>
                                    <Tippy className={cx('tool-tip')} content="Biểu cảm" delay={[200, 0]}>
                                        <FontAwesomeIcon className={cx('icon-right')} icon={faFaceSmile} />
                                    </Tippy>
                                </button>
                            </TippyHeadless>
                            {/* Button send message || chosenEmoji*/}
                            {newMessage || newImageMessage.length !== 0 || newFileMessage ? (
                                <button className={cx('send-message-btn')} onClick={handleSendMessage}>
                                    GỬI
                                </button>
                            ) : (
                                <Tippy
                                    className={cx('tool-tip')}
                                    content="Gửi nhanh biểu tượng cảm xúc"
                                    delay={[200, 0]}
                                >
                                    <button className={cx('send-message-like')} onClick={handleSendFlastLikeMessage}>
                                        <FontAwesomeIcon icon={faThumbsUp} />
                                    </button>
                                </Tippy>
                            )}

                            {/* Show toast status */}
                            <ToastContainer position="top-right" autoClose={4000} closeOnClick={false} />
                        </div>

                        {/* Preview upload Image and Video */}
                        <div className={cx('preview-upload')}>
                            {btnClosePreview && (
                                <button className={cx('close-btn')} onClick={handleClosePreview}>
                                    <FontAwesomeIcon icon={faClose} className={cx('close-icon')} />
                                </button>
                            )}

                            {newImageMessage.length > 0 ? (
                                <div>
                                    {newImageMessage.map((img, index) => {
                                        return (
                                            <>
                                                {img.data.name.split('.')[img.data.name.split('.').length - 1] ===
                                                'mp4' ? (
                                                    <video
                                                        className={cx('image-upload')}
                                                        key={index}
                                                        src={img.preview}
                                                        alt="video"
                                                        controls
                                                    />
                                                ) : (
                                                    <img
                                                        className={cx('image-upload')}
                                                        key={index}
                                                        src={img.preview}
                                                        alt="preview-img"
                                                    />
                                                )}
                                            </>
                                        );
                                    })}
                                </div>
                            ) : null}

                            {/* file message */}
                            {newFileMessage && <PreviewFileMessage newFileMessage={newFileMessage} />}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default Messenger;
