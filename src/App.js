import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar/Navbar';
import Products from './components/Products/Products';
import Cart from './components/Cart/Cart';
import Checkout from './components/CheckoutForm/Checkout/Checkout';
import { commerce } from './lib/Commerce';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

const App = () => {
    const [getProducts,setProducts]=useState([]);
    const [getCategories, setCategories]=useState([]);
    const [getCartItems, setCartItems]=useState({});
    const [getOrder,setOrder]=useState({});
    const [getErrorMessage,setErrorMessage]=useState('');
    
    const fetchProducts=async()=>{
        try{
            const response=await commerce.products.list();
            if(!response) throw Error('Something wrong');
            setProducts(response.data);
        }catch(err){
            console.log(err.message);
        }
        
    }

    //fetch the cart
    const fetchCartItems=async ()=>{
        const response= await commerce.cart.retrieve();
           setCartItems(response); 
    }
    //add to the cart
    const addToCart = async (productId,quantity)=>{
        const response=await commerce.cart.add(productId,quantity);
        setCartItems(response.cart);
        // We can use:
        // const {cart}=await commerce.cart.add(productId,quantity);
        // setCartItems(cart);
    }
    // update the quantity of as specific item
    const updateCartQty=async (productId,quantity)=>{
        const response=await commerce.cart.update(productId,{quantity});
        setCartItems(response.cart)
    }

    // remove an Item from the cart
    const removeCartItem=async(productID)=>{
        const response=await commerce.cart.remove(productID);
        setCartItems(response.cart);
    }
    
    // empty the cart
    const emptyCart=async()=>{
        const response=await commerce.cart.empty();
        setCartItems(response.cart);
    }

    const refreshCart=async()=>{
        const newCart=await commerce.cart.refresh();
        setCartItems(newCart);
    }
    const handleCaptureCheckout=async(checkoutTokenId,newOrder)=>{
        try{
            const incomingOrder=await commerce.checkout.capture(checkoutTokenId,newOrder);
            setOrder(incomingOrder);
            refreshCart();

        }catch(error){
            setErrorMessage(error.data.error.message);
        }
    }
    useEffect(()=>{
        
        fetchProducts();
        fetchCartItems();
        
    },[])
    //console.log(getProducts);
    //console.log(getCartItems);
   

  return (
    <Router>
        <div>
            <Navbar totalItems={getCartItems.total_items}/>
            <Switch>
                <Route exact path="/">
                    <Products getProducts={getProducts} addToCart={addToCart}/>
                </Route>
                <Route exact path="/cart">
                    <Cart getCartItems={getCartItems}
                    updateCartQty={updateCartQty}
                    removeCartItem={removeCartItem}
                    emptyCart={emptyCart}
                    />    
                </Route>
                <Route exact path="/checkout">
                    <Checkout getCartItems={getCartItems}
                    getOrder={getOrder}
                    onCaptureCheckout={handleCaptureCheckout}
                    error={getErrorMessage}

                    />
                </Route>

            </Switch>
        </div>
            
    </Router>
  )
}

export default App