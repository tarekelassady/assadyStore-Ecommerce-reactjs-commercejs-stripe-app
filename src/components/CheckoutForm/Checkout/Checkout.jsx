import {Paper, Stepper, Step, StepLabel, Typography, CircularProgress, Divider, Button,CssBaseline} from '@material-ui/core';
import {useState,useEffect} from 'react';
import useStyles from './Styles';
import AddressForm from '../AddressForm';
import PaymentForm from '../PaymentForm';
import {commerce} from '../../../lib/Commerce';
import {Link,useHistory} from 'react-router-dom';

const Checkout = ({getCartItems,getOrder, onCaptureCheckout,getError}) => {
    const [getActiveStep, setActiveStep]= useState(0);
    const [getCheckoutToken, setCheckoutToken]=useState(null);
    const [getShippingData,setShippingData]=useState({});
    const steps=['Shipping Address','Payment details'];
    const [getIsFinished,setIsFinished]=useState(false);
    const classes=useStyles();
    const history=useHistory();
    useEffect(()=>{
        const generateToken=async()=>{
            try {
                const response=await commerce.checkout.generateToken(getCartItems.id,{type: 'cart'});
                setCheckoutToken(response);

            } catch (error) {
                history.push('/');
            }
        }
        generateToken();
    },[getCartItems]);



    
    const nextStep=()=>setActiveStep((prevActiveStep)=>prevActiveStep+1);
    const backStep=()=>setActiveStep((prevActiveStep)=>prevActiveStep-1);

    const next=(data)=>{
        setShippingData(data);
        nextStep();
    }

    //If the customer doesn't have a credit cart
    const timeout=()=>{
        setTimeout(()=>{
            setIsFinished(true);
        },3000);
    }
    
    let Confirmation=()=>getOrder.customer ?(
        <>
            <div>
                <Typography variant="h5">Thank you for your purchase, {getOrder.customer.firstname} {getOrder.customer.lastname}</Typography>
                <Divider className={classes.divider}/>
                <Typography variant="subtitle2">Order ref: {getOrder.customer_reference}</Typography>
            </div>
            <br />
            <Button component={Link} to="/" variant="outlined" type="button">Back to Home</Button>
        </>
    ):getIsFinished?(
        <>
            <div>
                <Typography variant="h5">Thank you for your purchase</Typography>
                <Divider className={classes.divider}/>
            </div>
            <br />
            <Button component={Link} to="/" variant="outlined" type="button">Back to Home</Button>
        </>
    ):(
        <div className={classes.spinner}>
            <CircularProgress />
        </div>
    )
    if(getError){
        <>
        <Typography variant="h5">Error: {getError}</Typography>
        <br />
        <Button component={Link} to="/" variant="outlined" type="button">Back to Home</Button>

        </>

    }


    const Form =()=>getActiveStep===0? 
    <AddressForm getCheckoutToken={getCheckoutToken} next={next}/>
    :<PaymentForm getShippingData={getShippingData} 
    getCheckoutToken={getCheckoutToken} backStep={backStep}
    onCaptureCheckout={onCaptureCheckout} nextStep={nextStep} timeout={timeout}/>
    
  return (
    <>
    <CssBaseline />
        <div className={classes.toolbar}/>
        <main className={classes.layout}>
            <Paper className={classes.paper}>
                <Typography variant="h4" align="center">Checkout</Typography>
                <Stepper className={classes.stepper} activeStep={getActiveStep}>
                {steps.map(step=>(
                    <Step key={step}>
                        <StepLabel>{step}</StepLabel>
                    </Step>
                ))}
                </Stepper>
                {getActiveStep===steps.length?<Confirmation />: getCheckoutToken && <Form />}
            </Paper>

        </main>
    </>
  )
}

export default Checkout