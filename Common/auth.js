const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const saltRound = 10;



const hashPassword = async (password) => {
    let salt = await bcrypt.genSalt(saltRound)

    let hashedPassword = await bcrypt.hash(password, salt)
    return hashedPassword

}

const hashCompare = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword)
}

const createToken = async (payload) => {
    let token = await jwt.sign(payload, process.env.secretkey, { expiresIn: '2m' })
    return token
}

const validate = async (req, res, next) => {
    console.log(req.headers.authorization)
    if (req.headers.authorization) {
        let token = req.headers.authorization.split(" ")[1]
        // console.log(token)
        let data = await jwt.decode(token)
        console.log(data)
        if (Math.floor((+new Date()) / 1000) < data.exp) {
            return next()
        } else {
            res.status(402).send({
                message: "Token Expired"
            })
        }

        return next()
    }
    else {
        return res.status(400).send({
            message: 'Token not found'
        })
    }


    
}


const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.sendStatus(401);
  
    try {
      const decoded = jwt.verify(token, 'your-secret-key');
      req.user = decoded;
      next();
    } catch (error) {
      res.sendStatus(403);
    }
  };
module.exports = { hashPassword, hashCompare, createToken, validate,authenticateToken }