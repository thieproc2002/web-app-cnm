// libs
import classNames from 'classnames/bind';
import TippyHeadless from '@tippyjs/react/headless';

// me
import styles from './Menu.module.scss';
import Popper from '~/components/Popper';
import { MenuSettingItem } from '~/layouts/components/Sidebar/Menu';

const cx = classNames.bind(styles);

function Menu({ children, user }) {
    return (
        <TippyHeadless
            render={(attrs) => (
                <div tabIndex="-1" {...attrs}>
                    {/* Popper Menu parent */}
                    <Popper className={cx('menu-popper')}>
                        <MenuSettingItem user={user} />
                    </Popper>
                </div>
            )}
            delay={[0, 100]}
            placement="top-end"
            trigger="click"
            interactive
        >
            {children}
        </TippyHeadless>
    );
}

export default Menu;
