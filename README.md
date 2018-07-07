# sabyasachibiswal/validator

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

### Usage

```javascript

exports.Signup = function(req , res) {    
    
    // Lets assume we have this inputData
    var inputData = {
        name : "Sabyaschi Biswal",
        email : "info@sabyasachibiswal.com",
        password : "my-secret"
    };
    
    // Rules for validations
    var validationRules = {
        name : "required|string",
        email : "required|email",
        password : "required|min:6",
        captcha : "required"
    };
    
    // Optional - Custom messages
    var customMessages = {
        name : {
            required : "Name is required",
            string : "Name must contain only alphabets",
        },
        email : {
            required : "Email is required",
            email : "Email must be a valid email address"
        },
        password : {
            required : "Password is required",
            min : "Password must be minimum 6 characters"
        },
        captcha : {
            required : "Captcha is required"
        }
    };
    
    // Validate
    var validator = new Validator(inputData, validationRules, customMessages).validate();
    
    // Check if validation failed
    if(validator.valid === false){
        // Error
        return res.json({status : "error", errors : validator.getAllErrorsMessages()});
    }else{
        // Create user
        ...
        
        // Return success response
        return res.json({status : "success", message : "Signup successful"});
    }

};



```

