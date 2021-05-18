import React, { useEffect, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { isAuthenticated } from '../auth/helper';
import Base from '../core/Base';
import { updateProduct, getProduct, getAllCategories } from './helper/adminapicall';


/**
* @author
* @function UpdateProduct
**/

const UpdateProduct = ({ match }) => {

    const { user, token } = isAuthenticated();

    const [values, setValues] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        image: "",
        categories: [],
        category: "",
        error: "",
        updatedProduct: "",
        getaRedirect: false,
        formData: ""
    });

    const { name, description, price, stock, categories, error, updatedProduct, getaRedirect, formData } = values

    const preload = (productId) => {
        getProduct(productId).then(data => {
            if(data && data.error) {
                setValues({ ...values, error: data.error })
            } else {
                setValues({ 
                    ...values,
                    name: data.product.name,
                    description: data.product.description,
                    price: data.product.price,
                    category: data.product.category._id,
                    stock: data.product.stock,
                    formData: new FormData()
                });
                preloadCategories();
            }
        });
    };
    
    const preloadCategories = () => {
        getAllCategories()
            .then(data => {
                if(data && data.error) {
                    setValues({ ...values, error: data.error })
                } else {
                    setValues({
                        categories: data.categories, formData: new FormData()
                    })
                }
            })
    }

    useEffect(() => {
        preload(match.params.productId);
    }, []);

    const onSubmit = (event) => {
        event.preventDefault();
        setValues({ ...values, error: "", loading: true })
        updateProduct(match.params.productId, user._id, token, formData)
            .then(data => {
                if(data && data.error) {
                    setValues({ ...values, error: data.error })
                } else {
                    setValues({
                        ...values,
                        name: "",
                        description:"",
                        price: "",
                        image: "",
                        stock: "",
                        updatedProduct: data.product.name
                    })
                    setTimeout(() => {setValues({ ...values, getaRedirect: true})}, 2000)
                }
            })
    }

    const handleChange = name => event => {
        const value = name === "image" ? event.target.files[0] : event.target.value;
        formData.set(name, value);
        setValues({ ...values, [name]: value })
    }

    const successMessage = () => (
        <>
        <div className="alert alert-success mt-3" style={{display: updatedProduct ? "" : "none"}}>
           <h4>{updatedProduct} updated successfully!</h4>
        </div>
        </>
    );

    const errorMessage = () => (
        <div className="alert alert-danger mt-3" style={{display: error ? "" : "none"}}>
           <h4>Failed to update Product! {error}</h4>
        </div>
    );

    const performRedirect = () => {
        if(getaRedirect) {
           return <Redirect to="/admin/dashboard" />
        }
    }


    const createProductForm = () => (
        <form >
          <span>Post photo</span>
          <div className="form-group my-3">
            <label className="btn w-100 btn-success">
              <input
                onChange={handleChange("image")}
                type="file"
                name="image"
                accept="image"
                placeholder="choose a file"
              />
            </label>
          </div>
          <div className="form-group my-3">
            <input
              onChange={handleChange("name")}
              name="photo"
              className="form-control"
              placeholder="Name"
              value={name}
            />
          </div>
          <div className="form-group my-3">
            <textarea
              onChange={handleChange("description")}
              name="photo"
              className="form-control"
              placeholder="Description"
              value={description}
            />
          </div>
          <div className="form-group my-3">
            <input
              onChange={handleChange("price")}
              type="number"
              className="form-control"
              placeholder="Price"
              value={price}
            />
          </div>
          <div className="form-group my-3">
            <select
              onChange={handleChange("category")}
              className="form-control"
              placeholder="Category"
            >
              <option>Select</option>
              {categories &&
              categories.map((cate, index) => (
                <option key={index} value={cate._id}>{cate.name} </option>
              ))
              }
            </select>
          </div>
          <div className="form-group my-3">
            <input
              onChange={handleChange("stock")}
              type="number"
              className="form-control"
              placeholder="Quantity"
              value={stock}
            />
          </div>
          
          <button type="submit" onClick={onSubmit} className="btn btn-outline-success my-3">
            Update Product
          </button>
        </form>
      );

  return(
        <Base 
            title="Add a product here!"
            description="Welcome to product creation section!"
            className="container bg-info p-4"
        >
             <Link className="btn btn-md btn-success mb-3" to="/admin/dashboard">
                Admin Home
            </Link>
            <div className="row bg-dark text-white rounded">
                <div className="col-md-8 offset-md-2">
                    {successMessage()}
                    {errorMessage()}
                   {createProductForm()}
                   {performRedirect()}
                </div>
            </div>
        </Base>
   )

 }

export default UpdateProduct