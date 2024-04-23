import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';


const MenuBar = ({ anchorEl,isOpen, handleClose, handleMenuClick }) => {
  return (
    <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={isOpen}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={() => handleMenuClick('My Recipes')}>My Recipies</MenuItem>
        <MenuItem onClick={() => handleMenuClick('My Saved Posts')}>My Saved Posts</MenuItem>
        <MenuItem onClick={() => handleMenuClick('Logout')}>Logout</MenuItem>
      </Menu>
  );
};

export default MenuBar;