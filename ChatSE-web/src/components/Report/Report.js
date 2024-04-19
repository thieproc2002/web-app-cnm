// lib
import classNames from 'classnames/bind';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// me
import styles from './Report.module.scss';
import images from '~/assets/images';
import Tippy from '@tippyjs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faImage } from '@fortawesome/free-solid-svg-icons';
import { fetchApiCreateReport } from '~/redux/features/report/reportSlice';
import { userInfoSelector } from '~/redux/selector';

const cx = classNames.bind(styles);

function Report({ message }) {
    const [newMessageText, setNewMessageText] = useState('');
    const [newImageMessage, setNewImageMessage] = useState([]);
    const [btnClosePreview, setBtnClosePreview] = useState(false);

    const dispatch = useDispatch();

    const user = useSelector(userInfoSelector);

    // console.log('message', message);
    // console.log('message', newMessageText);

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
        setBtnClosePreview(!btnClosePreview);
    };

    // handle close preview image
    const handleClosePreview = () => {
        setNewImageMessage([]);
        setBtnClosePreview(false);
    };

    // handle onchange mesage text
    const handleOnchangeMessageReport = (e) => {
        const mess = e.target.value;

        setNewMessageText(mess);
    };

    // handle confirm report
    const handleConfirmReport = () => {
        if (newImageMessage.length === 0) {
            toast.error('Bạn cần chọn ít nhất 1 hình để báo cáo tin nhắn!');
        } else {
            dispatch(
                fetchApiCreateReport({
                    messageId: message._id,
                    imageLink: newImageMessage,
                    content: newMessageText,
                    senderID: user._id,
                }),
            );
            toast.success('Bạn đã gửi báo thành công. Cám ơn, chúng tôi sẽ xem xét báo cáo tin nhắn của bạn.');
        }

        setNewMessageText('');
        setNewImageMessage([]);
        setBtnClosePreview(false);
    };

    return (
        <div className={cx('model-report')}>
            <div className={cx('model-report-header')}>
                <h1 className={cx('model-report-header-name')}>Báo cáo hành vi</h1>
                <img className={cx('model-report-header-img')} src={images.logo} alt="logo-mechat" />
            </div>

            <div className={cx('model-report-body')}>
                {/* option image */}
                <label htmlFor="file-report">
                    <div className={cx('option-image-icon')}>
                        <Tippy className={cx('tool-tip')} content="Chọn hình ảnh bạn muốn báo cáo" delay={[200, 0]}>
                            <FontAwesomeIcon className={cx('option-icon')} icon={faImage} />
                        </Tippy>
                        <input
                            className={cx('hide')}
                            type="file"
                            id="file-report"
                            accept=".png, .jpg, .jpeg"
                            onChange={handleChangeImageMessage}
                            multiple
                        />
                    </div>
                </label>

                <textarea
                    className={cx('message-input')}
                    placeholder="Nhập nội dung báo cáo của bạn..."
                    value={newMessageText}
                    onChange={handleOnchangeMessageReport}
                ></textarea>

                {/* Button close preview */}
                {btnClosePreview && (
                    <button className={cx('close-btn')} onClick={handleClosePreview}>
                        <FontAwesomeIcon icon={faClose} className={cx('close-icon')} />
                    </button>
                )}
                {/* Show preview image of report */}
                {newImageMessage.length > 0 ? (
                    <div>
                        {newImageMessage.map((img, index) => {
                            return (
                                <img className={cx('image-upload')} key={index} src={img.preview} alt="img-report" />
                            );
                        })}
                    </div>
                ) : null}
            </div>

            <div className={cx('model-report-footer')}>
                <button className={cx('btn-report')} onClick={handleConfirmReport}>
                    Gửi
                </button>
            </div>

            {/* Show status report */}
            <ToastContainer position="top-right" autoClose={4000} closeOnClick={false} />
        </div>
    );
}

export default Report;
