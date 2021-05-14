var email_validator = require("email-validator");

module.exports.validateRegisterInput = (
  username,
  email,
  password,
  confirmpassword
) => {
  const errors = {};
  if (username.trim() == "") {
    errors.username = "Username must not be empty";
  }
  if (email.trim() == "") {
    errors.email = "email must not be empty";
  } else {
    const e_valid = email_validator.validate(email);

    console.log(e_valid);
    if (!e_valid) {
      errors.email = "EMAIL not valid";
    }
  }
  if (password.trim() == "") {
    errors.password = "password must not be empty";
  } else if (password !== confirmpassword) {
    errors.password = "Passwords not match";
  }

  return {
    errors,
    valid: Object.keys(errors) < 1,
  };
};

module.exports.validateLoginInput = (username, password) => {
  const errors = {};
  if (username.trim() == "") {
    errors.username = "Username must not be empty";
  }

  if (password.trim() == "") {
    errors.password = "password must not be empty";
  }

  return {
    errors,
    valid: Object.keys(errors) < 1,
  };
};
