// nơi xử lý api

const Order = require("../models/OrderProduct");
const Product = require("../models/ProductModel")
const bcrypt = require("bcrypt");
const { generalAccessToken, generalRefreshToken } = require("./JwtService");

const createOrder = (newOrder) => {
  return new Promise(async (resolve, reject) => {
    const {
      orderItems,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
      fullName,
      address,
      city,
      phone,
      user,
      isPaid,
      paidAt
    } = newOrder;
    try { 
      const promises = orderItems.map(async (order) => {
        const productData = await Product.findOneAndUpdate(
          {
          _id: order.product,
          countInStock: {$gte: order.amount}
          },
          {$inc: {
            countInStock: -order.amount,
            selled: +order.amount
          }},
          {new: true}
      )
      console.log("productData", productData)
      if(productData) {
        const createdOrder = await Order.create({
          orderItems,
          shippingAddress: {
            fullName,
            address,
            city,
            phone,
          },
          paymentMethod,
          itemsPrice,
          shippingPrice,
          totalPrice,
          user: user,
          isPaid,
          paidAt,
        });
        if (createdOrder) {
          return{
            status: "OK",
            message: "SUCCESS",
          };
        }
  
      } else {
        return{
          status: "OK",
          message: "ERR",
          id: order.product,
        };
      }

      })
      const results = await Promise.all(promises)
      const newData = results && results.filter((item) => item.id)
      if(newData.length){
        resolve({
          status: "ERR",
          message: `San pham voi id${newData.join(",")} khong du hang`
        })
      }
      resolve({
        status: "OK",
        message: "Success"
      })
      console.log('results', results)
    } catch (e) {
      reject(e);
    }
  });
};

const getAllOrderDetails = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const order = await Order.find({
        user: id,
      });
      if (order === null) {
        resolve({
          status: "OK",
          message: "The order is not defined",
        });
      }

      resolve({
        status: "OK",
        message: "SUCCESS",
        data: order,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getDetailsOrder = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const order = await Order.findById({
        _id: id,
      });
      if (order === null) {
        resolve({
          status: "OK",
          message: "The order is not defined",
        });
      }

      resolve({
        status: "OK",
        message: "SUCCESS",
        data: order,
      });
    } catch (e) {
      reject(e);
    }
  });
};
const cancelOrderDetails = (id, data) => {
  return new Promise(async (resolve, reject) => {
      try {
          let order = []
          const promises = data.map(async (order) => {
              const productData = await Product.findOneAndUpdate(
                  {
                  _id: order.product,
                  selled: {$gte: order.amount}
                  },
                  {$inc: {
                      countInStock: +order.amount,
                      selled: -order.amount
                  }},
                  {new: true}
              )
              if(productData) {
                  order = await Order.findByIdAndDelete(id)
                  if (order === null) {
                      resolve({
                          status: 'ERR',
                          message: 'The order is not defined'
                      })
                  }
              } else {
                  return{
                      status: 'OK',
                      message: 'ERR',
                      id: order.product
                  }
              }
          })
          const results = await Promise.all(promises)
          const newData = results && results[0] && results[0].id
          
          if(newData) {
              resolve({
                  status: 'ERR',
                  message: `San pham voi id: ${newData} khong ton tai`
              })
          }
          resolve({
              status: 'OK',
              message: 'success',
              data: order
          })
      } catch (e) {
          reject(e)
      }
  })
}
module.exports = {
  createOrder,
  getAllOrderDetails,
  getDetailsOrder,
  cancelOrderDetails
};
