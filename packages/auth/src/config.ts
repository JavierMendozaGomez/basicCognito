import * as dotenv from 'dotenv';
import * as env from 'env-var';
dotenv.config();

//Cognito
export const clientId: string =  env.get('CLIENT_ID').required().asString();
export const userPoolId: string = env.get('USER_POOL_ID').required().asString();
