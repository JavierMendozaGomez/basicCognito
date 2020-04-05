import * as AWS from 'aws-sdk'
import {Handler } from 'aws-lambda';
import {clientId} from  '../config';


const confirmCode: Handler = async(event:  any, context) => {
    const body = JSON.parse(event.body)
    const {username, code} = body
    const cognito = new AWS.CognitoIdentityServiceProvider();
    
    const params = {
      ClientId: clientId,
      ConfirmationCode: code,
      ForceAliasCreation: false,
      Username: username
    };
    
    try{
        const data = await cognito.confirmSignUp(params).promise();;
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
  confirmCode as handler,
};
