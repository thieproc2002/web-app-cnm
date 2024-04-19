// lib
import classNames from 'classnames/bind';
import { useState } from 'react';

// me
import styles from './Message.module.scss';
import ModelWrapper from '../ModelWrapper';
import FileMessage from '../FileMessage';

const cx = classNames.bind(styles);

function MessageItem({ message, own }) {
    const [showPreview, setShowPreview] = useState(false);

    // console.log('MESSAGE - ', message);

    // show preview
    const handleShowPreviewImageAndVideo = () => {
        setShowPreview(!showPreview);
    };

    // hide preview
    const handleHidePreviewImageAndVideo = () => {
        setShowPreview(false);
    };

    return (
        <>
            {own ? (
                <>
                    {/* File message */}
                    {message.fileLink && message.imageLink.length === 0 ? (
                        <div>
                            {message.content && <p className={cx('message-top-text')}>{message.content}</p>}
                            <div className={cx('file-own')}>
                                <FileMessage message={message} />
                            </div>
                        </div>
                    ) : (
                        message.fileLink && (
                            <div className={cx('file-own')}>
                                <FileMessage message={message} />
                            </div>
                        )
                    )}

                    {/* Image + Video message */}
                    {message.imageLink !== null && message.imageLink.length > 0 && !message.fileLink && (
                        <>
                            {message.imageLink[0].split('.')[message.imageLink[0].split('.').length - 1] === 'mp4' ? (
                                <div>
                                    {message.content && <p className={cx('message-top-text')}>{message.content}</p>}
                                    <button className={cx('preview-image')} onClick={handleShowPreviewImageAndVideo}>
                                        <video
                                            controls
                                            className={cx('image-send-user')}
                                            src={message.imageLink}
                                            alt="img"
                                        />
                                    </button>
                                    <ModelWrapper
                                        className={cx('model-preview')}
                                        open={showPreview}
                                        onClose={handleHidePreviewImageAndVideo}
                                    >
                                        <video
                                            controls
                                            className={cx('preview-image-send-user')}
                                            src={message.imageLink}
                                            alt="img"
                                        />
                                    </ModelWrapper>
                                </div>
                            ) : (
                                <>
                                    {message.imageLink !== null && message.imageLink.length > 0 && (
                                        <>
                                            {message.imageLink.length === 1 ? (
                                                <div>
                                                    {message.content && (
                                                        <p className={cx('message-top-text')}>{message.content}</p>
                                                    )}
                                                    <button
                                                        className={cx('preview-image')}
                                                        onClick={handleShowPreviewImageAndVideo}
                                                    >
                                                        <img
                                                            className={cx('image-send-user')}
                                                            src={message.imageLink[0]}
                                                            alt="img"
                                                        />
                                                    </button>
                                                </div>
                                            ) : (
                                                message.imageLink.map((mess, index) => {
                                                    return (
                                                        <div key={index} className={cx('display-group-item-image')}>
                                                            {/* <p className={cx('message-top-text')}>
                                                                        {mess.content}
                                                                    </p> */}
                                                            <button
                                                                className={cx('preview-image')}
                                                                onClick={handleShowPreviewImageAndVideo}
                                                            >
                                                                <img
                                                                    className={cx('image-send-user')}
                                                                    src={mess}
                                                                    alt="img"
                                                                />
                                                            </button>
                                                        </div>
                                                    );
                                                })
                                            )}
                                            <ModelWrapper
                                                className={cx('model-preview')}
                                                open={showPreview}
                                                onClose={handleHidePreviewImageAndVideo}
                                            >
                                                <>
                                                    {message.imageLink.length === 1 ? (
                                                        <img
                                                            className={cx('preview-image-send-user')}
                                                            src={message?.imageLink}
                                                            alt="img"
                                                        />
                                                    ) : (
                                                        message.imageLink.map((mess, index) => {
                                                            return (
                                                                <div key={index}>
                                                                    <img
                                                                        className={cx('preview-image-send-user')}
                                                                        src={mess}
                                                                        alt="img"
                                                                    />
                                                                </div>
                                                            );
                                                        })
                                                    )}
                                                </>
                                            </ModelWrapper>
                                        </>
                                    )}
                                </>
                            )}
                        </>
                    )}
                    {(message.imageLink === null || message.imageLink.length === 0) && message.fileLink === null && (
                        <p className={cx('message-top-text')}>{message.content}</p>
                    )}
                </>
            ) : (
                <>
                    {/* File message */}
                    {message?.fileLink !== null && message?.imageLink.length === 0 ? (
                        <div>
                            {message.content && <p className={cx('message-top-text')}>{message.content}</p>}
                            <div className={cx('file-receiver')}>
                                <FileMessage message={message} />
                            </div>
                        </div>
                    ) : (
                        message?.fileLink && (
                            <div className={cx('file-receiver')}>
                                <FileMessage message={message} />
                            </div>
                        )
                    )}

                    {/* Image + video message */}
                    {message?.imageLink !== null && message?.imageLink.length > 0 && !message?.fileLink && (
                        <>
                            {message.imageLink[0].split('.')[message.imageLink[0].split('.').length - 1] === 'mp4' ? (
                                <div>
                                    {message.content && <p className={cx('message-top-text')}>{message.content}</p>}
                                    <button className={cx('preview-image')} onClick={handleShowPreviewImageAndVideo}>
                                        <video
                                            controls
                                            className={cx('image-send-user')}
                                            src={message.imageLink}
                                            alt="img"
                                        />
                                    </button>
                                    <ModelWrapper
                                        className={cx('model-preview')}
                                        open={showPreview}
                                        onClose={handleHidePreviewImageAndVideo}
                                    >
                                        <video
                                            controls
                                            className={cx('preview-image-send-user')}
                                            src={message.imageLink}
                                            alt="img"
                                        />
                                    </ModelWrapper>
                                </div>
                            ) : (
                                <>
                                    {message?.imageLink !== null && message?.imageLink.length > 0 && (
                                        <>
                                            {message.imageLink.length === 1 ? (
                                                <div>
                                                    {message.content && (
                                                        <p className={cx('message-top-text')}>{message.content}</p>
                                                    )}
                                                    <button
                                                        className={cx('preview-image')}
                                                        onClick={handleShowPreviewImageAndVideo}
                                                    >
                                                        <img
                                                            className={cx('image-send-user-left')}
                                                            src={message.imageLink[0]}
                                                            alt="img"
                                                        />
                                                    </button>
                                                </div>
                                            ) : (
                                                message?.imageLink.map((mess, index) => {
                                                    return (
                                                        <div key={index} className={cx('display-group-item-image')}>
                                                            {/* <p className={cx('message-top-text')}>
                                                                    {message.content}
                                                                </p> */}
                                                            <button
                                                                className={cx('preview-image')}
                                                                onClick={handleShowPreviewImageAndVideo}
                                                            >
                                                                <img
                                                                    className={cx('image-send-user-left')}
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
                                    <ModelWrapper
                                        className={cx('model-preview')}
                                        open={showPreview}
                                        onClose={handleHidePreviewImageAndVideo}
                                    >
                                        <>
                                            {message.imageLink.length === 1 ? (
                                                <img
                                                    className={cx('preview-image-send-user')}
                                                    src={message.imageLink}
                                                    alt="img"
                                                />
                                            ) : (
                                                message.imageLink.map((mess, index) => {
                                                    return (
                                                        <div key={index}>
                                                            <img
                                                                className={cx('preview-image-send-user')}
                                                                src={mess}
                                                                alt="img"
                                                            />
                                                        </div>
                                                    );
                                                })
                                            )}
                                        </>
                                    </ModelWrapper>
                                </>
                            )}
                        </>
                    )}
                    {(message?.imageLink === null || message?.imageLink.length === 0) && message?.fileLink === null && (
                        <p className={cx('message-top-text')}>{message.content}</p>
                    )}
                </>
            )}
        </>
    );
}

export default MessageItem;
