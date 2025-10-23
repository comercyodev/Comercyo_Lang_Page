import { CognitoUserPool, CognitoUser, AuthenticationDetails, CookieStorage } from 'amazon-cognito-identity-js';

export default {
    /*=============================================m_ÔÔ_m=============================================\
        Plugin API
    \================================================================================================*/
    websiteId: null,
    cognitoUserPool: null,
    cognitoUser: null,
    cognitoStorage: null,
    async _onLoad(settings) {
        this.websiteId = wwLib.wwWebsiteData.getInfo().id;
        this.cognitoStorage = new CookieStorage({
            domain: window.location.hostname,
            path: wwLib.manager ? `/${this.websiteId}` : '/',
        });
        this.cognitoUserPool = new CognitoUserPool({
            ClientId: settings.publicData.clientId,
            UserPoolId: settings.publicData.userPoolId,
            Storage: this.cognitoStorage,
        });
    },
    async _initAuth() {
        this.cognitoUser = this.cognitoUserPool.getCurrentUser();
        if (this.cognitoUser) await this.fetchUser();
    },
    _getUserRoles() {
        return this.user.roles?.map(role => role.id);
    },
    /*=============================================m_ÔÔ_m=============================================\
        Auth API
    \================================================================================================*/
    /*=============================================m_ÔÔ_m=============================================\
        WeWeb Auth API
    \================================================================================================*/
    async fetchUser() {
        try {
            const accessToken = await new Promise((resolve, reject) =>
                this.cognitoUser.getSession((err, data) => (err ? reject(err) : resolve(data.accessToken.jwtToken)))
            );
            const awsUser = await new Promise((resolve, reject) =>
                this.cognitoUser.getUserData((err, data) => (err ? reject(err) : resolve(data)))
            );
            const { data: roles } = await axios.get(
                `${wwLib.wwApiRequests._getPluginsUrl()}/designs/${this.websiteId}/ww-auth/users/${
                    awsUser.Username
                }/roles`,
                { headers: { 'ww-auth-access-token': accessToken } }
            );

            const user = {
                ...awsUser.UserAttributes.reduce(
                    (obj, attribute) => ({ ...obj, [attribute.Name]: attribute.Value }),
                    {}
                ),
                id: awsUser.Username,
                roles,
            };
            delete user.sub;

            wwLib.wwVariable.updateValue(`${this.id}-user`, user);
            wwLib.wwVariable.updateValue(`${this.id}-isAuthenticated`, true);
            return user;
        } catch (err) {
            this.logout();
            throw err;
        }
    },
    async login({ email, password }) {
        try {
            if (this.cognitoUser) this.logout();
            this.cognitoUser = new CognitoUser({
                Username: email,
                Pool: this.cognitoUserPool,
                Storage: this.cognitoStorage,
            });

            await new Promise((resolve, reject) =>
                this.cognitoUser.authenticateUser(new AuthenticationDetails({ Username: email, Password: password }), {
                    onSuccess: data => resolve(data),
                    onFailure: err => reject(err),
                })
            );
            return await this.fetchUser();
        } catch (err) {
            this.logout();
            throw err;
        }
    },
    async signUp({ email, password, name }) {
        try {
            await new Promise((resolve, reject) =>
                this.cognitoUserPool.signUp(email, password, [{ Name: 'name', Value: name }], null, (err, data) =>
                    err ? reject(err) : resolve(data)
                )
            );
            return await this.login({ email, password });
        } catch (err) {
            this.logout();
            throw err;
        }
    },
    async updateUserProfile({ email, name, attributes }) {
        if (!email) throw new Error('Failed to update user. Email cannot be empty.')
        try {
            await new Promise((resolve, reject) =>
                this.cognitoUser.updateAttributes(
                    [
                        { Name: 'email', Value: email || '' },
                        { Name: 'name', Value: name || '' },
                        ...(attributes || []).map(attribute => ({ Name: attribute.key, Value: attribute.value || '' })),
                    ],
                    (err, data) => (err ? reject(err) : resolve(data))
                )
            );
            return await this.fetchUser();
        } catch (err) {
            this.logout();
            throw err;
        }
    },
    async changePassword({ oldPassword, newPassword }) {
        try {
            await new Promise((resolve, reject) =>
                this.cognitoUser.changePassword(oldPassword, newPassword, (err, data) =>
                    err ? reject(err) : resolve(data)
                )
            );
        } catch (err) {
            this.logout();
            throw err;
        }
    },
    async forgotPassword({ email }) {
        this.cognitoUser = new CognitoUser({
            Username: email,
            Pool: this.cognitoUserPool,
            Storage: this.cognitoStorage,
        });
        await new Promise((resolve, reject) =>
            this.cognitoUser.forgotPassword({
                onSuccess: data => resolve(data),
                onFailure: err => reject(err),
                inputVerificationCode: data => resolve(data),
            })
        );
    },
    async confirmPassword({ verificationCode, newPassword }) {
        await new Promise((resolve, reject) =>
            this.cognitoUser.confirmPassword(verificationCode, newPassword, {
                onSuccess: () => resolve(),
                onFailure: err => reject(err),
            })
        );
    },
    logout() {
        wwLib.wwVariable.updateValue(`${this.id}-user`, null);
        wwLib.wwVariable.updateValue(`${this.id}-isAuthenticated`, false);
        if (this.cognitoUser) this.cognitoUser.signOut();
    },
};
