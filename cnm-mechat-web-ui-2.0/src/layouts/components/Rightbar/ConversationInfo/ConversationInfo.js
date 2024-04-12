// libs
import classNames from 'classnames/bind';
import { ArrowBackIos } from '@material-ui/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCamera,
    faCaretDown,
    faClock,
    faNoteSticky,
    faPenToSquare,
    faRightFromBracket,
    faTrash,
    faUserGroup,
    faUserPlus,
    faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// me
import styles from './ConversationInfo.module.scss';
import images from '~/assets/images';
import ItemStored from '~/components/ItemStored';
import FileMessage from '~/components/FileMessage';
import useDebounce from '~/components/hooks/useDebounce';
import ModelInfoAccount from '~/components/ModelWrapper/ModelInfoAccount';
import { infoUserConversation } from '~/redux/features/user/userCurrent';
import ModelWrapper from '~/components/ModelWrapper';
import Conversation from '~/components/Conversation';
import AddGroup from '~/components/AddGroup';
import { changeNameGroups, fetchApiUpdateAvatarOfGroup, outGroup } from '~/redux/features/Group/GroupSlice';
import { filterUserGroup, userLogin, conversationSlice, listMessage } from '~/redux/selector';
import UserInGroup from '~/components/UserInGroup';

const cx = classNames.bind(styles);

