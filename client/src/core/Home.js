import React, { useEffect, useState } from 'react'
import "../styles.css"
import Base from './Base';
import Card from './Card';
import { getAllProducts } from './helper/coreapicalls';

/**
* @author
* @function Home
**/

const Home = (props) => {
  
  const [products, setProducts] = useState([])
  const [error, setError] = useState(false)

  const loadAllProduct = () => {
    getAllProducts().then(data => {
      if(data && data.error) {
        setError(data.error);
      } else {
        setProducts(data.products)
      }
    })
  }

  useEffect(() => {
    loadAllProduct();
  },[]);
  
  return(
    <Base title="Home Page" description="Welcome to the T-shirt Store">
      <div className="row text-center">
        <h1 className="text-light">All of tshirts</h1>
        <div className="row">
          {products.map((product, index) => {
            return (
              <div key={index} className="col-4 mb-4">
                <Card product={product} />
              </div>
            )
          })}
        </div>
       
      </div>
    </Base>
   )

 }

export default Home