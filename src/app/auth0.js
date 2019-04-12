// use Auth0 as the authorization server

let _auth0Client = null;
let _idToken = null;
let _profile = null;

class Auth0Client {
    constructor() {
        // TODO: get from auth0 application console
        _auth0Client = new auth0.WebAuth({
            domain: 'ahadsheriff.auth0.com',
            audience: 'https://ahadsheriff.auth0.com/userinfo',
            clientID: 'b689LqlzzD6PmxAsg40Trt5qw2LNqTWy',
            redirectUri: 'http://localhost:3001/',
            responseType: 'token id_token',
            scope: 'openid profile'
        });
    }

    getIdToken() {
        return _idToken;
    }

    getProfile() {
        return _profile;
    }

    handleCallback() {
        return new Promise((resolve, reject) => {
            _auth0Client.parseHash(async (err, authResult) => {
                window.location.hash = '';
                if (err) return reject(err);

                if (!authResult || !authResult.idToken) {
                    // not an authentication request
                    return resolve(false);
                }
                _idToken = authResult.idToken;
                _profile = authResult.idTokenPayload;

                return resolve(true);
            });
        });
    }

    signIn() {
        _auth0Client.authorize();
    }

    signOut() {
        _idToken = null;
        _profile = null;
    }
}

const auth0Client = new Auth0Client();