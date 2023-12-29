import { Stack } from 'react-bootstrap';
import { CustomButton } from '../CustomButton';

import styles from './MultiSelectPanel.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function MultiSelectPanel({ title, onDeleteItems, ...props }) {
  return (
    <div style={{ backgroundColor: 'var(--tb-login-primary-700)', width: '100%' }} {...props}>
      <Stack direction="horizontal">
        <span className={cx('header-title')} style={{ color: 'white' }}>
          {title}
        </span>
        <Stack direction="horizontal" gap={3} className="ms-auto">
          <CustomButton.DeleteButton
            style={{ color: 'white', fontSize: '1.6rem', marginRight: '64px' }}
            onClick={onDeleteItems}
          />
        </Stack>
      </Stack>
    </div>
  );
}

export default MultiSelectPanel;
