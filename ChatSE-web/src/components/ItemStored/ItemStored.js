// libs
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';

// me
import styles from './ItemStored.module.scss';
import FileMessage from '../FileMessage';

const cx = classNames.bind(styles);

function ItemStored({ message, isLink }) {
    return (
        <div className={cx('list-item-stored')}>
            <div className={cx('header')}>
                <span className={cx('header-title')}>{isLink ? 'Link' : 'File'}</span>
                <FontAwesomeIcon className={cx('icon')} icon={faCaretDown} />
            </div>
            <div className={cx('body')}>
                {/* render image (map) after */}
                <div className={cx('body-list-item-stored')}>
                    {/* <div className={cx('container')}> */}
                    {/* <img className={cx('left-item-image')} src={images.avt} alt="file-and-link" /> */}

                    <div className={cx('right-container')}>
                        {isLink ? (
                            <>
                                <div className={cx('title-name')}>Name url</div>
                                <div className={cx('info-link')}>www.react</div>
                            </>
                        ) : (
                            <>
                                <FileMessage message={message} />
                                {/* <div className={cx('title-name')}>Name file</div>
                                    <div className={cx('info')}>1.2 MB</div> */}
                            </>
                        )}
                    </div>
                    {/* </div> */}
                </div>
            </div>
            <div className={cx('footer')}>
                <button className={cx('footer-btn-all')}>Xem tất cả</button>
            </div>
        </div>
    );
}

export default ItemStored;
