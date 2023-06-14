import { Typography, Button, Card, CardActions,CardContent,CardMedia } from "@material-ui/core"
import useStyles from './Styles';

const CartItem = ({item, updateCartQty,removeCartItem}) => {
    const classes=useStyles();

    return (
    <Card>
        <CardMedia className={classes.media} image={item.image.url} alt={item.name}/>
        <CardContent className={classes.cardContent}>
            <Typography variant="h5">{item.name}</Typography>
            <Typography variant="h6">{item.line_total.formatted_with_symbol}</Typography>
        </CardContent>
        <CardActions className={classes.cardActions}>
            <div className={classes.buttons}>
                <Button type="button" size="small" disabled={item.quantity===1} onClick={()=>updateCartQty(item.id, item.quantity-1)}>-</Button>
                <Typography>{item.quantity}</Typography>
                <Button type="button" size="small" onClick={()=>updateCartQty(item.id, item.quantity+1)}>+</Button>
            </div>
            <Button variant="contained" type="button" color="secondary" onClick={()=>removeCartItem(item.id)}>Remove</Button>
        </CardActions>
    </Card>
  )
}

export default CartItem