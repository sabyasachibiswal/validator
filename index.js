/**
 * Created by sabyasachi on 07/07/18.
 */
/**
 * Created by sabyasachi on 14/09/17.
 */

var sprintf = require("sprintf-js").sprintf, vsprintf = require("sprintf-js").vsprintf;


/**
 * TO - DO
 * 1. SAME  : same as another field name , or same as given variable
 * 2. Exists  IN DB
 *
 *
 */


/**
 * CONSTANTS
 * DEFAULT ERROR MESSAGE PLACE HOLDERS
 * @type {string}
 */
const DEFAULT_ERROR_MESSAGES  = {
    "email": "%s is invalid",
    "mobile" : "%s is not a mobile",
    "mobile_with_country_code" : "%s is not a valid mobile with country code",
    "alphabets" : "%1$s should contain only alphabets",
    "string" : "%1$s should contain only alphabets and space",
    "number" : "%1$s should be a number",
    "nospecial" : "%1$s shouldn't contain special characters",
    "required" : "%s is required",
    "max" : "%1$s shouldn't be more than %2$s",
    "min" : "%1$s shouldn't be less than %2$s",
    "len" : "%1$s should be exactly %2$s characters long",
    "in_string" : "%1$s should be one of the value from : %2$s ",
};

/**
 * VALIDATOR - CONSTRUCTOR
 * @param inputData
 * @param rules
 * @param messages
 * @constructor
 */
function Validator(inputData, rules, messages) {
    this.inputs = inputData;
    this.rules = rules;
    this.customMessages = messages;
    this.errorMessages = {};
    this.allErrorMessages = {};
    this.valid = true;
};

/**
 * VALIDATE METHOD
 * @returns {Validator}
 */
Validator.prototype.validate = function() {

    Object.keys(this.rules).forEach(function(field) {
        var fieldRuleStr = this.rules[field].trim();
        var fieldRules = fieldRuleStr.split('|');
        fieldRules.forEach( function(aRule) {

            if(aRule == undefined || aRule == null || aRule.trim().length <= 0){
                throw new Error('Invalid validation rule type provided : ' + aRule);
            }

            var aRule = aRule.trim();

            if (aRule === "email") {
                // validate email
                if (!this.email(this.inputs[field])) {
                    this.setError(field, aRule);
                }
            } else if (aRule === "mobile") {
                // validate mobile
                if (!this.mobile(this.inputs[field])) {
                    this.setError(field, aRule);
                }
            }
            else if (aRule === "mobile_with_country_code") {
                // validate mobile_with_country_code
                if (!this.mobile_with_country_code(this.inputs[field])) {
                    this.setError(field, aRule);
                }
            }
            else if (aRule === "alphabets") {
                // validate alphabets
                if (!this.alphabets(this.inputs[field])) {
                    this.setError(field, aRule);
                }
            }
            else if (aRule === "string") {
                // validate alphabets
                if (!this.string(this.inputs[field])) {
                    this.setError(field, aRule);
                }
            }
            else if (aRule === "number") {
                // validate number
                if (!this.number(this.inputs[field])) {
                    this.setError(field, aRule);
                }
            }
            else if (aRule === "nospecial") {
                // validate nospecial
                if (!this.nospecial(this.inputs[field])) {
                    this.setError(field, aRule);
                }
            }
            else if (aRule === "required") {
                // validate mobile
                if (!this.required(this.inputs, field)) {
                    this.setError(field, aRule);
                }
            }
            else if (aRule.substring(0, 3) === "min") {
                // validate min
                var defaultMinValue = -1;
                var minSplits = aRule.split(':');
                if (minSplits.length === 2) {
                    if (!isNaN(minSplits[1])) {
                        defaultMinValue = Number(minSplits[1]);
                    }
                }

                if (defaultMinValue < 0) {
                    throw Error('invalid way to use min validator');
                }

                if (!this.min(this.inputs[field], defaultMinValue)) {
                    this.setError(field, aRule);
                }
            }
            else if (aRule.substring(0, 3) === "max") {
                // validate min
                var defaultValue = -1;
                var maxSplits = aRule.split(':');
                if (maxSplits.length === 2) {
                    if (!isNaN(maxSplits[1])) {
                        defaultValue = Number(maxSplits[1]);
                    }
                }

                if (defaultValue < 0) {
                    throw Error('invalid way to use max validator');
                }

                if (!this.max(this.inputs[field], defaultValue)) {
                    this.setError(field, aRule);
                }
            }
            else if (aRule.substring(0, 3) === "min") {
                // validate min
                var defaultValue = -1;
                var maxSplits = aRule.split(':');
                if (maxSplits.length === 2) {
                    if (!isNaN(maxSplits[1])) {
                        defaultValue = Number(maxSplits[1]);
                    }
                }

                if (defaultValue < 0) {
                    throw Error('invalid way to use min validator');
                }

                if (!this.min(this.inputs[field], defaultValue)) {
                    this.setError(field, aRule);
                }
            }
            else if (aRule.substring(0, 3) === "len") {
                // validate len
                var defaultValue = -1;
                var maxSplits = aRule.split(':');
                if (maxSplits.length === 2) {
                    if (!isNaN(maxSplits[1])) {
                        defaultValue = Number(maxSplits[1]);
                    }
                }

                if (defaultValue < 0) {
                    throw Error('invalid way to use len validator');
                }

                if (!this.len(this.inputs[field], defaultValue)) {
                    this.setError(field, aRule);
                }
            }
            else if (aRule.substring(0, 9) === "in_string") {

                // validate in_string
                var inStringSplits = aRule.split(':');
                var strArr = [];
                if(inStringSplits.length === 2){
                    strArr = inStringSplits[1].trim().split(',').map(Function.prototype.call, String.prototype.trim);
                }else{
                    throw Error('invalid way to use in_string validator');
                }

                if(strArr.length <= 0){
                    throw Error('invalid way to use in_string validator');
                }

                if (!this.in_string(this.inputs[field], strArr)) {
                    this.setError(field, aRule);
                }
            }
            else{
                throw new Error('Undefined validation rule type : ' + aRule);
            }


        }.bind(this) );
    }.bind(this) );

    // filter out error messages
    return this;

};

