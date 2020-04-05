import * as AWS from 'aws-sdk'
import { APIGatewayEvent, Handler } from 'aws-lambda';
import {clientId, userPoolId} from  '../config';
import { SignUpRequest , AdminConfirmSignUpRequest} from 'aws-sdk/clients/cognitoidentityserviceprovider';
import CognitoIdentityServiceProvider = require('aws-sdk/clients/cognitoidentityserviceprovider');
import * as createHttpError from 'http-errors';

const signup: Handler = async(event:  any, context) => {
    const body = JSON.parse(event.body);
    const {username, password, phone} = body;
    if(!username || !password || !phone) 
      return new createHttpError.BadRequest();
    const cognito: CognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();
    
    const paramsSignup: SignUpRequest = {
        ClientId: clientId, 
        Password: password, 
        Username: username,
        UserAttributes: [
          {
            Name: 'email', 
            Value: username
          },
          {
            Name: 'phone_number',
            Value: phone
          }
        ]
    };
    const paramsAdminConfirm: AdminConfirmSignUpRequest = {
      UserPoolId: userPoolId,
      Username: username
    };
    try {
        const data = await cognito.signUp(paramsSignup).promise();
        //TO FIX BEFORE PROD, DO NOT AUTO CONFIRM USER
        await cognito.adminConfirmSignUp(paramsAdminConfirm).promise();
        const response = {
            statusCode: 200,
            body: JSON.stringify({
            message: data,
            }),
        }; 
        return Promise.resolve(response);
    } catch(err){
        const responseErr = {
            statusCode: 400,
            body: JSON.stringify({
                message: err,
            }),
        }; 
        return Promise.resolve(responseErr)
    }
}
export {
  signup as handler,
};
