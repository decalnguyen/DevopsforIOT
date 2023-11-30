import classNames from "classnames/bind";
import styles from './Button.module.scss'
import { Link } from "react-router-dom";

const cx = classNames.bind(styles);

function Button({to, href, primary, outline, size='small', title, onClick, ...passProps}) {
    let Comp = 'button';
    
    const handleClick = (e) => {
        e.preventDefault();
        if(onClick) {
            onClick(e);
        }
    }
    const props = {
        onClick: handleClick,
        ...passProps
    }

    const classes = cx('wrapper', size, {
        primary,
        outline
    })

    if(to) {
        props.to = to;
        Comp = Link;
    } else if(href) {
        props.href = href;
        Comp = 'a';
    }

    return <Comp className={classes} {...props}>
        {title}
    </Comp>
}

export default Button;