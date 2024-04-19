// libs
import classNames from 'classnames/bind';
import TippyHeadless from '@tippyjs/react/headless';

// me
import styles from './Menu.module.scss';
import Popper from '../Popper';
import MenuItem from './MenuItem';

const cx = classNames.bind(styles);

function Menu({ children, hideOnClick = false, user }) {
    return (
        <TippyHeadless
            render={(attrs) => (
                <div className={cx('menu-avatar')} tabIndex="-1" {...attrs}>
                    <Popper className={cx('menu-popper')}>
                        <MenuItem user={user} />
                    </Popper>
                </div>
            )}
            delay={[200, 400]}
            placement="right-end"
            hideOnClick={hideOnClick}
            interactive
        >
            {children}
        </TippyHeadless>
    );
}

export default Menu;