/**
 * SET ERROR
 * @param field
 * @param rule
 */
Validator.prototype.setError = function(field, rule) {

    this.valid = false;

    // check if rule is something like min:5 , max:5, unique:email
    var sanitizedRuleStr = this.sanitizeRule(rule);
    var paramsArr = [field]; // default paramArr contains field name
    paramsArr = paramsArr.concat(this.getRuleParams(rule));

    // get the default error
    var e = {}; e[sanitizedRuleStr] = vsprintf(DEFAULT_ERROR_MESSAGES[sanitizedRuleStr], paramsArr);

    // replace with custom error object if required
    if(this.customMessages.hasOwnProperty(field) && this.customMessages[field] !== null && this.customMessages[field] !== undefined ) {
        var customFieldErrObj = this.customMessages[field];
        if(customFieldErrObj.hasOwnProperty(sanitizedRuleStr) && customFieldErrObj[sanitizedRuleStr] !== null && customFieldErrObj[sanitizedRuleStr] !== undefined && customFieldErrObj[sanitizedRuleStr].trim().length > 0 ){
            e[sanitizedRuleStr] = customFieldErrObj[sanitizedRuleStr].trim();
        }
    }

    // add property
    if( this.errorMessages.hasOwnProperty(field) && this.errorMessages[field] !== undefined && this.errorMessages[field] !== null ){
        this.errorMessages[field][sanitizedRuleStr] = e[sanitizedRuleStr];
    }else{
        this.errorMessages[field] = e;
    }

};

/**
 * GET ALL ERRORS
 * Returns all errors and with field name as key and error messages as array of strings
 * {
 *  email : [
 *      "Email is required",
 *      "Invalid Email"
 *  ],
 *  password : [
 *      "Password is required",
 *      "Password must be same as confirm password"
 *  ]
 * }
 * @param field
 * @param rule
 */

Validator.prototype.getAllErrorsMessages = function() {
    Object.keys(this.errorMessages).forEach(function(aFieldName) {
        this.allErrorMessages[aFieldName] = this.getAllErrorMessagesFor(aFieldName);
    }.bind(this) );
    return this.allErrorMessages;
};

/**
 * GET ALL ERROR MESSAGES FOR A SPECIFIC FIELD
 * @param fieldName
 * @returns {Array}
 */
Validator.prototype.getAllErrorMessagesFor = function(fieldName) {

    var retErrArr = [];
    if(this.errorMessages.hasOwnProperty(fieldName) && this.errorMessages[fieldName] !== null && this.errorMessages[fieldName] !== undefined ){
        var aErrorMessageObj = this.errorMessages[fieldName];
        var keysOfErrMsgObj = Object.keys(aErrorMessageObj);
        for(var x = 0; x < keysOfErrMsgObj.length; x++){
            var aRuleKey = keysOfErrMsgObj[x];
            var errorStr = aErrorMessageObj[aRuleKey];
            if(errorStr !== undefined && errorStr !== null && errorStr.trim().length > 0 ) {
                retErrArr.push(errorStr);
            }
        }
    }
    return retErrArr;
};


/**
 * GET ALL ERROR MESSAGES FOR A SPECIFIC FIELD
 * @param fieldName
 * @returns {Array}
 */
Validator.prototype.getFirstErrorMessageFor = function(fieldName) {

    var retErr = "";
    if(this.errorMessages.hasOwnProperty(fieldName) && this.errorMessages[fieldName] !== null && this.errorMessages[fieldName] !== undefined ){
        var aErrorMessageObj = this.errorMessages[fieldName];
        var keysOfErrMsgObj = Object.keys(aErrorMessageObj);
        for(var x = 0; x < keysOfErrMsgObj.length; x++){
            var aRuleKey = keysOfErrMsgObj[x];
            var errorStr = aErrorMessageObj[aRuleKey];
            if(errorStr !== undefined && errorStr !== null && errorStr.trim().length > 0 ) {
                retErr = errorStr;
                break;
            }
        }
    }
    return retErr;
};

