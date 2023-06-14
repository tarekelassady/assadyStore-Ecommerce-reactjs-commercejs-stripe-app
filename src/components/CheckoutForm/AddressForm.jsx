import { InputLabel,Select, MenuItem, Button,Grid,Typography } from "@material-ui/core";
import {useForm,FormProvider} from 'react-hook-form';
import FormInput from './FormInput';
import {useState,useEffect} from 'react';
import {commerce} from '../../lib/Commerce';
import {Link} from 'react-router-dom';

const AddressForm = ({getCheckoutToken,next}) => {
  const methods=useForm();
  const [getShippingCountries, setShippingCountries] = useState([]);
  const [getShippingCountry, setShippingCountry] = useState('');
  const [getShippingSubdivisions, setShippingSubdivisions] = useState([]);
  const [getShippingSubdivision, setShippingSubdivision] = useState('');
  const [getShippingOptions, setShippingOptions] = useState([]);
  const [getShippingOption, setShippingOption] = useState('');

  //Get Shipping Countries
  const fetchShippingCountries=async(checkoutTokenId)=>{
    const response=await commerce.services.localeListShippingCountries(checkoutTokenId);
    setShippingCountries(response.countries); 
    setShippingCountry(Object.keys(response.countries)[0]);
  }
  useEffect(()=>{
    fetchShippingCountries(getCheckoutToken.id);
  },[]);

  const countries=Object.entries(getShippingCountries).map(([code,name])=>({id:code,label:name}));

  //Get Shipping Subdivisions
  const fetchShippingSubdivisions=async(checkoutTokenId,countryCode)=>{
    const response=await commerce.services.localeListShippingSubdivisions(checkoutTokenId,countryCode);
    setShippingSubdivisions(response.subdivisions);
    setShippingSubdivision(Object.keys(response.subdivisions)[0]);
  }
  useEffect(()=>{
    if(getShippingCountry) fetchShippingSubdivisions(getCheckoutToken, getShippingCountry);
  },[getShippingCountry]);

  const subdivisions=Object.entries(getShippingSubdivisions).map(([code,name])=>({id:code,label:name}));
  
  //Get Shipping Options
  const fetchShippingOptions=async(checkoutTokenId,country,region=null)=>{
    const response=await commerce.checkout.getShippingOptions(checkoutTokenId,{country,region});
    setShippingOptions(response);
    setShippingOption(response[0].id);
  }
  useEffect(()=>{
    if(getShippingSubdivision) fetchShippingOptions(getCheckoutToken.id,getShippingCountry,getShippingSubdivision)
    
  },[getShippingSubdivision])
  //console.log(getShippingOptions);
  const shippingOptions=getShippingOptions.map((sO)=>({id:sO.id,label:`${sO.description} - (${sO.price.formatted_with_symbol})`}));

  return (
    <>
      <Typography variant="h6" gutterBottom>Shipping Address</Typography>
      <FormProvider { ...methods}>
        <form onSubmit={methods.handleSubmit(data=>next({...data,getShippingCountry,getShippingSubdivision,getShippingOption}))}>
          <Grid container spacing={3}>
            <FormInput requried name='firstName' label='First Name'/>
            <FormInput requried name='lastName' label='Last Name'/>
            <FormInput requried name='address1' label='Address'/>
            <FormInput requried name='email' label='Email'/>
            <FormInput requried name='city' label='City'/>
            <FormInput requried name='zip' label='ZIP/ Postal Code'/>
            <Grid xs={12} sm={6}>
              <InputLabel>Shipping Country</InputLabel>
              <Select value={getShippingCountry} fullWidth onChange={(e)=>setShippingCountry(e.target.value)}>
                {countries.map(country=>(
                  <MenuItem key={country.id} value={country.id}>
                  {country.label}
                </MenuItem>
              
                ))}
                  
                
              </Select>
            </Grid>
            <Grid xs={12} sm={6}>
              <InputLabel>Shipping Subdivision</InputLabel>
              <Select value={getShippingSubdivision} fullWidth onChange={(e)=>setShippingSubdivision(e.target.value)}>
                {subdivisions.map(subdivision=>(
                  <MenuItem key={subdivision.id} value={subdivision.id}>
                    {subdivision.label}
                  </MenuItem>
                ))}
                </Select>
              
              
            </Grid>
            <Grid xs={12} sm={6}>
              <InputLabel>Shipping Option</InputLabel>
              <Select value={getShippingOption} fullWidth onChange={(e)=>setShippingOption(e.target.value)}>
                {shippingOptions.map(option=>(
                  <MenuItem key={option.id} value={option.id}>
                    {option.label}
                </MenuItem>
                ))}
                
              </Select>
            </Grid>
          </Grid>
          <br/>
          <div style={{display:'flex',justifyContent:'space-between'}}>
            {getShippingOption&&
            <>
              <Button variant="outlined" component={Link} to="/cart">Back To Cart</Button>
              <Button type="submit" variant="contained" color="primary" >Next</Button>
            </>
            }
          </div>
        </form>

      </FormProvider> 
    </>
  )
}

export default AddressForm