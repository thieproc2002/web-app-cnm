// libs
import classNames from 'classnames/bind';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'timeago.js';
import { MoreHoriz } from '@material-ui/icons';
import { faEllipsis, faKey } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import TippyHeadless from '@tippyjs/react/headless';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// me
import styles from './Conversation.module.scss';
import Popper from '../Popper';
import userSlice, { fetchApiDeleteFriend } from '~/redux/features/user/userSlice';
import ModelInfoAccount from '../ModelWrapper/ModelInfoAccount';
import { useEffect, useState } from 'react';
import listGroupUsers, {
    blockMember,
    cancelBlockMember,
    changeLearder,
    deleteConversation,
    deleteMember,
    fetchApiConversationById,
    fetchApiDeleteConversationSingle,
    outGroup,
} from '~/redux/features/Group/GroupSlice';
import { fetchApiRecallRequestAddFriend, friendRequests } from '~/redux/features/friend/friendRequestSlice';
import { infoUserConversation } from '~/redux/features/user/userCurrent';
import {
    filterFriendGroup,
    filterLeader,
    userInfoSelector,
    userLogin,
    conversationSlice,
    listMeRequests,
    getConversationId,
    addFriendRequest,
    filterLeaderOther,
} from '~/redux/selector';

const cx = classNames.bind(styles);

