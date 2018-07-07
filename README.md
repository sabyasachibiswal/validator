# sabyasachibiswal/validator

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]

Node.js validators - Data validator engine for validating input data / form data, with customisable error messages for each field.

## Getting started


### Install via npm 

```sh
npm install --save @sabyasachibiswal/validator
```

### Import the module

```javascript
var Validator = require("@sabyasachibiswal/validator");
```

### Usage : 

```javascript
var inputData = {
    name : "Sabyaschi Biswal",
    email : "info@sabyasachibiswal.com",
    password : "my-secret"
};

var validationRules = {
                name : "required|string|nospecial",
                email : "required|email",
                password : "required|min:6",
                captcha : "required"
            };

            var customMessages = {
                name : {
                    required : "Name is required",
                    string : "Name must contain only alphabets",
                    nospecial : "Name shouldn't contain any special characters"
                },
                email : {
                    required : "Email is required",
                    email : "Email must be a valid email address"
                },
                mobile : {
                    password : "Mobile field is missing",
                    mobile_with_country_code : "Must be a valid mobile number with country code"
                },
                captcha : {
                    required : "Captcha is required"
                }
            };

            var validator = new Validator(inputData, validationRules, customMessages);
            validator = validator.validate();
            if(validator.valid === false){
                // Error
                var errors = validator.getAllErrorsMessages();
                return res.json({status : "error", errors : errors});
            }else{
                // Create user
                
                // Return success response
                return res.json({status : "success", message : "Signup successful"});
            }

```

