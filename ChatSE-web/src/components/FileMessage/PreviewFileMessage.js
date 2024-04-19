// lib
import classNames from 'classnames/bind';
import { useState } from 'react';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';

// me
import styles from './FileMessage.module.scss';
import images from '~/assets/images';
import ModelWrapper from '../ModelWrapper';

const cx = classNames.bind(styles);

function PreviewFileMessage({ newFileMessage }) {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [previewFile, setPreviewFile] = useState(false);

    // console.log('FILE - MESSAGE', message);
    // console.log('NEW FILE MESSAGE - ', newFileMessage);
    console.log('FILE', newFileMessage);

    const handlePreviewFile = () => {
        setPreviewFile(true);
    };

    // handle preview file
    const handleViewer = ({ numPages }) => {
        setNumPages(numPages);
        setPageNumber(1);
    };

    return (
        <div className={cx('wrapper')}>
            {newFileMessage?.name.split('.')[newFileMessage?.name.split('.').length - 1] === 'docx' ? (
                <div className={cx('files')}>
                    <img className={cx('img-icon')} src={images.wordIcon} alt="icon-file" />

                    <div className={cx('display')}>
                        <p className={cx('name-file')}>{newFileMessage.name}</p>
                        <span className={cx('size')}>{(newFileMessage.size / 1024 / 1024).toFixed(3)} MB</span>
                    </div>
                </div>
            ) : newFileMessage?.name.split('.')[newFileMessage?.name.split('.').length - 1] === 'pdf' ? (
                <div className={cx('files')}>
                    <img className={cx('img-icon')} src={images.pdfIcon} alt="icon-file" />

                    <button className={cx('preview-file')} onClick={handlePreviewFile}>
                        <div className={cx('display')}>
                            <p className={cx('name-file')}>{newFileMessage.name}</p>
                            <span className={cx('size')}>{(newFileMessage.size / 1024 / 1024).toFixed(3)} MB</span>
                        </div>
                    </button>

                    {/* Preview file */}
                    {previewFile && (
                        <ModelWrapper className={cx('model-preview')} open={previewFile}>
                            <center>
                                <button className={cx('close-btn')} onClick={() => setPreviewFile(false)}>
                                    <FontAwesomeIcon icon={faClose} className={cx('close-icon')} />
                                </button>
                                <div className={cx('model-preview-file')}>
                                    <Document file={newFileMessage.previewFile} onLoadSuccess={handleViewer}>
                                        {Array.from(new Array(numPages), (el, index) => (
                                            <Page key={`page_${index + 1}`} pageNumber={index + 1} />
                                        ))}
                                    </Document>
                                </div>
                            </center>
                        </ModelWrapper>
                    )}
                </div>
            ) : newFileMessage?.name.split('.')[newFileMessage?.name.split('.').length - 1] === 'pptx' ? (
                <div className={cx('files')}>
                    <img className={cx('img-icon')} src={images.pdfIcon} alt="icon-file" />

                    <div className={cx('display')}>
                        <p className={cx('name-file')}>{newFileMessage.name}</p>
                        <span className={cx('size')}>{(newFileMessage.size / 1024 / 1024).toFixed(3)} MB</span>
                    </div>
                </div>
            ) : newFileMessage?.name.split('.')[newFileMessage?.name.split('.').length - 1] === 'csv' ? (
                <div className={cx('files')}>
                    <img className={cx('img-icon')} src={images.excelIcon} alt="icon-file" />

                    <p className={cx('name-file')}>{newFileMessage.name}</p>
                    <div className={cx('display')}>
                        <p className={cx('name-file')}>{newFileMessage.name}</p>
                        <span className={cx('size')}>{(newFileMessage.size / 1024 / 1024).toFixed(3)} MB</span>
                    </div>
                </div>
            ) : newFileMessage?.name.split('.')[newFileMessage?.name.split('.').length - 1] === 'xlsx' ? (
                <div className={cx('files')}>
                    <img className={cx('img-icon')} src={images.excelIcon} alt="icon-file" />

                    <div className={cx('display')}>
                        <p className={cx('name-file')}>{newFileMessage.name}</p>
                        <span className={cx('size')}>{(newFileMessage.size / 1024 / 1024).toFixed(3)} MB</span>
                    </div>
                </div>
            ) : newFileMessage?.name.split('.')[newFileMessage?.name.split('.').length - 1] === 'txt' ? (
                <div className={cx('files')}>
                    <img className={cx('img-icon')} src={images.blankIcon} alt="icon-file" />

                    <div className={cx('display')}>
                        <p className={cx('name-file')}>{newFileMessage?.name}</p>
                        <span className={cx('size')}>{(newFileMessage.size / 1024 / 1024).toFixed(3)} MB</span>
                    </div>
                </div>
            ) : (
                'Hệ thống chưa hỗ trợ tệp này. Tệp này sẽ cập nhật thêm trong thời gian sắp tới!'
            )}
        </div>
    );
}

export default PreviewFileMessage;
