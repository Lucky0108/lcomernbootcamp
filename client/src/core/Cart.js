import React, { useEffect, useState } from 'react'
import "../styles.css"
import Base from './Base';
import Card from './Card';
import { loadCart } from './helper/cartHelper';
import Paymentb from './Paymentb';

/**
* @author
* @function Cart
**/

const Cart = (props) => {
  
  const [products, setProducts] = useState([])
  const [reload, setReload] = useState(false)

  useEffect(() => {
    setProducts(loadCart())
  }, [reload])

  const loadAllProducts = products => {
    return (
      <div>
        <h2>This section is to load products</h2>
        {products.map((product,index) => {
          return (
            <Card 
            key={index}
            product={product}
            removeFromCart={true}
            addToCart={false}
            setReload={setReload}
            reload={reload}
            />
          )
        })}
      </div>
    )
  }
  
  return(
    <Base title="Cart Page" description="Ready To Checkout">
        <div className="row text-center">
          <div className="col-6">{products.length > 0 ? (loadAllProducts(products)) : ( <h3>NO Products in cart</h3> )}</div>
          <div className="col-6"><Paymentb products={products} setReload={setReload} /> </div>
        </div>
    </Base>
   )

 }

export default Cart