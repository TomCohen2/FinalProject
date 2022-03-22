const express = require("express");
const router = express.Router();
const Order = require("../models/order");
const { OrderItem } = require("../models/orderItem");

router.get(`/`, async (req, res) => {
  const ordersList = await Order.find()
    .populate("user", "email")
    .sort({ dateOrder: -1 });
  if (!ordersList) {
    res.status(500).json({
      success: false,
    });
  }
  res.send(ordersList);
});

router.get(`/:id`, async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "email")
    .populate({
      path: "orderItems",
      populate: {
        path: "product",
        populate: "category",
      },
    });

  if (!order) {
    res.status(500).json({
      success: false,
    });
  }
  res.send(order);
});

router.put("/:id", async (req, res) => {
  Order.findById(req.params.id, async (err, order) => {
    if (err) {
      res.status(500).json({
        success: false,
        message: "Error updating order",
      });
    }
    if (order) {
      order.status = req.body.status;
      order.save((err, order) => {
        if (err) {
          res.status(500).json({
            success: false,
            message: "Error updating order",
          });
        }
        res.send(order);
      });
    }
  });
});

router.delete("/:id", async (req, res) => {
  Order.findByIdAndDelete(req.params.id, async (err, order) => {
    if (err) {
      res.status(500).json({
        success: false,
        message: "Error deleting order",
      });
    }
    if (order) {
      await OrderItem.deleteMany({ order: req.params.id });
      res.send(order);
    }
  });
});

// router.post("/", async (req, res) => {
//   const orderItemsIds = Promise.all(
//     req.body.orderItems.map(async (orderItem) => {
//       let newOrderItem = new OrderItem({
//         quantity: orderItem.quantity,
//         product: orderItem.product,
//       });

//       newOrderItem = await newOrderItem.save();

//       return newOrderItem._id;
//     })
//   );
//   const orderItemsIdsResolved = await orderItemsIds;

//   const totalPrices = await Promise.all(
//     orderItemsIdsResolved.map(async (orderItemId) => {
//       const orderItem = await OrderItem.findById(orderItemId).populate(
//         "product"
//       );
//       console.log("Current ITEM:" + orderItem.product);
//       return orderItem.quantity * 10;
//     })
//   );

//   const totalPrice = totalPrices.reduce((acc, curr) => acc + curr, 0);

//   console.log("total prices array: " + totalPrices);

//   let order = new Order({
//     orderItems: orderItemsIdsResolved,
//     shippingAddress1: req.body.shippingAddress1,
//     address: req.body.address,
//     status: req.body.status,
//     totalPrice: totalPrice,
//     user: req.body.user,
//   });
//   order = await order.save();

//   if (!order) return res.status(400).send("the order cannot be created!");

//   res.send(order);
// });

router.post("/", async (req, res) => {
  const orderItemsIds = Promise.all(
    req.body.orderItems.map(async (orderItem) => {
      let newOrderItem = new OrderItem({
        quantity: orderItem.quantity,
        product: orderItem.product,
      });

      newOrderItem = await newOrderItem.save();

      return newOrderItem._id;
    })
  );
  const orderItemsIdsResolved = await orderItemsIds;

  const totalPrices = await Promise.all(
    orderItemsIdsResolved.map(async (orderItemId) => {
      const orderItem = await OrderItem.findById(orderItemId).populate(
        "product",
        "price"
      );
      const totalPrice = orderItem.product.price * orderItem.quantity;
      return totalPrice;
    })
  );

  const totalPrice = totalPrices.reduce((a, b) => a + b, 0);

  let order = new Order({
    orderItems: orderItemsIdsResolved,
    address: req.body.address,
    status: req.body.status,
    totalPrice: totalPrice,
    user: req.body.user,
  });
  order = await order.save();

  if (!order) return res.status(400).send("the order cannot be created!");

  res.send(order);
});

module.exports = router;

// {
// 	"orderItems": [
// 		"6229e18fcb12743ed7b310a4",
// 		"622a01791dbdb51a1141e8ce"
// 	],
// 	"user": "6229e7051f81ff1188b180dc",
// 	"status": "WAITING FOR DELIVERY",
// 	"address": "Tel-Aviv, IL",
// 	"dateOrder": "2022-03-11T11:51:09.014Z",
// 	"__v": 0
// }
