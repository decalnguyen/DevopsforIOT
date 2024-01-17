import { Stack } from 'react-bootstrap';
import { CustomButton } from '~/components/CustomButton';

import global from '~/components/GlobalStyles/GlobalStyles.module.scss';
import styles from './DeviceInfoOffcanvas.module.scss';
import classNames from 'classnames/bind';
import { useState } from 'react';

const cx = classNames.bind(styles);

function CopyableElement({ value }) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <Stack
      direction="horizontal"
      gap={2}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <p className={global['text-overflow']}>{typeof value === 'boolean' ? (value ? 'true' : 'false') : value}</p>
      <CustomButton.CopyButton textToCopy={value} className={cx('hidden-btn', { active: isHovered })} />
    </Stack>
  );
}

export default CopyableElement;
