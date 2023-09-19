var express = require('express');
var router = express.Router();
const { dbUrl } = require('../Common/dbConfig');
const { cartModel } = require('../Schemas/CartSchemas');
const { foodModel } = require('../Schemas/FoodSchemas');
const { restaurantModel } = require('../Schemas/RestaurantSchemas');
const mongoose = require('mongoose');
const { userModel } = require('../Schemas/UserSchemas');
const { hashPassword, hashCompare, createToken, validate, authenticateToken } = require('../Common/auth')
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken');
const { countModel } = require('../Schemas/CountSchemas');

mongoose.connect(dbUrl)
  .then(() => console.log('Connected!'));




/* GET ALL CART. */
router.get("/getAllCart", async function (req, res, next) {
  try {
    const response = await cartModel.find();

    if (response && response.length > 0) {
      return res.status(200).json({
        success: true,
        message: "Carts fetched successfully!!!",
        data: response,
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "No Cart Found!!!",
        data: response,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching carts.",
      error: error.message,
    });
  }
});



/* CREATE CART. */
router.post("/createCart", async function (req, res, next) {
  const { userId, restaurantId, foodItems, couponApplied, updatedOn } = req.body;
  let total = 0;

  if (!userId || !restaurantId) {
    return res.status(401).json({
      success: false,
      message: "Some data is missing",
      error: "Restaurant or User Details is missing in request",
    });
  }

  if (foodItems.length > 0) {
    foodItems.forEach((food) => {
      total += food.price * food.quantity;
    });
  } else {
    return res.status(401).json({
      success: false,
      message: "Food Items is empty",
      error: "Food Items array is empty",
    });
  }

  try {
    const cart = new cartModel({
      userId,
      restaurantId,
      foodItems,
      couponApplied,
      cartTotal: total,
      updatedOn,
    });

    const response = await cart.save();

    if (response && response._id) {
      return res.status(200).json({
        success: true,
        message: "Cart created successfully!!!",
        data: response,
      });
    }
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Error creating cart",
      error: error.message,
    });
  }
});




/* UPDATE CART. */
router.patch("/updateCart", async function (req, res, next) {
  const { cartId, restaurantId, foodItems, couponApplied } = req.body;
  let total = 0;

  if (!restaurantId) {
    return res.status(401).json({
      success: false,
      message: "Some data is missing",
      error: "User Details is missing in request",
    });
  }

  if (foodItems.length > 0) {
    foodItems.forEach((food) => {
      total += food.price * food.quantity;
    });
  } else {
    return res.status(401).json({
      success: false,
      message: "Food Items is empty",
      error: "Food Items array is empty",
    });
  }

  try {
    const response = await cartModel.findByIdAndUpdate(
      { _id: cartId },
      {
        $set: {
          foodItems,
          restaurantId,
          cartTotal: total,
          couponApplied,
          updateOn: Date.now(),
        },
      }
    );

    if (response && response._id) {
      return res.status(200).json({
        success: true,
        message: "Cart updated successfully!!!",
        data: response,
      });
    }
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Error updating cart",
      error: error.message,
    });
  }
});


/* GET ALL FOOD. */

router.get("/getAllFood/:restaurantId", async function (req, res, next) {
  const { restaurantId } = req.params;

  if (!restaurantId) {
    return res.status(401).json({
      success: false,
      message: "Restaurant id is missing",
      error: "Bad request",
    });
  }

  try {
    const response = await foodModel.find({ restaurantId: restaurantId });

    if (response && response.length > 0) {
      return res.status(200).json({
        success: true,
        message: "Food items fetched successfully!!!",
        data: response,
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "No Food Items Found!!!",
        data: response,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching food items.",
      error: error.message,
    });
  }
});



/* CREATE FOOD. */

router.post("/createFood", async function (req, res, next) {
  const {
    restaurantId,
    foodName,
    foodDescription,
    foodType,
    foodCategory,
    actualPrice,
    offerDetails,
  } = req.body;

  try {
    const food = new foodModel({
      restaurantId,
      foodName,
      foodDescription,
      foodType,
      foodCategory,
      actualPrice,
      offerDetails,
    });

    const response = await food.save();

    if (response && response._id) {
      return res.status(200).json({
        success: true,
        message: "Food created successfully!!!",
        data: response,
      });
    }
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Error creating food",
      error: error.message,
    });
  }
});


/* GRT RESTAURANT. */

router.get("/getAllRestaurant", async function (req, res, next) {
  try {
    const response = await restaurantModel.find();

    if (response.length > 0) {
      res.status(200).json({
        success: true,
        message: "Restaurants fetched successfully!!!",
        data: response,
      });
    } else {
      res.status(200).json({
        success: true,
        message: "No restaurants found!!!",
        data: response,
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Bad request!!!",
      error: error.message,
    });
  }
});


/* CREATE RESTAURANT. */
router.post("/createRestaurant", async function (req, res, next) {
  const {
    name,
    cuisine,
    foodTypes,
    branch,
    address,
    contactNumber,
    defaultRating,
  } = req.body;

  try {
    const restaurant = new restaurantModel({
      name: name,
      cuisine: cuisine,
      foodTypes: foodTypes,
      branch: branch,
      address: {
        city: address.city,
        state: address.state,
        area: address.area,
        country: address.country,
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2,
        pincode: address.pincode,
      },
      contactNumber: contactNumber,
      defaultRating: defaultRating,
    });

    const response = await restaurant.save();

    if (response && response._id) {
      return res.status(200).json({
        success: true,
        message: "Restaurant created successfully!!!",
        data: response,
      });
    }
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Error creating restaurant",
      error: error.message,
    });
  }
});





