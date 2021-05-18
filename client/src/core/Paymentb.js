import React, { useEffect, useState } from 'react';
import { getmeToken, processPayment } from './helper/paymentbhelper';
import { Link } from 'react-router-dom';
import { createOrder } from './helper/orderHelper';
import { loadCart, emptyCart } from './helper/cartHelper';
import { isAuthenticated } from '../auth/helper/index';

import DropIn from 'braintree-web-drop-in-react'

/**
* @author
* @function Paymentb
**/

const Paymentb = ({ products, setReload = f => f, reload = undefined }) => {

  const [info, setInfo] = useState({
    loading: false,
    success: false,
    clientToken: null,
    error: "",
    instance: {}
  });

  const userId = isAuthenticated() && isAuthenticated().user._id;
  const token = isAuthenticated() && isAuthenticated().token;

  const getToken = (userId, token) => {
    getmeToken(userId, token)
      .then(info => {
        console.log("Information", info)
        if(info && info.error) {
          setInfo({ ...info, error: info.error })
        } else {
          const clientToken = info.clientToken;
          setInfo({clientToken})
        }
      })
  };

  const showbtdropin = () => {
    return (
      <div>
        {info.clientToken !== null && products.length > 0 ? (
           <div>
           <DropIn
             options={{ authorization: info.clientToken }}
             onInstance={(instance) => (setInfo({ ...info, instance: instance }))}
           />
           <button className="btn w-100 btn-success" onClick={onPurchase}>Buy</button>
         </div>
        ) : (<h3>Please Log In or add something to cart</h3>)}
      </div>
    )
  }
  
  useEffect(() => {
    getToken(userId, token)
  }, []);

  const onPurchase = () => {
    setInfo({ ...info, loading: true })
    let nonce;
    let getNonce =info.instance.requestPaymentMethod().then(data => {
        console.log(data)
        nonce = data.nonce
        const paymentData = {
          paymentMethodNonce: nonce,
          amount: getAmount()
        };

        processPayment(userId, token, paymentData)
        .then(response => {
          console.log("Payment Success", response)
          setInfo({ ...info, success: response.success, loading: false })
          const orderData = {
            products: products,
            transaction_id: response.transaction.id,
            amount: response.transaction.amount
          }
          createOrder(userId, token, orderData);
          emptyCart(() => {
            console.log("Did we got a crash?")
          });
          setReload(!reload)
        })
        .catch(error => {
          console.log("Payment Failed", error)
          setInfo({ loading: false, success: false })
        })
      })
}

  const getAmount = () => {
    let amount = 0;
    products.map(p => (
       amount = amount + p.price
    ))
    return amount
  }

  return(
    <div>
        <h1>Your Bill Is {getAmount()} $ </h1>
        {showbtdropin()}
    </div>
   )

 }

export default Paymentb