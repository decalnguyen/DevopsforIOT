import { useState } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import {Edit2} from 'react-feather'
function CustomButton({ children, onClick, toolTip, placement = 'top', ...props }) {
  return (
    <OverlayTrigger placement={placement} overlay={<Tooltip>{toolTip}</Tooltip>}>
      <button {...props} onClick={onClick}>
        {children}
      </button>
    </OverlayTrigger>
  );
}

export function AddButton({ onClick, ...props }) {
  return (
    <CustomButton toolTip="Add" {...props} onClick={onClick}>
      <i class="bi bi-plus-lg"></i>
    </CustomButton>
  );
}

export function CloseButton({ onClick, ...props }) {
  return (
    <CustomButton toolTip="Close" onClick={onClick} {...props}>
      <i class="bi bi-x-lg"></i>
    </CustomButton>
  );
}

export function CopyButton({ textToCopy, title, ...props }) {
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

export function DeleteButton({ onClick, ...props }) {
  return (
    <CustomButton toolTip="Delete" onClick={onClick} {...props}>
      <i class="bi bi-trash3-fill"></i>
    </CustomButton>
  );
}

export function RefreshButton({ onClick, ...props }) {
  return (
    <CustomButton toolTip="Refresh" onClick={onClick} {...props}>
      <i class="bi bi-arrow-clockwise"></i>
    </CustomButton>
  );
}

export function SearchButton({ onClick, ...props }) {
  return (
    <CustomButton toolTip="Search" onClick={onClick} {...props}>
      <i class="bi bi-search"></i>
    </CustomButton>
  );
}
export default CustomButton;

export function EditButton({onClick, ...props}) {
  return <CustomButton toolTip="Toggle Edit Mode" onClick={onClick} {...props}>
      <Edit2 color='white'/>
    </CustomButton>
}