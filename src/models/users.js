const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./tasks')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 7,
    trim: true,
    validate(value) {
      if (value.toLowerCase().includes("password")) {
        throw new Error("Cannot keep password as password");
      }
    }
  },
  age: {
    type: String,
    default: 0
  },
  tokens:[{
    token:{
      type: String,
      required: true
    }
  }],
  avatar:{
    type: Buffer
  }
},{
  timestamps: true
});

userSchema.methods.generateAuthToken = async function(){
  const user = this
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)

  user.tokens = user.tokens.concat({token})
  await user.save()

  return token
}

userSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'owner'
})

userSchema.methods.toJSON= function(){
  let user = this
  let userObject = user.toObject()

  delete userObject.password
  delete userObject.tokens
  delete userObject.avatar

  return userObject
}

userSchema.statics.findByCredentials= async (email, password)=>{
  
    const user = await User.findOne({email})

    if(!user) {
      throw new  Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch) { throw new Error('Unable to login')}

  return user

}

//hash the plain text password before saving
userSchema.pre('save', async function(next){
  const user = this

  if(user.isModified('password')){
    user.password = await bcrypt.hash(user.password, 8)
  }

  next()
})

userSchema.pre('remove', async function(next){
  const user = this
  await Task.deleteMany({owner: user._id})
  next()
})

const User = mongoose.model("User", userSchema );

module.exports = User
