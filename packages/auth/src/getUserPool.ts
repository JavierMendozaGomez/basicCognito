import * as AWS from 'aws-sdk';
import {getCredentials} from './credentials'

const getCognito = async() => {
    return JSON.parse(await getCredentials('cognito'));
}

