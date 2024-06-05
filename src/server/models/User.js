import mongoose from 'mongoose';
import validator from 'validator';
const isEmail = validator.isEmail;

const UserSchema = new mongoose.Schema({
  email:{
    type: String,
    required: [true, 'Email is required.'],
    unique: true,
    validate: [
      { validator: isEmail, message: 'Please enter a valid email.' },
      { validator: (value) => {
          return User.findOne({ email: value }).then((user) => {
              if (user) return Promise.resolve(false);
          })
        },
        message: 'Email is already in use.'
      }
    ]
  },

  username:{
    type: String,
    required: [true, 'Username is required.'],
    unique: true,
    minlength: 3,
    maxlength: 15,
    validate: [{
      validator: (value) => {
        return User.findOne({ username: value }).then((user) => {
          if (user) return Promise.resolve(false);
        })
      },
      message: 'Username is already in use.'
    }, {
      validator: (value) => {
        const usernameRegex = /^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/;
        return usernameRegex.test(value);
      },
      message: () => 'Username should only contain alphanumerics, underscores, and hyphens.'
    }]
  },

  password:{
    type: String,
    required: [true, 'Password is required.'],
    minlength: 8,
    maxlength: 64,
  },
});




const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;