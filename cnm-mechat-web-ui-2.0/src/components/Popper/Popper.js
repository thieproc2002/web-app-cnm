// libs
import classNames from 'classnames/bind';

// me
import styles from './Popper.module.scss';

const cx = classNames.bind(styles);

function Popper({ children, className }) {
    return <div className={cx('wrapper', { [className]: className })}>{children}</div>;
}

export default Popper;
