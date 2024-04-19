// libs
import classNames from 'classnames/bind';
import TippyHeadless from '@tippyjs/react/headless';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import moment from 'moment';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp } from '@fortawesome/free-regular-svg-icons';
import { faCopy, faEllipsis, faRepeat, faShare, faTrash, faFlag } from '@fortawesome/free-solid-svg-icons';

// me
import styles from './Message.module.scss';
import Popper from '../Popper';
import MessageItem from './MessageItem';
import { fetchApiDeleteMessage, fetchApiRecallMessage } from '~/redux/features/messages/messagesSlice';
import ModelWrapper from '../ModelWrapper';
import MoveMessage from './MoveMessage';
import Report from '../Report';
import { userInfoSelector } from '~/redux/selector';

const cx = classNames.bind(styles);

function Message({ message, own, conversation }) {
    const [showConversations, setShowConversation] = useState(false);
    const [openReport, setOpenReport] = useState(false);

    const dispatch = useDispatch();

    const user = useSelector(userInfoSelector);

    // handle delete message
    const handleDeleteMessage = async () => {
        dispatch(
            fetchApiDeleteMessage({
                messageId: message._id,
                userId: user._id, //message.user._id
            }),
        );
    };

    // handle re-call message
    const handleRecallMessage = async () => {
        dispatch(
            fetchApiRecallMessage({
                messageId: message._id,
                conversationID: conversation.id, // conversation.id
            }),
        );
    };

    // show model conversation
    const handleShowModelConversation = () => {
        setShowConversation(true);
    };

    // handle report clicked
    const handleReportClick = () => {
        setOpenReport(true);
    };

    const handleModelCloseReport = () => {
        setOpenReport(false);
    };

    return (
        <>
            {own ? (
                <div className={cx('own')}>
                    <div className={cx('message-top')}>
                        {/* Menu parent */}
                        <TippyHeadless
                            render={(attrs) => (
                                <div tabIndex="-1" {...attrs}>
                                    <Popper className={cx('own-menu-list')}>
                                        <div className={cx('options')}>
                                            {/* <Tippy
                                                className={cx('tool-tip')}
                                                content="Báo cáo tin nhắn"
                                                delay={[200, 0]}
                                            >
                                                <button className={cx('option-btn')} onClick={handleReportClick}>
                                                    <FontAwesomeIcon className={cx('option-icon')} icon={faFlag} />
                                                </button>
                                            </Tippy> */}

                                            {/* Show report */}
                                            <ModelWrapper
                                                className={cx('model-report')}
                                                open={openReport}
                                                onClose={handleModelCloseReport}
                                            >
                                                <>
                                                    <Report message={message} />
                                                </>
                                            </ModelWrapper>

                                            <Tippy className={cx('tool-tip')} content="Chia sẻ" delay={[200, 0]}>
                                                <button
                                                    className={cx('option-btn')}
                                                    onClick={handleShowModelConversation}
                                                >
                                                    <FontAwesomeIcon className={cx('option-icon')} icon={faShare} />
                                                </button>
                                            </Tippy>
                                            {/* show model conversations */}
                                            <ModelWrapper
                                                className={cx('model-conversations')}
                                                open={showConversations}
                                                onClose={() => setShowConversation(!showConversations)}
                                            >
                                                <>
                                                    <MoveMessage message={message} />
                                                </>
                                            </ModelWrapper>

                                            {/* Menu children */}
                                            <TippyHeadless
                                                render={(attrs) => (
                                                    <div tabIndex="-1" {...attrs}>
                                                        <Popper className={cx('own-menu-list-children')}>
                                                            <button className={cx('options-children-copy-btn')}>
                                                                <FontAwesomeIcon
                                                                    className={cx('copy-icon')}
                                                                    icon={faCopy}
                                                                />
                                                                Coppy tin nhắn
                                                            </button>

                                                            <div className={cx('separator')}></div>

                                                            <button
                                                                className={cx('options-children-btn')}
                                                                onClick={handleRecallMessage}
                                                            >
                                                                <FontAwesomeIcon
                                                                    className={cx('recall-icon')}
                                                                    icon={faRepeat}
                                                                />
                                                                Thu hồi
                                                            </button>
                                                            <button
                                                                className={cx('options-children-btn')}
                                                                onClick={handleDeleteMessage}
                                                            >
                                                                <FontAwesomeIcon
                                                                    className={cx('recall-icon')}
                                                                    icon={faTrash}
                                                                />
                                                                Xóa
                                                            </button>
                                                        </Popper>
                                                    </div>
                                                )}
                                                interactive
                                                trigger="click"
                                                placement="bottom-start"
                                                offset={[4, 4]}
                                            >
                                                <Tippy className={cx('tool-tip')} content="Thêm" delay={[200, 0]}>
                                                    <button className={cx('option-btn')}>
                                                        <FontAwesomeIcon
                                                            className={cx('option-icon')}
                                                            icon={faEllipsis}
                                                        />
                                                    </button>
                                                </Tippy>
                                            </TippyHeadless>
                                        </div>
                                        {/* Button like (:hover) */}
                                        <button className={cx('option-btn')}>
                                            <FontAwesomeIcon className={cx('like-icon')} icon={faThumbsUp} />
                                        </button>
                                    </Popper>
                                </div>
                            )}
                            interactive
                            placement="bottom-end"
                            offset={[-90, -18]} // -74, -18
                            delay={[200, 100]}
                            appendTo={() => document.body}
                        >
                            {/* render message (sender) */}
                            <div className={cx('display-container')}>
                                {message?.action ? (
                                    <div className={cx('display-action')}>
                                        <p className={cx('text-action')}>
                                            {message?.action} lúc:
                                            {moment(message.createdAt).format('h:mm a - DD/MM/YYYY')}
                                        </p>
                                    </div>
                                ) : (
                                    <div className={cx('display-action-none')}>
                                        {message?.deleteBy.length === 0 && (
                                            <div className={cx('display-group-preview-image')}>
                                                <MessageItem message={message} own={own} />
                                            </div>
                                        )}
                                        {message?.deleteBy.length === 0 && (
                                            <>
                                                {conversation.isGroup === true ? (
                                                    <img
                                                        className={cx('message-top-img')}
                                                        src={message.user.avatarLink}
                                                        alt="avatar"
                                                    />
                                                ) : (
                                                    <img
                                                        className={cx('message-top-img')}
                                                        src={message.user.avatarLink}
                                                        alt="avatar"
                                                    />
                                                )}
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        </TippyHeadless>
                    </div>
                    {message?.deleteBy.length === 0 && (
                        <>
                            {!message?.action && (
                                <span className={cx('message-bottom')}>
                                    {moment(message.createdAt).format('h:mm a')}
                                </span>
                            )}
                        </>
                    )}
                </div>
            ) : (
                <div className={cx('wrapper')}>
                    <div className={cx('message-top')}>
                        {/* Menu parent */}
                        <TippyHeadless
                            render={(attrs) => (
                                <div tabIndex="-1" {...attrs}>
                                    <Popper className={cx('own-menu-list')}>
                                        <div className={cx('options')}>
                                            <Tippy
                                                className={cx('tool-tip')}
                                                content="Báo cáo tin nhắn"
                                                delay={[200, 0]}
                                            >
                                                <button className={cx('option-btn')} onClick={handleReportClick}>
                                                    <FontAwesomeIcon className={cx('option-icon')} icon={faFlag} />
                                                </button>
                                            </Tippy>

                                            {/* Show report */}
                                            <ModelWrapper
                                                className={cx('model-report')}
                                                open={openReport}
                                                onClose={handleModelCloseReport}
                                            >
                                                <>
                                                    <Report message={message} />
                                                </>
                                            </ModelWrapper>

                                            <Tippy className={cx('tool-tip')} content="Chia sẻ" delay={[200, 0]}>
                                                <button
                                                    className={cx('option-btn')}
                                                    onClick={handleShowModelConversation}
                                                >
                                                    <FontAwesomeIcon className={cx('option-icon')} icon={faShare} />
                                                </button>
                                            </Tippy>
                                            {/* show model conversations */}
                                            <ModelWrapper
                                                className={cx('model-conversations')}
                                                open={showConversations}
                                                onClose={() => setShowConversation(!showConversations)}
                                            >
                                                <>
                                                    <MoveMessage message={message} />
                                                </>
                                            </ModelWrapper>

                                            {/* Menu children */}
                                            <TippyHeadless
                                                render={(attrs) => (
                                                    <div tabIndex="-1" {...attrs}>
                                                        <Popper className={cx('own-menu-list-children')}>
                                                            <button className={cx('options-children-copy-btn')}>
                                                                <FontAwesomeIcon
                                                                    className={cx('copy-icon')}
                                                                    icon={faCopy}
                                                                />
                                                                Coppy tin nhắn
                                                            </button>

                                                            <div className={cx('separator')}></div>

                                                            <button className={cx('options-children-btn')}>
                                                                <FontAwesomeIcon
                                                                    className={cx('recall-icon')}
                                                                    icon={faRepeat}
                                                                />
                                                                Thu hồi
                                                            </button>
                                                            <button className={cx('options-children-btn')}>
                                                                <FontAwesomeIcon
                                                                    className={cx('recall-icon')}
                                                                    icon={faTrash}
                                                                />
                                                                Xóa
                                                            </button>
                                                        </Popper>
                                                    </div>
                                                )}
                                                interactive
                                                trigger="click"
                                                placement="bottom-start"
                                                offset={[-2, 4]}
                                            >
                                                <Tippy className={cx('tool-tip')} content="Thêm" delay={[200, 0]}>
                                                    <button className={cx('option-btn')}>
                                                        <FontAwesomeIcon
                                                            className={cx('option-icon')}
                                                            icon={faEllipsis}
                                                        />
                                                    </button>
                                                </Tippy>
                                            </TippyHeadless>
                                        </div>
                                        {/* Button like (:hover) */}
                                        <button className={cx('option-btn')}>
                                            <FontAwesomeIcon className={cx('like-icon-receiver')} icon={faThumbsUp} />
                                        </button>
                                    </Popper>
                                </div>
                            )}
                            interactive
                            placement="bottom-start"
                            offset={[90, -20]} // 74, -18
                            delay={[200, 100]}
                            appendTo={() => document.body}
                        >
                            {/* render message (sender) */}
                            <div className={cx('display-container')}>
                                {message?.action ? (
                                    <div className={cx('display-action')}>
                                        <p className={cx('text-action')}>
                                            {message?.action} lúc:
                                            {moment(message.createdAt).format('h:mm a - DD/MM/YYYY')}
                                        </p>
                                    </div>
                                ) : (
                                    <div className={cx('display-action-none-receiver')}>
                                        {message?.deleteBy.length > 0 && (
                                            <>
                                                {conversation.isGroup === true ? (
                                                    <img
                                                        className={cx('message-top-img')}
                                                        src={message?.user.avatarLink}
                                                        alt="avatar"
                                                    />
                                                ) : (
                                                    <img
                                                        className={cx('message-top-img')}
                                                        src={message?.user?.avatarLink}
                                                        alt="avatar"
                                                    />
                                                )}
                                            </>
                                        )}
                                        {message?.deleteBy.length === 0 && (
                                            <>
                                                {conversation.isGroup === true ? (
                                                    <img
                                                        className={cx('message-top-img')}
                                                        src={message?.user.avatarLink}
                                                        alt="avatar"
                                                    />
                                                ) : (
                                                    <img
                                                        className={cx('message-top-img')}
                                                        src={message?.user?.avatarLink}
                                                        alt="avatar"
                                                    />
                                                )}
                                            </>
                                        )}
                                        <div>
                                            {/* {message?.deleteBy.length === 0 && ( */}
                                            <div className={cx('display-group-preview-image-receiver')}>
                                                <MessageItem message={message} own={own} />
                                            </div>
                                            {/* )} */}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </TippyHeadless>
                    </div>
                    {message?.deleteBy.length > 0 && (
                        <>
                            {!message?.action && (
                                <span className={cx('message-bottom-left')}>
                                    {moment(message?.createdAt).format('h:mm a')}
                                </span>
                            )}
                        </>
                    )}
                    {message?.deleteBy.length === 0 && (
                        <>
                            {!message?.action && (
                                <span className={cx('message-bottom-left')}>
                                    {moment(message?.createdAt).format('h:mm a')}
                                </span>
                            )}
                        </>
                    )}
                </div>
            )}
        </>
    );
}

export default Message;
