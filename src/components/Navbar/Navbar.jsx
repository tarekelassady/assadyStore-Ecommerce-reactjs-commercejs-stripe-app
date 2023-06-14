import React from 'react';
import {AppBar,Toolbar,IconButton,Badge,MenuItem,Menu,Typography} from '@material-ui/core';
import {ShoppingCart} from '@material-ui/icons';
import logo from '../../assets/store.png';
import useStyles from './Styles';
import { Link,useLocation } from 'react-router-dom';

const Navbar = ({totalItems}) => {
    const classes=useStyles();
    const location=useLocation();
  return (
    <>
        <AppBar className={classes.appBar} position="fixed" color="inherit">
            <Toolbar>
                {/* Logo and Web App title */}
                <Typography component={Link} to="/" className={classes.title} variant="h6" color="inherit">
                    <img className={classes.image} src={logo} alt="Commerce.js" height="40px" />
                    Assady Store
                </Typography>
                {/* Menus */}
                <div className={classes.grow} />
                {/* Cart */}
                {location.pathname!=='/cart' && (
                    
                <div className={classes.button}>
                    <IconButton component={Link} to="/cart" aria-label="Show cart items" color="inherit">
                        <Badge badgeContent={totalItems} color="secondary">
                            <ShoppingCart/>
                        </Badge>
                    </IconButton>
                </div>
                )}
                
                
            </Toolbar>
        </AppBar>
    </>
  )     
}

export default Navbar