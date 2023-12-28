import { Stack } from 'react-bootstrap';
import styles from './DeviceInfoOffcanvas.module.scss';
import classNames from 'classnames/bind';
import { CustomButton } from '~/components/CustomButton';

const cx = classNames.bind(styles);

function MultiSelectPanel({ title, onDeleteItems }) {
  return (
    <div style={{ backgroundColor: 'var(--tb-login-primary-700)', width: '100%' }}>
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
