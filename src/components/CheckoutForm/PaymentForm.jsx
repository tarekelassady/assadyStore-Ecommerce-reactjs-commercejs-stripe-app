import { Typography,Button,Divider } from "@material-ui/core";
import { Elements,CardElement,ElementsConsumer } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Review from './Review';

const PaymentForm = ({getCheckoutToken,getShippingData,backStep,onCaptureCheckout,nextStep,timeout}) => {

  const stripePromise=loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

  const handleSubmit=async(event, elements,stripe)=>{
    event.preventDefault();

    if(!stripe|| !elements) return;
    const cardElement=elements.getElement(CardElement);

    const {error, paymentMethod}=await stripe.createPaymentMethod({type:'card', card:cardElement})

    if (error){
      console.log(error);
    }else{
      const orderData={
        line_items: getCheckoutToken.live.line_items,
        customer:{firstname:getShippingData.firstName,lastname:getShippingData.lastName, email:getShippingData.email},
        shipping: {name: 'Primary', 
        street:getShippingData.address1,
        town_city:getShippingData.city, 
        county_state: getShippingData.getShippingSubdivision,
        posta_zip_code: getShippingData.zip,
        country: getShippingData.getShippingCountry,
        },
        fulfillment: {shipping_method: getShippingData.getShippingOption},
        payment: {
          gateway:'stripe',
          stripe:{
            payment_method_id: paymentMethod.id
          }
        }
      }
      onCaptureCheckout(getCheckoutToken.id,orderData);
      timeout();
      nextStep();
    }

  }
  
  return (
    <>
     <Review getCheckoutToken={getCheckoutToken}/>
     <Divider />
     <Typography variant="h6" style={{margin: '20px 0'}}>Payment Method</Typography>
     <Elements stripe={stripePromise}>
       <ElementsConsumer>
         {({elements,stripe})=>(
           <form onSubmit={(e)=>handleSubmit(e,elements,stripe)}>
             <CardElement />
             <br /><br />
             <div style={{display:'flex', justifyContent:'space-between'}}>
                <Button variant="outlined" onClick={backStep}>Back</Button>
                <Button type="submit" variant="contained" disabled={!stripe} color="primary">
                  Pay {getCheckoutToken.live.subtotal.formatted_with_symbol}
                </Button>

             </div>
           </form>
         )}
       </ElementsConsumer>
    
     </Elements>
    </>
  )
}

export default PaymentForm