function Conversation({ conversation, isPhoneBook, Group, conversationInfo }) {
    const [Friend, setFriend] = useState(false);
    const [meRequest, setMeRequest] = useState(false);
    const [idRequest, setIdRequest] = useState(false);

    const dispatch = useDispatch();

    const infoUser = useSelector(userLogin);
    const filterLeaders = useSelector(filterLeader);
    const filterLeadersOther = useSelector(filterLeaderOther);
    const listFriendFilters = useSelector(filterFriendGroup);
    const user = useSelector(userInfoSelector);
    const conversationID = useSelector(conversationSlice);
    const listMeRequest = useSelector(addFriendRequest);

    // const conversationClick = useSelector(conversationSlice);
    // console.log('conversationID', conversationID);
    // console.log('conversation', conversation);

    useEffect(() => {
        dispatch(fetchApiConversationById(user._id));

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user._id]);

    // useEffect(() => {
    //     listFriendFilters?.map((key) => {
    //         if (key._id === conversation._id) {
    //             setFriend(true);
    //         }
    //     });
    // }, []);
    // useEffect(() => {
    //     listMeRequest?.map((key) => {
    //         if (key.receiverId === conversation._id) {
    //             setMeRequest(true);
    //         }
    //     });
    // }, []);

    const handleCancel = () => {
        let deletes = window.confirm('Bạn có chắc chắn muốn xóa không?');
        if (deletes === true) {
            const data = {
                idUser: infoUser._id,
                status: true,
                userDeleteId: conversation._id,
            };
            toast.success('Xóa bạn thành công.');
            dispatch(fetchApiDeleteFriend(data));
            dispatch(userSlice.actions.setUserClick(null));
        } else {
            toast.error('Bạn đã hủy yêu cầu xóa bạn!');
            return;
        }
    };

    // Sai
    // const tam = () => {
    //     conversations.map((c) => {
    //         if (c.members.includes(conversation._id)) {
    //             if (c.isGroup === false) {
    //                 return dispatch(conversationSlice.actions.clickConversation(c));
    //             }
    //         }
    //     });
    // };

    //xoa thanh vien khoi nhom
    // const handleDeleteMemberGroup = () => {
    //     let deletes = window.confirm('Bạn có chắc chắn muốn xóa thành viên này không?');
    //     if (deletes === true) {
    //         const data = {
    //             conversationId: conversationID.id,
    //             memberId: conversation._id,
    //             mainId: filterLeaders[0]._id,
    //         };
    //         toast.success('Xóa thành viên thành công.');
    //         dispatch(deleteMember(data));
    //     } else {
    //         toast.error('Bạn đã hủy yêu cầu!');
    //         return;
    //     }
    // };

    //roi nhom
    const handleOutGroup = () => {
        let checkOutGroup = window.confirm('Bạn có chắc chắn muốn rời nhóm không?');
        if (checkOutGroup === true) {
            const dataOutGroup = {
                userId: infoUser._id,
                conversationId: conversationID.id,
            };
            toast.success('Bạn đã rời khỏi nhóm thành công.');
            dispatch(outGroup(dataOutGroup));
        } else {
            toast.error('Bạn đã hủy yêu cầu rời nhóm!');
            return;
        }
    };

    //kết bạn
    const handleAddFriend = () => {
        const data = { senderID: infoUser._id, receiverID: conversation._id };
        let tam = dispatch(friendRequests(data));
        if (tam) {
            toast.success('Gửi lời mời kết bạn thành công.');
        }
    };

    const handleSeeninfoInGroup = () => {
        dispatch(
            infoUserConversation({
                userID: conversation._id,
            }),
        );
    };

    const handleDeleteGroup = () => {
        let checkOutGroup = window.confirm('Bạn có chắc chắn muốn giải tán nhóm không?');
        if (checkOutGroup === true) {
            const data = {
                conversationId: conversationID.id,
                mainId: filterLeaders[0]._id,
            };
            toast.success('Bạn đã giải tán nhóm.');
            dispatch(deleteConversation(data));
        } else {
            toast.error('Bạn đã hủy yêu cầu giải tán nhóm!');
            return;
        }
    };

    // handle block message user
    // const handleBlockMember = () => {
    //     let checkOutGroup = window.confirm('Bạn có chắc chắn muốn chặn tin nhắn không?');
    //     if (checkOutGroup === true) {
    //         const data = {
    //             conversationId: conversationID.id,
    //             userId: conversation._id,
    //         };
    //         dispatch(blockMember(data));
    //         toast.success('Bạn đã chặn tin nhắn thành công.');
    //     } else {
    //         toast.error('Bạn đã hủy yêu cầu chặn tin nhắn!');
    //         return;
    //     }
    // };

    // handle un-block message user
    // const handleCancelBlockMember = () => {
    //     let checkOutGroup = window.confirm('Bạn có chắc chắn muốn bỏ chặn tin nhắn không?');
    //     if (checkOutGroup === true) {
    //         const data = {
    //             conversationId: conversationID.id,
    //             userId: conversation._id,
    //         };
    //         dispatch(cancelBlockMember(data));
    //         toast.success('Bạn đã bỏ chặn tin nhắn thành công.');
    //     } else {
    //         toast.error('Bạn đã hủy yêu cầu bỏ chặn tin nhắn!');
    //         return;
    //     }
    // };

    // handle delete conversation single
    const handleDeleteConversationSingle = () => {
        const choice = window.confirm('Bạn có chắc chắn muốn xóa cuộc trò chuyện này không?');

        if (choice === true) {
            dispatch(
                fetchApiDeleteConversationSingle({
                    conversationId: conversation.id,
                    userId: user._id,
                }),
            );
            toast.success('Bạn đã xóa thành công cuộc trò chuyện này.');
        } else {
            toast.error('Bạn đã đã hủy yêu cầu xóa cuộc trò chuyện!');
            return;
        }
    };

    // const handleChangeLeader = () => {
    //     let checkOutGroup = window.confirm('Bạn có chắc chắn muốn chuyển quyền trưởng nhóm không?');
    //     if (checkOutGroup === true) {
    //         const data = {
    //             conversationId: conversationID.id,
    //             userId: conversation._id,
    //         };
    //         dispatch(changeLearder(data));
    //         if (changeLearder()) {
    //             toast.success('Bạn đã chuyển quyền trưởng nhóm thành công.');
    //         }
    //     } else {
    //         toast.info('Bạn đã hủy yêu cầu chuyển quyền trưởng nhóm!');
    //         return;
    //     }
    // };

    // thu hoi ket ban
    const handleCallback = () => {
        const Request = listMeRequest.filter((friend) => friend.receiverId.includes(conversation._id));
        const data = {
            status: true,
            senderID: infoUser._id,
            idRequest: Request[0].idFriendRequest,
        };
        dispatch(fetchApiRecallRequestAddFriend(data));
        toast.success('Bạn đã thu hồi lời mời kết bạn.');
    };
    return (
        <>
            {conversationInfo ? (
                <div className={cx('list-conversation')} onClick={handleSeeninfoInGroup}>
                    <img
                        className={cx('avatar-img')}
                        src={conversation?.imageLinkOfConver} // conversation?.imageLinkOfConver ? : images.noImg
                        alt="avatar-user"
                    />

                    {/* <ModelInfoAccount seenInfoInGroup user={userCurrent} /> */}

                    {filterLeaders[0]?._id === conversation?._id ? (
                        <div className={cx('key-leader')}>
                            <label htmlFor="file-info" className={cx('option-avatar')}>
                                <FontAwesomeIcon className={cx('icon-camera')} icon={faKey} />
                            </label>
                        </div>
                    ) : null}
                    <div className={cx('content')}>
                        <h4 className={cx('username')}>{conversation?.name} </h4>
                    </div>

                    {!Friend && infoUser?._id !== conversation?._id ? (
                        <>
                            {meRequest ? (
                                <div className={cx('button-addFriend')} onClick={handleCallback}>
                                    <button>Thu hồi</button>
                                </div>
                            ) : (
                                <div className={cx('button-addFriend')} onClick={handleAddFriend}>
                                    <button>Kết bạn</button>
                                </div>
                            )}
                        </>
                    ) : null}

                    {filterLeaders[0]._id === conversation?._id && infoUser._id === filterLeaders[0]._id ? (
                        <TippyHeadless
                            render={(attrs) => (
                                <div tabIndex="-1" {...attrs}>
                                    <Popper className={cx('own-menu-list-children')}>
                                        <p className={cx('deleteFriend')} onClick={handleOutGroup}>
                                            <button className={cx('item-btn')}>Rời nhóm</button>
                                        </p>
                                        <p className={cx('deleteFriend')} onClick={handleDeleteGroup}>
                                            <button className={cx('item-btn')}>Giải tán nhóm</button>
                                        </p>
                                    </Popper>
                                </div>
                            )}
                            interactive
                            trigger="click"
                            placement="bottom-start"
                            offset={[4, 4]}
                        >
                            <Tippy className={cx('tool-tip')} content="Lựa chọn" delay={[200, 0]}>
                                <div>
                                    <MoreHoriz className={cx('item')} />
                                </div>
                            </Tippy>
                        </TippyHeadless>
                    ) : (
                        <>
                            {infoUser._id === filterLeaders[0]._id ? (
                                <TippyHeadless
                                    render={(attrs) => (
                                        <div tabIndex="-1" {...attrs}>
                                            <Popper className={cx('own-menu-list-children')}>
                                                {/* <p className={cx('deleteFriend')} onClick={handleChangeLeader}>
                                                    <button className={cx('item-btn')}>Chuyển quyền nhóm trưởng</button>
                                                </p>
                                                <p className={cx('deleteFriend')} onClick={handleDeleteMemberGroup}>
                                                    <button className={cx('item-btn')}>Xóa khỏi nhóm</button>
                                                </p> */}

                                                {/* conversationID conversationClick */}
                                                {/* {conversationID.blockBy.includes(conversation?._id) ? (
                                                    <p className={cx('deleteFriend')} onClick={handleCancelBlockMember}>
                                                        <button className={cx('item-btn')}>Bỏ chặn</button>
                                                    </p>
                                                ) : (
                                                    <p className={cx('deleteFriend')} onClick={handleBlockMember}>
                                                        <button className={cx('item-btn')}>Chặn tin nhắn</button>
                                                    </p>
                                                )} */}
                                            </Popper>
                                        </div>
                                    )}
                                    interactive
                                    trigger="click"
                                    placement="bottom-start"
                                    offset={[4, 4]}
                                >
                                    <Tippy className={cx('tool-tip')} content="Lựa chọn" delay={[200, 0]}>
                                        <div>
                                            <MoreHoriz className={cx('item')} />
                                        </div>
                                    </Tippy>
                                </TippyHeadless>
                            ) : (
                                <>
                                    {infoUser._id === conversation?._id ? (
                                        <TippyHeadless
                                            render={(attrs) => (
                                                <div tabIndex="-1" {...attrs}>
                                                    <Popper className={cx('own-menu-list-children')}>
                                                        <p className={cx('deleteFriend')} onClick={handleOutGroup}>
                                                            <button className={cx('item-btn')}>Rời nhóm</button>
                                                        </p>
                                                    </Popper>
                                                </div>
                                            )}
                                            interactive
                                            trigger="click"
                                            placement="bottom-start"
                                            offset={[4, 4]}
                                        >
                                            <Tippy className={cx('tool-tip')} content="Lựa chọn" delay={[200, 0]}>
                                                <div>
                                                    <MoreHoriz className={cx('item')} />
                                                </div>
                                            </Tippy>
                                        </TippyHeadless>
                                    ) : null}
                                </>
                            )}
                        </>
                    )}
                </div>
            ) : (
                <div className={cx('container-conversation')}>
                    <div className={cx('list-conversation')}>
                        {/*onClick={tam}  */}
                        <img className={cx('avatar-img')} src={conversation?.imageLinkOfConver} alt="avatar" />

                        <div className={cx('content')}>
                            <h4 className={cx('username')}>{conversation?.name} </h4>
                            {isPhoneBook ? null : (
                                <p className={cx('message')}>{conversation?.content || conversation?.lastMessage}</p>
                            )}
                        </div>

                        {isPhoneBook && !Group ? (
                            <TippyHeadless
                                render={(attrs) => (
                                    <div tabIndex="-1" {...attrs}>
                                        <Popper className={cx('own-menu-list-children')}>
                                            <p className={cx('deleteFriend')}>
                                                <ModelInfoAccount yourProfile friend user={conversation} />
                                            </p>
                                            <p className={cx('deleteFriend')} onClick={handleCancel}>
                                                <button className={cx('item-btn')}> Xóa Bạn</button>
                                            </p>
                                        </Popper>
                                    </div>
                                )}
                                interactive
                                trigger="click"
                                placement="bottom-start"
                                offset={[4, 4]}
                            >
                                <Tippy className={cx('tool-tip')} content="Lựa chọn" delay={[200, 0]}>
                                    <div>
                                        <MoreHoriz className={cx('item')} />
                                    </div>
                                </Tippy>
                            </TippyHeadless>
                        ) : null}

                        {isPhoneBook ? null : (
                            <div className={cx('notification')}>
                                <span className={cx('time')}>{format(conversation?.time)}</span>
                                {/* {conversationID?.id === conversation?.id ? (
                                    <>
                                        {notifications.length > 0 && (
                                            <span className={cx('badge')}>{notifications.length}</span>
                                        )}
                                    </>
                                ) : null} */}
                            </div>
                        )}
                    </div>

                    {isPhoneBook ? null : (
                        <button className={cx('option-remove-conversation')}>
                            <TippyHeadless
                                render={(attrs) => (
                                    <div tabIndex="-1" {...attrs} className={cx('tippy-remove-conversation')}>
                                        <Popper className={cx('popper-remove-conversation')}>
                                            <button
                                                className={cx('btn-remove')}
                                                onClick={handleDeleteConversationSingle}
                                            >
                                                Xóa cuộc trò chuyện
                                            </button>
                                        </Popper>
                                    </div>
                                )}
                                delay={[0, 100]}
                                placement="bottom-end"
                                // offset={[0, 0]}
                                interactive
                            >
                                <FontAwesomeIcon className={cx('option-del')} icon={faEllipsis} />
                            </TippyHeadless>
                        </button>
                    )}
                </div>
            )}

            {/* Show toast status */}
            <ToastContainer position="top-right" autoClose={4000} closeOnClick={false} />
        </>
    );
}

export default Conversation;
