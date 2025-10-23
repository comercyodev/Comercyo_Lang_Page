export default {
    features: {
        auth: true
    },
    editor: {
        settings: [
            {
                label: 'Configuration',
                icon: 'advanced',
                edit: () => import('./src/components/Configuration/SettingsEdit.vue'),
                summary: () => import('./src/components/Configuration/SettingsSummary.vue'),
                getIsValid() {
                    return true;
                },
            },
        ],
        designSystemId: '053d6253-48d1-4298-9ddc-d6a542fa400a',
    },
    variables: [
        { name: 'user', value: 'user', type: 'object', defaultValue: null },
        { name: 'isAuthenticated', value: 'isAuthenticated', type: 'boolean', defaultValue: false },
    ],
    actions: [
        {
            name: 'Sign Up',
            code: 'signUp',
            isAsync: true,
        },
        {
            name: 'Login',
            code: 'login',
            isAsync: true,
        },
        {
            name: 'Update User Profile',
            code: 'updateUserProfile',
            isAsync: true,
        },
        {
            name: 'Change Password',
            code: 'changePassword',
            isAsync: true,
        },
        {
            name: 'Forgot Password',
            code: 'forgotPassword',
            isAsync: true,
        },
        {
            name: 'Confirm Password',
            code: 'confirmPassword',
            isAsync: true,
        },
        {
            name: 'Logout',
            code: 'logout',
        },
    ],
};
