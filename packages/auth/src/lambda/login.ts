import * as AWS from 'aws-sdk'
import { Handler } from 'aws-lambda';
import {clientId, userPoolId} from  '../config';
import { AdminInitiateAuthRequest } from 'aws-sdk/clients/cognitoidentityserviceprovider';
import * as createHttpError from 'http-errors';

const login: Handler = async(event: any, context) => {
    const body = JSON.parse(event.body)
    const {username, password} = body;
    if(!username || !password)
        return new createHttpError.BadRequest();
    const cognito = new AWS.CognitoIdentityServiceProvider();
    const params: AdminInitiateAuthRequest = {
      AuthFlow: 'ADMIN_NO_SRP_AUTH',
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password
      },
      ClientId: clientId,
      UserPoolId: userPoolId
    };
    
    try{
        const data = await cognito.adminInitiateAuth(params).promise();
        const {AuthenticationResult} = data;
        const response = {
            statusCode: 200,
            body: JSON.stringify({
            message: AuthenticationResult,
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
  login as handler,
};
