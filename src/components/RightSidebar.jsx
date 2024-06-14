import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import {
  Drawer,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { RemoveShoppingCart, Close } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  list: {
    width: 300,
  },
  fullList: {
    width: 'auto',
  },
  drawerPaper: {
    width: 300,
  },
  button: {
    position: 'fixed',
    right: 0,
    top: 20,
    zIndex: 1300,
  },
  clearButton: {
    margin: theme.spacing(2),
  },
}));

const RightSidebar = () => {
  const classes = useStyles();
  const { cart, dispatch, totalAmount } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const pay = () => {
    console.log('Generando pago...');
  };
  const toggleDrawer = (open) => () => {
    setIsOpen(open);
  };

  const removeFromCart = (product) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: product });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <div>
      <Button
        className={classes.button}
        variant='contained'
        color='primary'
        onClick={toggleDrawer(true)}
      >
        {isOpen ? 'Close' : 'Open'} Cart Total: ${totalAmount}
      </Button>
      <Drawer
        anchor='right'
        open={isOpen}
        onClose={toggleDrawer(false)}
        classes={{ paper: classes.drawerPaper }}
      >
        <div className={classes.list} role='presentation'>
          <Typography variant='h6' gutterBottom>
            Cart
          </Typography>
          <List>
            {cart.map((item) => (
              <ListItem key={item.id}>
                <ListItemText primary={item.name} />
                <ListItemSecondaryAction>
                  <IconButton
                    edge='end'
                    aria-label='remove'
                    onClick={() => removeFromCart(item)}
                  >
                    <RemoveShoppingCart />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
          <Button
            variant='contained'
            color='secondary'
            className={classes.clearButton}
            startIcon={<Close />}
            onClick={pay}
          >
            Generar pago
          </Button>
          <Button
            variant='contained'
            color='secondary'
            className={classes.clearButton}
            startIcon={<Close />}
            onClick={clearCart}
          >
            Clear Cart
          </Button>
        </div>
        <Typography variant='h6' gutterBottom>
          Total: ${totalAmount}
        </Typography>
      </Drawer>
    </div>
  );
};

export default RightSidebar;