function ConversationInfo({ conversationPhoneBook }) {
    const infoUser = useSelector(userLogin);
    const filterUser = useSelector(filterUserGroup);
    const userCurrent = useSelector((state) => state.userCurrents.data); // hỏi Nhớ (trùng hàm).
    const _conversation = useSelector(conversationSlice);
    const listMessages = useSelector(listMessage);

    const dispatch = useDispatch();

    const conversation = conversationPhoneBook ? conversationPhoneBook : _conversation;

    const [show, setShow] = useState(true);
    const [showAddMembers, setShowAddMembers] = useState(true);
    const [showFile, setShowFile] = useState(true);
    const [showPreview, setShowPreview] = useState(false);
    const [openAddGroup, setOpenAddGroup] = useState(false);
    const [modelChangeName, setModelChangeName] = useState(false);
    const [showImg, setShowImg] = useState();
    const [changeNameGroup, setChangeNameGroup] = useState('');
    const [avatarGroup, setAvatarGroup] = useState(null);

    const infoConversation =
        infoUser._id === conversation?.members[0] ? conversation?.members[1] : conversation?.members[0];
    const debouncedValue = useDebounce(infoConversation, 500);
    useEffect(() => {
        setChangeNameGroup(conversation?.name);
    }, [debouncedValue]);
    // console.log('conversation - avt', conversation);

    useEffect(() => {
        dispatch(
            infoUserConversation({
                userID: infoConversation,
            }),
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedValue]);

    const handleOpen = () => {
        setShow(false);
        setShowFile(true);
    };

    const handleClose = () => {
        setShow(true);
        setShowAddMembers(true);
        setShowAddMembers(true);
    };

    //file
    const handleOpenFile = () => {
        setShow(false);
        setShowFile(false);
    };
    const handleShowPreviewImageAndVideo = (e) => {
        setShowPreview(!showPreview);
        setShowImg(e.target.src);
    };

    // hide preview
    const handleHidePreviewImageAndVideo = () => {
        setShowPreview(false);
    };

    const handleAddMemberGroup = () => {
        setShow(false);
        setShowAddMembers(false);
        // console.log(showAddMembers);
    };

    //them thanh vien
    const handleModelOpenAddGroup = () => {
        setOpenAddGroup(true);
    };

    const handleModelCloseOpenAddGroup = () => {
        setOpenAddGroup(false);
    };

    // mo dong model doi ten nhom
    const openModelChangeName = () => {
        setModelChangeName(true);
    };

    const closerModelChangeName = () => {
        setModelChangeName(false);
    };

    const handleChangeNameGroup = (e) => {
        setChangeNameGroup(e.target.value);
    };

    // handle change avatar
    const handleChangeAvatar = (e) => {
        const file = e.target.files[0];

        file.previews = URL.createObjectURL(file);

        setAvatarGroup(file);
    };

    // handle update avatar
    const handleUpdateAvatarGroup = () => {
        if (avatarGroup === null) {
            toast.error('Bạn cần chọn 1 ảnh để thay đổi avatar nhóm!');
        } else {
            dispatch(
                fetchApiUpdateAvatarOfGroup({
                    userId: infoUser._id,
                    imageLink: avatarGroup,
                    conversationId: conversation.id,
                }),
            );
            toast.success('Bạn đã thay đổi avatar nhóm thành công.');
        }

        setAvatarGroup(null);
    };

    const submitChangeNameGroup = () => {
        const dataChangeGroup = {
            userId: infoUser._id,
            newName: changeNameGroup,
            conversationId: conversation.id,
        };

        if (changeNameGroup === '') {
            toast.error('Bạn cần phải nhập tên nhóm!');
        } else {
            dispatch(changeNameGroups(dataChangeGroup));
            toast.success(`Bạn đã đổi tên nhóm thành: ${changeNameGroup}.`);
        }
    };

    //out nhom
    const handleOutGroup = () => {
        let checkOutGroup = window.confirm('Bạn có chắc chắn muốn rời nhóm không?');
        if (checkOutGroup === true) {
            const dataOutGroup = {
                userId: infoUser._id,
                conversationId: conversation.id,
            };
            dispatch(outGroup(dataOutGroup));
            if (outGroup()) {
                toast.success('Bạn đã rời khỏi nhóm thành công.');
            }
        } else {
            toast.error('Bạn đã hủy yêu cầu rời nhóm!');
        }
    };

    return (
        <div className={cx('wrapper')}>
            {show ? (
                <>
                    <div className={cx('container')}>
                        <h2 className={cx('title-name')}>Thông tin hội thoại</h2>
                        <div className={cx('separator')}></div>
                        <div className={cx('info')}>
                            {/* button update avatar group */}
                            {avatarGroup && (
                                <button className={cx('btn-update-avatar-group')} onClick={handleUpdateAvatarGroup}>
                                    Cập nhật
                                </button>
                            )}

                            <div className={cx('info-avatar')}>
                                {conversation.createdBy !== null ? (
                                    <>
                                        <img
                                            className={cx('avatar')}
                                            src={
                                                avatarGroup?.previews
                                                    ? avatarGroup?.previews
                                                    : conversation?.imageLinkOfConver
                                            }
                                            alt="avatar"
                                        />

                                        {/* Option change avatar update */}
                                        <label htmlFor="file-info-group" className={cx('option-avatar')}>
                                            <FontAwesomeIcon className={cx('icon-camera')} icon={faCamera} />
                                            <input
                                                className={cx('hide')}
                                                type="file"
                                                id="file-info-group"
                                                accept=".png, .jpg, .jpeg"
                                                onChange={handleChangeAvatar}
                                            />
                                        </label>
                                    </>
                                ) : (
                                    <div className={cx('avatar')}>
                                        <ModelInfoAccount ConversationInfo user={userCurrent} />
                                    </div>
                                )}
                            </div>
                            <div className={cx('info-name')}>
                                <h3 className={cx('name')}>{conversation?.name}</h3>
                                {conversation.createdBy ? (
                                    <FontAwesomeIcon
                                        className={cx('icon-changeName')}
                                        icon={faPenToSquare}
                                        onClick={openModelChangeName}
                                    />
                                ) : null}
                            </div>
                            <ModelWrapper
                                className={cx('model-change-name')}
                                open={modelChangeName}
                                onClose={closerModelChangeName}
                            >
                                <div className={cx('model-change-name-bg')}>
                                    <div className={cx('add-friend-title')}>
                                        <span className={cx('friend-title')}>Đổi tên nhóm</span>
                                        <button className={cx('close-btn')} onClick={closerModelChangeName}>
                                            <FontAwesomeIcon className={cx('friend-close-ic')} icon={faXmark} />
                                        </button>
                                    </div>
                                    <div className={cx('model-change-name-content')}>
                                        <img
                                            className={cx('model-change-name-avatar')}
                                            src={
                                                conversation?.imageLinkOfConver
                                                    ? conversation.imageLinkOfConver
                                                    : images.noImg
                                            }
                                            alt="avatar"
                                        />

                                        <p>
                                            Bạn có muốn đổi tên nhóm, khi xác nhận tên nhóm mới sẽ hiển thị với tất cả
                                            thành viên
                                        </p>
                                        <input type="text" value={changeNameGroup} onChange={handleChangeNameGroup} />
                                    </div>
                                    <div className={cx('model-change-name-bottom')}>
                                        <div className={cx('bottom-button')}>
                                            <button className={cx('btn-cancel')} onClick={closerModelChangeName}>
                                                Hủy
                                            </button>
                                            <button className={cx('btn-confirm')} onClick={submitChangeNameGroup}>
                                                Xác nhận
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </ModelWrapper>
                        </div>

                        <div className={cx('separator')}></div>
                        {conversation.isGroup ? (
                            <>
                                <div className={cx('members-group')}>
                                    <div className={cx('members-group-title')}>
                                        <label>Thành viên nhóm</label>
                                        <FontAwesomeIcon className={cx('icon')} icon={faCaretDown} />
                                    </div>

                                    <button className={cx('btn-click-icon')} onClick={handleAddMemberGroup}>
                                        <FontAwesomeIcon className={cx('item')} icon={faUserGroup} />
                                        <label>{conversation.members.length} Thành Viên</label>
                                    </button>
                                </div>
                                <div className={cx('separator')}></div>
                                <div className={cx('members-group')}>
                                    <div className={cx('members-group-title')}>
                                        <label>Bảng tin nhóm</label>
                                        <FontAwesomeIcon className={cx('icon')} icon={faCaretDown} />
                                    </div>

                                    <button className={cx('btn-click-icon')}>
                                        <FontAwesomeIcon
                                            className={cx('item')}
                                            icon={faClock}
                                            // onClick={handleModelOpenAddGroup}
                                        />
                                        <label>Danh sách nhắc hẹn</label>
                                    </button>

                                    <button className={cx('btn-click-icon')}>
                                        <FontAwesomeIcon
                                            className={cx('item')}
                                            icon={faNoteSticky}
                                            // onClick={handleModelOpenAddGroup}
                                        />
                                        <label>Ghi chú, ghim, bình chọn</label>
                                    </button>
                                </div>
                                <div className={cx('separator')}></div>
                            </>
                        ) : null}

                        {/* bản tin nhom */}

                        {/* Image and Video */}
                        <div className={cx('list-image')}>
                            <div className={cx('header')}>
                                <span className={cx('header-title')}>Ảnh/ Video</span>
                                <FontAwesomeIcon className={cx('icon')} icon={faCaretDown} />
                            </div>
                            <div className={cx('body')}>
                                {/* render image (map) after */}
                                <div className={cx('body-list-image')}>
                                    {listMessages.map((message) => {
                                        return (
                                            <div key={message._id}>
                                                {message.imageLink && message.imageLink.length > 0 ? (
                                                    <>
                                                        {message.imageLink[0].split('.')[
                                                            message.imageLink[0].split('.').length - 1
                                                        ] === 'mp4' ? (
                                                            <video
                                                                controls
                                                                className={cx('item-image')}
                                                                src={message.imageLink}
                                                                alt="img"
                                                            />
                                                        ) : (
                                                            <>
                                                                {message.imageLink.length === 1 ? (
                                                                    <>
                                                                        <button
                                                                            className={cx('button-image')}
                                                                            onClick={handleShowPreviewImageAndVideo}
                                                                        >
                                                                            <img
                                                                                className={cx('item-image')}
                                                                                src={message.imageLink}
                                                                                alt="avatar"
                                                                                id="file-upload"
                                                                            />
                                                                        </button>

                                                                        <ModelWrapper
                                                                            className={cx('model-preview')}
                                                                            open={showPreview}
                                                                            onClose={handleHidePreviewImageAndVideo}
                                                                        >
                                                                            <img
                                                                                className={cx(
                                                                                    'preview-image-send-user',
                                                                                )}
                                                                                src={showImg}
                                                                                alt="img"
                                                                            />
                                                                        </ModelWrapper>
                                                                    </>
                                                                ) : (
                                                                    message.imageLink.map((mess, index) => {
                                                                        return (
                                                                            <div
                                                                                key={index}
                                                                                className={cx('key-image')}
                                                                            >
                                                                                <button
                                                                                    className={cx('button-image')}
                                                                                    onClick={
                                                                                        handleShowPreviewImageAndVideo
                                                                                    }
                                                                                >
                                                                                    <img
                                                                                        className={cx('item-image')}
                                                                                        src={mess}
                                                                                        alt="img"
                                                                                    />
                                                                                </button>
                                                                            </div>
                                                                        );
                                                                    })
                                                                )}
                                                            </>
                                                        )}
                                                    </>
                                                ) : null}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className={cx('footer')}>
                                <button className={cx('footer-btn-all')} onClick={handleOpen}>
                                    Xem tất cả
                                </button>
                            </div>
                        </div>

                        <div className={cx('separator')}></div>
                        {/* ------------------------------------------------------ */}
                        <div className={cx('list-item-stored')}>
                            <div className={cx('header')}>
                                <span className={cx('header-title')}>File</span>
                                <FontAwesomeIcon className={cx('icon')} icon={faCaretDown} />
                            </div>
                            <div className={cx('body')}>
                                {/* render image (map) after */}
                                <div className={cx('body-list-item-stored')}>
                                    <div className={cx('right-container')}>
                                        {listMessages.map((message) => {
                                            return (
                                                <div key={message._id}>
                                                    {message.fileLink ? (
                                                        <FileMessage message={message} className={cx('file')} />
                                                    ) : null}
                                                </div>
                                            );
                                        })}
                                    </div>
                                    {/* </div> */}
                                </div>
                            </div>
                            <div className={cx('footer')}>
                                <button className={cx('footer-btn-all')} onClick={handleOpenFile}>
                                    Xem tất cả
                                </button>
                            </div>
                        </div>

                        {/* --------------------------------------------------------- */}
                        <div className={cx('separator')}></div>
                        {/* Link */}
                        <ItemStored isLink />
                        <div className={cx('separator')}></div>
                        {conversation.isGroup && (
                            <>
                                <div className={cx('members-group')}>
                                    <div className={cx('members-group-title')}>
                                        <label>Thiết lập bảo mật</label>
                                        <FontAwesomeIcon className={cx('icon')} icon={faCaretDown} />
                                    </div>

                                    <button className={cx('btn-click-footer')}>
                                        <FontAwesomeIcon
                                            className={cx('item')}
                                            icon={faTrash}
                                            // onClick={handleModelOpenAddGroup}
                                        />
                                        {/* <label>Xóa lịch sử cuộc trò chuyện</label> */}
                                    </button>
                                    <button className={cx('btn-click-footer')} onClick={handleOutGroup}>
                                        <FontAwesomeIcon
                                            className={cx('item')}
                                            icon={faRightFromBracket}
                                            // onClick={handleModelOpenAddGroup}
                                        />
                                        <label>Rời nhóm</label>
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </>
            ) : (
                ///
                <>
                    {showAddMembers ? (
                        <div className={cx('container')}>
                            <h2 className={cx('title-name-show')}>
                                <ArrowBackIos className={cx('item-back')} onClick={handleClose} />
                                <p>Kho lưu trữ</p>
                            </h2>
                            <div className={cx('separator')}></div>
                            {showFile ? (
                                <>
                                    <div className={cx('info-show')}>
                                        <label
                                            className={cx('info-show-1')}
                                            onClick={handleOpen}
                                            style={{ color: 'blue' }}
                                        >
                                            Ảnh/ Video{' '}
                                        </label>
                                        <label className={cx('info-show-2')} onClick={handleOpenFile}>
                                            Files
                                        </label>
                                        <label className={cx('info-show-3')}>Links</label>
                                    </div>
                                    <div className={cx('separator')}></div>
                                    <div className={cx('list-image')}>
                                        <div className={cx('body-show')}>
                                            {/* render image (map) after */}
                                            <div className={cx('body-list-image-show')}>
                                                {listMessages.map((message) => {
                                                    return (
                                                        <div key={message._id}>
                                                            {message.imageLink && message.imageLink.length > 0 ? (
                                                                <>
                                                                    {message.imageLink[0].split('.')[
                                                                        message.imageLink[0].split('.').length - 1
                                                                    ] === 'mp4' ? (
                                                                        <video
                                                                            controls
                                                                            className={cx('item-image-show')}
                                                                            src={message.imageLink}
                                                                            alt="img"
                                                                        />
                                                                    ) : (
                                                                        <>
                                                                            {message.imageLink.length === 1 ? (
                                                                                <>
                                                                                    <button
                                                                                        className={cx('button-image')}
                                                                                        onClick={
                                                                                            handleShowPreviewImageAndVideo
                                                                                        }
                                                                                    >
                                                                                        <img
                                                                                            className={cx(
                                                                                                'item-image-show',
                                                                                            )}
                                                                                            src={message.imageLink}
                                                                                            alt="avatar"
                                                                                            id="file-upload"
                                                                                        />
                                                                                    </button>

                                                                                    <ModelWrapper
                                                                                        className={cx('model-preview')}
                                                                                        open={showPreview}
                                                                                        onClose={
                                                                                            handleHidePreviewImageAndVideo
                                                                                        }
                                                                                    >
                                                                                        <img
                                                                                            className={cx(
                                                                                                'preview-image-send-user',
                                                                                            )}
                                                                                            src={showImg}
                                                                                            alt="img"
                                                                                        />
                                                                                    </ModelWrapper>
                                                                                </>
                                                                            ) : (
                                                                                message.imageLink.map((mess, index) => {
                                                                                    return (
                                                                                        <div
                                                                                            key={index}
                                                                                            className={cx(
                                                                                                'key-image-show',
                                                                                            )}
                                                                                        >
                                                                                            <button
                                                                                                className={cx(
                                                                                                    'button-image',
                                                                                                )}
                                                                                                onClick={
                                                                                                    handleShowPreviewImageAndVideo
                                                                                                }
                                                                                            >
                                                                                                <img
                                                                                                    className={cx(
                                                                                                        'item-image-show',
                                                                                                    )}
                                                                                                    src={mess}
                                                                                                    alt="img"
                                                                                                />
                                                                                            </button>
                                                                                        </div>
                                                                                    );
                                                                                })
                                                                            )}
                                                                        </>
                                                                    )}{' '}
                                                                </>
                                                            ) : null}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                        <div className={cx('footer')}>
                                            <button className={cx('footer-btn-all')} onClick={handleClose}>
                                                Thu gọn
                                            </button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {' '}
                                    <div className={cx('info-show')}>
                                        <label className={cx('info-show-1')} onClick={handleOpen}>
                                            Ảnh/ Video{' '}
                                        </label>
                                        <label
                                            className={cx('info-show-2')}
                                            style={{ color: 'blue' }}
                                            onClick={handleOpenFile}
                                        >
                                            Files
                                        </label>
                                        <label className={cx('info-show-3')}>Links</label>
                                    </div>
                                    <div className={cx('separator')}></div>
                                    <div className={cx('body')}>
                                        {/* render image (map) after */}
                                        <div className={cx('body-list-item-stored')}>
                                            <div className={cx('right-container')}>
                                                {listMessages.map((message) => {
                                                    return (
                                                        <div key={message._id}>
                                                            {message.fileLink ? (
                                                                <FileMessage message={message} className={cx('file')} />
                                                            ) : null}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            {/* </div> */}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className={cx('container')}>
                            <h2 className={cx('title-name-show')}>
                                <ArrowBackIos className={cx('item-back')} onClick={handleClose} />
                                <p>Thành viên</p>
                            </h2>
                            <div className={cx('separator')}></div>
                            <div className={cx('button-addMembers')}>
                                <button onClick={handleModelOpenAddGroup} className={cx('btn-add-member')}>
                                    <FontAwesomeIcon className={cx('item')} icon={faUserPlus} />
                                    Thêm thành viên
                                </button>
                            </div>
                            {/* Tạo nhóm */}
                            <ModelWrapper
                                className={cx('model-add-friend')}
                                open={openAddGroup}
                                onClose={handleModelCloseOpenAddGroup}
                            >
                                <div className={cx('model-add-group-bg')}>
                                    <div className={cx('add-friend-title')}>
                                        <span className={cx('friend-title')}>Thêm thành viên</span>
                                        <button className={cx('close-btn')} onClick={handleModelCloseOpenAddGroup}>
                                            <FontAwesomeIcon className={cx('friend-close-ic')} icon={faXmark} />
                                        </button>
                                    </div>
                                    <AddGroup addMemerber />
                                </div>
                            </ModelWrapper>
                            <div className={cx('separator')}></div>
                            <div className={cx('list-members')}>
                                <label>Danh sách thành viên ({conversation.members.length})</label>
                                {conversation.isGroup
                                    ? filterUser?.map((user) => {
                                          return (
                                              <div key={user?._id}>
                                                  <UserInGroup user={user} conversationInfo isPhoneBook />
                                              </div>
                                          );
                                      })
                                    : null}
                            </div>
                        </div>
                    )}
                </>
                ////
            )}

            {/* Show toast status */}
            <ToastContainer position="top-right" autoClose={4000} closeOnClick={false} />
        </div>
    );
}

export default ConversationInfo;
