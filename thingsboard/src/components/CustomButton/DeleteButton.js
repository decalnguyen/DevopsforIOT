import CustomButton from './CustomButton';

function DeleteButton({ onClick }) {
  return (
    <CustomButton toolTip="Delete" onClick={onClick}>
      <i class="bi bi-trash3-fill"></i>
    </CustomButton>
  );
}

export default DeleteButton;
