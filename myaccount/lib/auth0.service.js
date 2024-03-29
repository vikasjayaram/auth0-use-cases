const ManagementClient = require("auth0").ManagementClient;

// Set up Auth0 configuration
const authConfig = {
    domain: process.env.DOMAIN,
    audience: `https://${process.env.CANONICAL_DOMAIN}/api/v2/`,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
};

// To obtain a Management API token from your Node backend, you can use Client Credentials Grant using your registered Auth0 Non Interactive Clients

const management = new ManagementClient({
    domain: authConfig.domain,
    clientId: authConfig.clientId,
    clientSecret: authConfig.clientSecret,
    audience: authConfig.audience
});

async function getFactorsForTenant() {
    try {
        return await management.getGuardianFactors();
    } catch (err) {
        return err;
    }
 }
async function getAuthenticatorsForUser (id) {
    try {
        var user = await management.users.getAuthenticationMethods({id: id});
        return user;
    } catch (err) {
        return err;
    }
}

async function deleteAuthenticatorById (id, authentication_method_id) {
    try {
        var response = await management.users.deleteAuthenticationMethodById({id, authentication_method_id});
        console.log(`Deleting authenticator response: ${response}`);
        return response
    } catch (err) {
        console.error(`Deleting authenticator error response: ${err}`);
        return err;
    }
}

async function generateRecoveryCode (id, authentication_method_id) {
    try {
        var response = await management.users.regenerateRecoveryCode({id});
        return response
    } catch (err) {
        return err;
    }
}

async function generatePasswordChangeTicket (user_id, client_id, result_url) {
    try {
        // result_url is only available in classic
        var response = await management.createPasswordChangeTicket({user_id, client_id});
        return response
    } catch (err) {
        return err;
    }
}

async function updateUser (id, data) {
    try {
        console.log(data);
        return await management.users.update({ id: id }, data);
    } catch (err) {
        console.log(err);
        return err;
    }
}
module.exports = {
    getFactorsForTenant,
    getAuthenticatorsForUser,
    deleteAuthenticatorById,
    generateRecoveryCode,
    generatePasswordChangeTicket,
    updateUser
}