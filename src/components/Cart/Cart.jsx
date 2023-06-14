import React from 'react';
import {Container, Typography, Button, Grid} from '@material-ui/core';
import useStyles from './Styles';
import CartItem from './CartItem/CartItem';
import {Link} from 'react-router-dom';

const Cart = ({getCartItems, updateCartQty,removeCartItem,emptyCart}) => {
    
    // console.log(getCartItems);
    // return <div>test</div>

    const classes=useStyles();
    
    
    
    if(!getCartItems.line_items) return 'Loading....';   
    
    //"Empty Cart" functional component (a function returns some jsx) instead of  Create a separate component
    const EmptyCart=()=>(
        <Typography variant='subtitle1'>You have no itmes in your shopping cart, 
        <Link to='/' className={classes.link}>start adding some</Link>!
        </Typography>
        
    );

    //"Filled Cart" functional component (a function returns some jsx) instead of  Create a separate component
    const FilledCart=()=>(

            
            <>
            <Grid container spacing={3}>
            {getCartItems.line_items.map((item)=>(
                <Grid item xs={12} sm={4} key={item.id}>
                    <CartItem item={item} updateCartQty={updateCartQty} removeCartItem={removeCartItem}/>
                </Grid>
                ))}
            </Grid>
            <div className={classes.cardDetails}>
                <Typography variant="h4">
                    Subtotal: {getCartItems.subtotal.formatted_with_symbol}
                </Typography>
                <div>
                    <Button className={classes.checkoutButton} component={Link} to="/" size="large" type="button" variant="contained" color="primary"   >Back To Products</Button>
                    <Button className={classes.emptyButton} size="large" type="button" 
                    variant="contained" color="secondary" onClick={emptyCart}>Empty Cart</Button>
                    <Button className={classes.checkoutButton} component={Link} to="/checkout" size="large" type="button" variant="contained" color="primary">Checkout</Button>
                </div>
                
            </div>

            </>
        
    )
              

  return (
    <Container>
        <div className={classes.toolbar}/>
        <Typography className={classes.title} variant="h3" gutterBottom>Your Shopping Cart</Typography>
        {!getCartItems.line_items.length? <EmptyCart /> : <FilledCart />}
    </Container>    
  )
}

export default Cart