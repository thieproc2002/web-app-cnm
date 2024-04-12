// lib
import classNames from 'classnames/bind';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';

// me
import styles from './FileMessage.module.scss';
import images from '~/assets/images';
import ModelWrapper from '../ModelWrapper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function FileMessage({ message }) {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [previewFile, setPreviewFile] = useState(false);

    // console.log('FILE - MESSAGE', message);
    // console.log('NEW FILE MESSAGE - ', newFileMessage);

    const handlePreviewFile = () => {
        setPreviewFile(true);
    };

    // handle preview file
    const handleViewer = ({ numPages }) => {
        setNumPages(numPages);
        setPageNumber(1);
    };

    return (
        <>
            {message.fileLink.split('.')[message.fileLink.split('.').length - 1] === 'txt' && (
                <div className={cx('files')}>
                    <button className={cx('preview-file')} onClick={handlePreviewFile}>
                        <img className={cx('img-icon')} src={images.blankIcon} alt="icon-file" />
                    </button>

                    {/* show preview file */}
                    {previewFile && (
                        <ModelWrapper className={cx('model-preview')} open={previewFile}>
                            <center>
                                <button className={cx('close-btn')} onClick={() => setPreviewFile(false)}>
                                    <FontAwesomeIcon icon={faClose} className={cx('close-icon')} />
                                </button>
                                <div className={cx('model-preview-file')}>
                                    {/* "/KTPM_Design_Web_App_N2_V4.pdf" - "/tai-lieu-hdsd-v2.pdf" */}
                                    <Document file={message.fileLink} onLoadSuccess={handleViewer}>
                                        {Array.from(new Array(numPages), (el, index) => (
                                            <Page key={`page_${index + 1}`} pageNumber={index + 1} />
                                        ))}
                                    </Document>
                                </div>
                            </center>
                        </ModelWrapper>
                    )}

                    <a href={message.fileLink} download className={cx('download-file')}>
                        <div className={cx('display')}>
                            <p className={cx('name-file')}>
                                {message.fileLink.split('/')[message.fileLink.split('/').length - 1]}
                            </p>
                            {/* <span className={cx('size')}>{newFileMessage?.size}</span> */}
                        </div>
                    </a>
                </div>
            )}
            {message.fileLink.split('.')[message.fileLink.split('.').length - 1] === 'xlsx' && (
                <div className={cx('files')}>
                    <a href={message.fileLink} download className={cx('download-file')}>
                        <img className={cx('img-icon')} src={images.excelIcon} alt="icon-file" />

                        <div className={cx('display')}>
                            <p className={cx('name-file')}>
                                {message.fileLink.split('/')[message.fileLink.split('/').length - 1]}
                            </p>
                            {/* <span className={cx('size')}>{message.size}</span> */}
                        </div>
                    </a>
                </div>
            )}
            {message.fileLink.split('.')[message.fileLink.split('.').length - 1] === 'csv' && (
                <div className={cx('files')}>
                    <a href={message.fileLink} download className={cx('download-file')}>
                        <img className={cx('img-icon')} src={images.excelIcon} alt="icon-file" />

                        <div className={cx('display')}>
                            <p className={cx('name-file')}>
                                {message.fileLink.split('/')[message.fileLink.split('/').length - 1]}
                            </p>
                            {/* <span className={cx('size')}>{message.size}</span> */}
                        </div>
                    </a>
                </div>
            )}
            {message.fileLink.split('.')[message.fileLink.split('.').length - 1] === 'pptx' && (
                <div className={cx('files')}>
                    <a href={message.fileLink} download className={cx('download-file')}>
                        <img className={cx('img-icon')} src={images.pdfIcon} alt="icon-file" />

                        <div className={cx('display')}>
                            <p className={cx('name-file')}>
                                {message.fileLink.split('/')[message.fileLink.split('/').length - 1]}
                            </p>
                            {/* <span className={cx('size')}>{message.size}</span> */}
                        </div>
                    </a>
                </div>
            )}
            {message.fileLink.split('.')[message.fileLink.split('.').length - 1] === 'pdf' && (
                <div className={cx('files')}>
                    <button className={cx('preview-file')} onClick={handlePreviewFile}>
                        <img className={cx('img-icon')} src={images.pdfIcon} alt="icon-file" />
                    </button>
                    {/* show preview file */}
                    {previewFile && (
                        <ModelWrapper className={cx('model-preview')} open={previewFile}>
                            <center>
                                <button className={cx('close-btn')} onClick={() => setPreviewFile(false)}>
                                    <FontAwesomeIcon icon={faClose} className={cx('close-icon')} />
                                </button>
                                <div className={cx('model-preview-file')}>
                                    {/* "/KTPM_Design_Web_App_N2_V4.pdf" - "/tai-lieu-hdsd-v2.pdf" */}
                                    <Document file={message.fileLink} onLoadSuccess={handleViewer}>
                                        {Array.from(new Array(numPages), (el, index) => (
                                            <Page key={`page_${index + 1}`} pageNumber={index + 1} />
                                        ))}
                                    </Document>
                                </div>
                            </center>
                        </ModelWrapper>
                    )}

                    <a href={message.fileLink} download className={cx('download-file')}>
                        <div className={cx('display')}>
                            <p className={cx('name-file')}>
                                {message.fileLink.split('/')[message.fileLink.split('/').length - 1]}
                            </p>
                            {/* <span className={cx('size')}>{message.size}</span> */}
                        </div>
                    </a>
                </div>
            )}
            {message.fileLink.split('.')[message.fileLink.split('.').length - 1] === 'docx' && (
                <div className={cx('files')}>
                    <a href={message.fileLink} download className={cx('download-file')}>
                        <img className={cx('img-icon')} src={images.wordIcon} alt="icon-file" />

                        <div className={cx('display')}>
                            <p className={cx('name-file')}>
                                {message.fileLink.split('/')[message.fileLink.split('/').length - 1]}
                            </p>
                            {/* <span className={cx('size')}>{message.size}</span> */}
                        </div>
                    </a>
                </div>
            )}
        </>
    );
}

export default FileMessage;
