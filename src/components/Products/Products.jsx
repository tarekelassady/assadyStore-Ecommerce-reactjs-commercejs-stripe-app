import React from 'react';
import {Grid} from '@material-ui/core';
import Product from './Product/Product';
import useStyles from './Styles';


const Products =({getProducts, addToCart})=>{
    const classes=useStyles();
    return(
        <main className={classes.content}>
            <div className={classes.toolbar}/>
            <Grid container justifyContent="center" spacing={4}>
                {getProducts.map((product)=>
                    <Grid item key={product.id} sx={12} sm={6} md={4} lg={3}>
                        <Product product={product} addToCart={addToCart}/>
                    </Grid> /* sx on mobile, sm small, md medium lg large */
        
                )}
            </Grid>
    </main>

    )
    
}

export default Products;