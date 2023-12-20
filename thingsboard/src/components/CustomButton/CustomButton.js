import { OverlayTrigger, Tooltip } from 'react-bootstrap';

function CustomButton({ children, props, onClick, toolTip, placement = 'top' }) {
  return (
    <OverlayTrigger placement={placement} overlay={<Tooltip>{toolTip}</Tooltip>}>
      <button {...props} onClick={onClick}>
        {children}
      </button>
    </OverlayTrigger>
  );
}

export default CustomButton;
