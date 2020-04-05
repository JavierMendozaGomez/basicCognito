import * as AWS from 'aws-sdk'
const client =  new AWS.SecretsManager();

const getCredentials: any = async (key : string) => {
    try {
        const data = await client.getSecretValue({SecretId: key}).promise();
        const {SecretString} = data
        return SecretString
    } catch (err) {
        throw new Error('Invalid resource')
    }
}
export {
    getCredentials,
};
