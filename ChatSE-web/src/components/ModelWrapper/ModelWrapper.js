// libs
import classNames from 'classnames/bind';
import { Modal } from '@mui/material';

// me
import styles from './ModelWrapper.module.scss';

const cx = classNames.bind(styles);

function ModelWrapper({ children, className, open, onClose, onChange, props }) {
    return (
        <Modal
            className={cx('wrapper', { [className]: className })}
            open={open}
            onClose={onClose}
            onChange={onChange}
            props={props}
        >
            {children}
        </Modal>
    );
}

export default ModelWrapper;
