import classNames from "classnames/bind";
import styles from './Header.module.scss'
import Button from "../Button";

const cx = classNames.bind(styles);

function Header() {
    return ( 
    <div className={cx('wrapper')}>
        <Button primary outline title="Log in" />
    </div> 
    );
}

export default Header;