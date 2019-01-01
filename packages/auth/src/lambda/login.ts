import * as AWS from 'aws-sdk'
import { APIGatewayEvent, Handler } from 'aws-lambda';
import {
    getCognito
} from '../credentials'

const login: Handler = async(event:  any, context) => {
    const body = JSON.parse(event.body)
    const {username, password} = body
    const {ClientId, UserPoolId} = await getCognito();
    const cognito = new AWS.CognitoIdentityServiceProvider();
    
    const params = {
      AuthFlow: 'ADMIN_NO_SRP_AUTH',
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password
      },
      ClientId,
      UserPoolId
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