/**
 * HAS ERROR
 * @param fieldName
 * @returns {boolean}
 */
Validator.prototype.hasError = function(fieldName) {
    var hasError = false;
    if(this.errorMessages.hasOwnProperty(fieldName) && this.errorMessages[fieldName] !== null && this.errorMessages[fieldName] !== undefined ){
        hasError = true;
    }
    return hasError;
};


/**
 * SANITIZE RULE STRING
 * IF ruleStrInput is : max:5, then it returns max
 * IF ruleStrInput is : unique:email, then it returns unique
 * @param ruleStrInput
 * @returns {SchemaType|string|*}
 */
Validator.prototype.sanitizeRule = function(ruleStrInput) {
    var fieldRuleSplitValues = ruleStrInput.trim().split(':');
    /*if(fieldRuleSplitValues.length > 1){
     return fieldRuleSplitValues[0];
     }*/
    return fieldRuleSplitValues[0].trim();
};

/**
 * GET PARAMS OF THE RULE
 * e.g ruleStrInput = min:5, then it returns ['5']
 *     ruleStrInput = unique:email:email_id, then it returns ['email', 'email_id']
 * @param ruleStrInput
 * @returns {Array}
 */
Validator.prototype.getRuleParams = function(ruleStrInput) {
    var retParams = [];
    var fieldRuleSplitValuesArr = ruleStrInput.trim().split(':');
    if(fieldRuleSplitValuesArr.length > 1){
        for (var x=0; x < fieldRuleSplitValuesArr.length; x++){
            var aSplitValue = fieldRuleSplitValuesArr[x].trim();
            if(DEFAULT_ERROR_MESSAGES.hasOwnProperty(aSplitValue) && DEFAULT_ERROR_MESSAGES[aSplitValue] !== null && DEFAULT_ERROR_MESSAGES[aSplitValue] !== undefined ){
                // skip this one
                // its a rule, not a param
            }else{
                retParams.push(aSplitValue);
            }
        }
    }
    return retParams;
};


// email
Validator.prototype.email = function(emailStr) {
    if(emailStr != undefined && emailStr != null && emailStr.trim().length > 0){
        let pattern =/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return pattern.test(emailStr);
    }
    return false;
};

// mobile
Validator.prototype.mobile = function(mobileStr) {
    if(mobileStr != undefined && mobileStr != null && mobileStr.trim().length > 0){
        let pattern = /^\d{10}$/;
        return pattern.test(mobileStr);
    }
    return false;
};

// mobile
Validator.prototype.mobile_with_country_code = function(mobileStr) {
    if(mobileStr != undefined && mobileStr != null && mobileStr.length === 13){
        var countryCode = mobileStr.substring(0, 3);
        if(countryCode !== "+91"){
            return false
        }else{
            var mobile = mobileStr.substring(3);
            let pattern = /^\d{10}$/;
            return pattern.test(mobile);
        }
    }else{
        return false;
    }
};

// alphabet
Validator.prototype.alphabets = function(alphabetStr) {
    if(alphabetStr != undefined && alphabetStr != null && alphabetStr.trim().length > 0){
        let pattern = /^[a-zA-Z]+$/;
        return pattern.test(alphabetStr);
    }
    return false;
};

// string
Validator.prototype.string = function(inputStr) {
    if(inputStr != undefined && inputStr != null && inputStr.trim().length > 0){
        let pattern = /^[a-zA-Z ]*$/;
        return pattern.test(inputStr);
    }
    return false;
};

// number
Validator.prototype.number = function(numberStr) {
    if(numberStr != undefined && numberStr != null && numberStr.trim().length > 0){
        let pattern = /^\d+$/;
        return pattern.test(numberStr);
    }
    return false;
};

// nospecial
Validator.prototype.nospecial = function(inputStr) {
    if(inputStr != undefined && inputStr != null && inputStr.trim().length > 0){
        let pattern = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
        return !pattern.test(inputStr);
    }
    return false;
};

// required
Validator.prototype.required = function(input, field) {
    return input.hasOwnProperty(field) && input[field].trim().length > 0;
};


// min
Validator.prototype.min = function(input, min) {
    if(input != undefined && input != null && input.trim().length > 0){
        return input.trim().length >= min;
    }
    return false;
};

// max
Validator.prototype.max = function(input, max) {
    if(input != undefined && input != null && input.trim().length > 0){
        return input.trim().length <= max;
    }
    return false;
};

// len
Validator.prototype.len = function(input, max) {
    if(input != undefined && input != null && input.trim().length > 0){
        return input.trim().length === max;
    }
    return false;
};

// in_string
Validator.prototype.in_string = function(input, strArr) {
    if(input != undefined && input != null && input.trim().length > 0){
        return strArr.indexOf(input.trim()) > -1;
    }
    return false;
};


// Export
module.exports = Validator;