/* SIGNUP. */
router.post('/signup', async (req, res) => {
  try {
    let user = await userModel.findOne({ email: req.body.email })
    console.log(user)

    if (!user) {
      let hashedPassword = await hashPassword(req.body.password)
      req.body.password = hashedPassword
      let user = await userModel.create({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: req.body.password,

      })
      console.log(user)
      res.status(200).send({
        message: "Users Created Successfully!",
        user,
      })
    }
    else {
      res.status(400).send({
        message: 'Users Already Exists!'
      })
    }

  } catch (error) {
    res.status(500).send({
      message: 'Internal Server Error',
      error
    })
  }
})




/* LOGIN. */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    console.log(user)

    if (user) {
      const passwordMatches = await hashCompare(password, user.password);

      if (passwordMatches) {
        const token = await createToken({
          email: user.email,
          userId: user._id
        });
        console.log(token)
        return res.status(200).send({
          message: 'User Login Successfully!',
          token,
          userId: user._id,
          role: user.role
        });
      } else {
        return res.status(401).send({
          message: 'Invalid Credentials'
        });
      }
    } else {
      return res.status(400).send({
        message: 'User Does Not Exist!'
      });
    }
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).send({
      message: 'Internal Server Error',
      error
    });
  }
});



/* FORGOT. */
router.post("/reset", async (req, res) => {
  try {
    let user = await userModel.findOne({ email: req.body.values.email })
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    const token = jwt.sign({ userId: user.email }, process.env.secretkey, { expiresIn: '1h' });

    let transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.example.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD

      },
    });
    const queryParams = new URLSearchParams();
    queryParams.set('token', token);
    const queryString = queryParams.toString();
    let details = {
      from: "greenpalace1712@gmail.com",
      to: user.email,
      subject: "Hello ✔",
      html: `
        <p>Hello,</p>
        <p>Please click on the following link to reset your password:</p>
        <a href="${process.env.CLIENT_URL}/password?${queryString}">Reset Password</a>
        <p>If you didn't request this, please ignore this email.</p>
      `
    };
    await transporter.sendMail(details)
    res.status(200).send({ message: 'Password reset email sent' })
    console.log(details)


  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error,
    });
  }
});



/* RESET. */
// router.post('/password-reset', async (req, res, next) => {


//   try {
//     const users = await userModel.findOne({ email: req.body.email });

//     const token = req.body.token;

//     let hashedPassword = await hashPassword(req.body.password)


//     let decodedToken = jwt.verify(token, process.env.secretkey)

//     console.log("decoded : " + decodedToken)
//     const userId = decodedToken.userId;

//     const filter = { email: userId };
//     const update = { password: hashedPassword };

//     const doc = await userModel.findOneAndUpdate(filter, update);



//     res.status(200).send({
//       message: "Password Reset successfully",
//     })

//   } catch (error) {
//     res.status(400).send({
//       message: "Some Error Occured",
//     })
//   }
// })
router.post('/password', async (req, res) => {


  try {
    const users = await userModel.findOne({ email: req.body.email });
    console.log(users)
    console.log("reset : " + req.body.password);
    const token = req.body.token;
    console.log(token)
    let hashedPassword = await hashPassword(req.body.password)
    console.log(hashedPassword);

    let decodedToken = jwt.verify(token, process.env.secretkey)

    console.log("decoded : " + decodedToken)
    const userId = decodedToken.userId;
    console.log(userId)
    const filter = { email: userId };
    const update = { password: hashedPassword };

    const doc = await userModel.findOneAndUpdate(filter, update);
    console.log("test");
    console.log(doc);


    res.status(200).send({
      message: "Password Reset successfully",
    })

  } catch (error) {
    res.status(400).send({
      message: "Some Error Occured",
    })
  }
})





/* CREATE CART. */
router.post('/add-to-cart', async (req, res) => {
  try {

    const { userId, itemId, name, count } = req.body;

    const newItem = new countModel({ userId, itemId, name, count });

    const savedItem = await newItem.save();

    res.json(savedItem);
  } catch (error) {
    console.error('Error adding item to the cart:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});





/* GET ALL CART. */
router.get('/get-cart/:userId', async (req, res) => {
  console.log("jyg");
  try {
    const userId = req.params.userId;
    console.log(userId);

    const cartItems = await countModel.find({ userId });

    res.json(cartItems);
  } catch (error) {
    console.error('Error fetching cart items:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});






module.exports = router;
