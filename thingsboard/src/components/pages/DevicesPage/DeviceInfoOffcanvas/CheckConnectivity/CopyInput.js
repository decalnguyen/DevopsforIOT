import { CustomButton } from '~/components/CustomButton';
import styles from './CheckConnectivity.module.scss';
import classNames from 'classnames/bind';
import { useState } from 'react';
import { toast } from 'react-toastify';

const cx = classNames.bind(styles);

function CopyInput({ content, style }) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div className={cx('command-container')} style={{ height: '35px', marginLeft: '8px', ...style }}>
      <div
        style={{ position: 'relative' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(content);
            toast.success('Copy command successfully!', { autoClose: '1000' });
          } catch (e) {
            toast.error('Copy command failed!');
          }
        }}
      >
        <span style={{ paddingBottom: '6px', marginLeft: '6px' }}>{content}</span>
        <div className={cx('copy-container')}>
          <div className={cx('hidden-text', { active: isHovered })}>Click to copy</div>
          <CustomButton.CopyButton style={{ marginTop: '-2px', color: 'green' }} />
        </div>
      </div>
    </div>
  );
}

export default CopyInput;
