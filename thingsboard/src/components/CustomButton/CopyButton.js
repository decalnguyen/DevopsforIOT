import { useState } from 'react';
import CustomButton from '.';

function CopyButton({ textToCopy, title, ...props }) {
  const [toolTip, setToolTip] = useState('Copy value');

  const copyToClipboard = async () => {
    try {
      setToolTip('Copied');
      await navigator.clipboard.writeText(textToCopy);
      setTimeout(() => {
        setToolTip('Copy value');
      }, 500);
    } catch (err) {
      console.error('Unable to copy to clipboard', err);
    }
  };

  return (
    <div>
      <CustomButton onClick={copyToClipboard} toolTip={toolTip} {...props}>
        <i class="bi bi-clipboard-fill" style={{ color: '#ccc' }}></i>
        <span>{title}</span>
      </CustomButton>
    </div>
  );
}

export default CopyButton;
