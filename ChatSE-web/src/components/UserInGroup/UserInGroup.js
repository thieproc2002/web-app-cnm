import TippyHeadless from '@tippyjs/react/headless';
import { useState, useEffect } from 'react';
import moment from 'moment';
import { faEllipsis, faKey } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MoreHoriz } from '@material-ui/icons';
import Tippy from '@tippyjs/react';
import classNames from 'classnames/bind';
import Popper from '../Popper';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import styles from './UserInGroup.module.scss';
import ModelInfoAccount from '../ModelWrapper/ModelInfoAccount';
import { infoUserConversation } from '~/redux/features/user/userCurrent';
import { addFriendRequest, conversationSlice, filterFriendGroup, filterLeader, userLogin } from '~/redux/selector';
import { fetchApiRecallRequestAddFriend, friendRequests } from '~/redux/features/friend/friendRequestSlice';
import {
    blockMember,
    cancelBlockMember,
    changeLearder,
    deleteConversation,
    deleteMember,
    outGroup,
} from '~/redux/features/Group/GroupSlice';

const cx = classNames.bind(styles);

function UserInGroup({ user, conversationInfo }) {
    const [Friend, setFriend] = useState(false);
    const [meRequest, setMeRequest] = useState(false);
    console.log('[meRequest] -> ', meRequest);
    const dispatch = useDispatch();

    const filterLeaders = useSelector(filterLeader);
    const infoUser = useSelector(userLogin);
    const listMeRequest = useSelector(addFriendRequest);
    const listFriendFilters = useSelector(filterFriendGroup);
    const conversationClicked = useSelector(conversationSlice);

    console.log('[listMeRequest] -> ', listMeRequest);

    useEffect(() => {
        listFriendFilters?.map((key) => {
            if (key._id === user._id) {
                setFriend(true);
            }
        });
    }, []);

    useEffect(() => {
        listMeRequest?.map((key) => {
            if (key.receiverId === user._id) {
                setMeRequest(true);
            }
        });
    }, []);

    const handleSeeninfoInGroup = () => {
        dispatch(
            infoUserConversation({
                userID: user._id,
            }),
        );
    };

    // thu hoi ket ban
    const handleCallback = () => {
        const Request = listMeRequest.filter((friend) => friend.receiverId.includes(user._id));
        const data = {
            status: true,
            senderID: infoUser._id,
            idRequest: Request[0].idFriendRequest,
        };
        dispatch(fetchApiRecallRequestAddFriend(data));
        toast.success('Bạn đã thu hồi lời mời kết bạn.');
    };

    //kết bạn
    const handleAddFriend = () => {
        const data = { senderID: infoUser._id, receiverID: user._id };

        let tam = dispatch(friendRequests(data));
        if (tam) {
            toast.success('Gửi lời mời kết bạn thành công.');
        }
    };

    //roi nhom
    const handleOutGroup = () => {
        let checkOutGroup = window.confirm('Bạn có chắc chắn muốn rời nhóm không?');
        if (checkOutGroup === true) {
            const dataOutGroup = {
                userId: infoUser._id,
                conversationId: conversationClicked.id,
            };
            toast.success('Bạn đã rời khỏi nhóm thành công.');
            dispatch(outGroup(dataOutGroup));
        } else {
            toast.error('Bạn đã hủy yêu cầu rời nhóm!');
            return;
        }
    };

    const handleDeleteGroup = () => {
        let checkOutGroup = window.confirm('Bạn có chắc chắn muốn giải tán nhóm không?');
        if (checkOutGroup === true) {
            const data = {
                conversationId: conversationClicked.id,
                mainId: filterLeaders[0]._id,
            };
            toast.success('Bạn đã giải tán nhóm.');
            dispatch(deleteConversation(data));
        } else {
            toast.error('Bạn đã hủy yêu cầu giải tán nhóm!');
            return;
        }
    };

    const handleChangeLeader = () => {
        let checkOutGroup = window.confirm('Bạn có chắc chắn muốn chuyển quyền trưởng nhóm không?');
        if (checkOutGroup === true) {
            const data = {
                conversationId: conversationClicked.id,
                userId: user._id,
            };
            dispatch(changeLearder(data));
            toast.success('Bạn đã chuyển quyền trưởng nhóm thành công.');
        } else {
            toast.info('Bạn đã hủy yêu cầu chuyển quyền trưởng nhóm!');
            return;
        }
    };

    const handleDeleteMemberGroup = () => {
        let deletes = window.confirm('Bạn có chắc chắn muốn xóa thành viên này không?');
        if (deletes === true) {
            const data = {
                conversationId: conversationClicked.id,
                memberId: user._id,
                mainId: filterLeaders[0]._id,
            };
            toast.success('Xóa thành viên thành công.');
            dispatch(deleteMember(data));
        } else {
            toast.error('Bạn đã hủy yêu cầu!');
            return;
        }
    };

    const handleCancelBlockMember = () => {
        let checkOutGroup = window.confirm('Bạn có chắc chắn muốn bỏ chặn tin nhắn không?');
        if (checkOutGroup === true) {
            const data = {
                conversationId: conversationClicked.id,
                userId: user._id,
            };
            dispatch(cancelBlockMember(data));
            toast.success('Bạn đã bỏ chặn tin nhắn thành công.');
        } else {
            toast.error('Bạn đã hủy yêu cầu bỏ chặn tin nhắn!');
            return;
        }
    };

    const handleBlockMember = () => {
        let checkOutGroup = window.confirm('Bạn có chắc chắn muốn chặn tin nhắn không?');
        if (checkOutGroup === true) {
            const data = {
                conversationId: conversationClicked.id,
                userId: user._id,
            };
            dispatch(blockMember(data));
            toast.success('Bạn đã chặn tin nhắn thành công.');
        } else {
            toast.error('Bạn đã hủy yêu cầu chặn tin nhắn!');
            return;
        }
    };

    return (
        <>
            {conversationInfo ? (
                <div className={cx('list-conversation')} onClick={handleSeeninfoInGroup}>
                    <img
                        className={cx('avatar-img')}
                        src={user?.imageLinkOfConver} // user?.imageLinkOfConver ? : images.noImg
                        alt="avatar-user"
                    />

                    {/* <ModelInfoAccount seenInfoInGroup user={userCurrent} /> */}

                    {filterLeaders[0]?._id === user?._id ? (
                        <div className={cx('key-leader')}>
                            <label htmlFor="file-info" className={cx('option-avatar')}>
                                <FontAwesomeIcon className={cx('icon-camera')} icon={faKey} />
                            </label>
                        </div>
                    ) : null}
                    <div className={cx('content')}>
                        <h4 className={cx('username')}>{user?.name} </h4>
                    </div>

                    {!Friend && infoUser?._id !== user?._id ? (
                        <>
                            {/* meRequest */}
                            {listMeRequest[0]?.receiverId === user?._id ? (
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

                    {filterLeaders[0]._id === user?._id && infoUser._id === filterLeaders[0]._id ? (
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
                                                <p className={cx('deleteFriend')} onClick={handleChangeLeader}>
                                                    <button className={cx('item-btn')}>Chuyển quyền nhóm trưởng</button>
                                                </p>
                                                <p className={cx('deleteFriend')} onClick={handleDeleteMemberGroup}>
                                                    <button className={cx('item-btn')}>Xóa khỏi nhóm</button>
                                                </p>

                                                {/* conversationID conversationClick */}
                                                {conversationClicked.blockBy.includes(user?._id) ? (
                                                    <p className={cx('deleteFriend')} onClick={handleCancelBlockMember}>
                                                        <button className={cx('item-btn')}>Bỏ chặn</button>
                                                    </p>
                                                ) : (
                                                    <p className={cx('deleteFriend')} onClick={handleBlockMember}>
                                                        <button className={cx('item-btn')}>Chặn tin nhắn</button>
                                                    </p>
                                                )}
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
                                    {infoUser._id === user?._id ? (
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
            ) : null}
        </>
        // <div className={cx('list-conversation')}>
        //     <img
        //         className={cx('avatar-img')}
        //         src={user?.imageLinkOfConver} // conversation?.imageLinkOfConver ? : images.noImg
        //         alt="avatar-user"
        //     />
        //     <div className={cx('content')}>
        //         <h4 className={cx('username')}>{user?.name} </h4>
        //     </div>
        //     <div>
        //         <MoreHoriz className={cx('item')} />
        //     </div>
        // </div>
    );
}

export default UserInGroup;
