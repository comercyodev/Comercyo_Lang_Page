import emitter from 'tiny-emitter/instance';
import services from './services/index.js';
import { useIconsStore } from '@/pinia/icons';

 /* wwFront:start */
// eslint-disable-next-line no-undef
import plugin_832d6f7a_42c3_43f1_a3ce_9a678272f811 from '@/components/plugins/plugin-832d6f7a-42c3-43f1-a3ce-9a678272f811/src/wwPlugin.js';
import plugin_d66a250d_8468_469e_ad33_ee028f632398 from '@/components/plugins/plugin-d66a250d-8468-469e-ad33-ee028f632398/src/wwPlugin.js';
import plugin_6a64802c_52f8_4637_9932_580bf178aaa7 from '@/components/plugins/plugin-6a64802c-52f8-4637-9932-580bf178aaa7/src/wwPlugin.js';
import plugin_9c40819b_4a8f_468f_9ba5_4b9699f3361f from '@/components/plugins/plugin-9c40819b-4a8f-468f-9ba5-4b9699f3361f/src/wwPlugin.js';
/* wwFront:end */

import { computed, reactive } from 'vue';

export default {
    ...services,
     $on(event, fn) {
        emitter.on(event, fn);
    },
    $once(event, fn) {
        emitter.once(event, fn);
    },
    $emit(event, ...args) {
        if (!event) {
            return;
        }
        emitter.emit(event, ...args);
    },
    $off(event, fn) {
        emitter.off(event, fn);
    },
     front: {},
    $focus: null,
    env: process.env.NODE_ENV,
    async initFront({ router, store }) {
 
        this.front.router = router;
        /* wwFront:start */
        this.$store = store;
        /* wwFront:end */

        //Init services
        this.wwLog.init();

 
        wwLib.logStore.verbose('Starting the application...');
        await this.wwWebsiteData.init();
        this.wwLang.init(router);

        /* wwFront:start */
        // eslint-disable-next-line no-undef
        wwLib.wwPluginHelper.registerPlugin('plugin-832d6f7a-42c3-43f1-a3ce-9a678272f811', plugin_832d6f7a_42c3_43f1_a3ce_9a678272f811);
wwLib.wwPluginHelper.registerPlugin('plugin-d66a250d-8468-469e-ad33-ee028f632398', plugin_d66a250d_8468_469e_ad33_ee028f632398);
wwLib.wwPluginHelper.registerPlugin('plugin-6a64802c-52f8-4637-9932-580bf178aaa7', plugin_6a64802c_52f8_4637_9932_580bf178aaa7);
wwLib.wwPluginHelper.registerPlugin('plugin-9c40819b-4a8f-468f-9ba5-4b9699f3361f', plugin_9c40819b_4a8f_468f_9ba5_4b9699f3361f);
        /* wwFront:end */

 
        services.scrollStore.start();
        services.keyboardEventStore.start();
    },
     // TODO: Verify with Alexis, still uses wwImageMultiLang
    getResponsiveStyleProp({ store, style, uid, states = [], prop }) {
        store = store || wwLib.getFrontWindow().wwLib.$store;
        if (!style && uid) {
            const wwObject = this.$store.getters['websiteData/getWwObjects'][uid];
            if (!wwObject) return '';
            style = (wwObject._state || {}).style || {};
        }

        const screenSizes = store.getters['front/getScreenSizes'];
        const screenSize = store.getters['front/getScreenSize'];

        let value = '';

        for (const media in screenSizes) {
            if (style[media] && typeof style[media][prop] !== 'undefined') {
                value = style[media][prop];
            }
            if (media === screenSize) {
                break;
            }
        }
        for (const state of states) {
            for (const media in screenSizes) {
                if (style[`${state}_${media}`] && style[`${state}_${media}`][prop]) {
                    value = style[`${state}_${media}`][prop];
                }
                if (media === screenSize) {
                    break;
                }
            }
        }

        return value;
    },
    globalContext: reactive({
        page: computed(() => {
            const page = wwLib.$store.getters['websiteData/getPage'];
            if (!page) return {};
            else if (!page.cmsDataSetPath) return { ...pageSanitizer(page) };
            return { ...pageSanitizer(page), data: wwLib.$store.getters['data/getPageCollectionData'] };
        }),
        pageParameters: computed(() => {
            const pageParameters = Object.values(wwLib.$store.getters['data/getPageParameterVariables']);
            const pageParametersValueMap = {};
            for (const pageParameter of pageParameters) pageParametersValueMap[pageParameter.id] = pageParameter.value;
            return pageParametersValueMap;
        }),
        pages: computed(() => {
            const pages = wwLib.$store.getters['websiteData/getPages'];
            const pagesValueMap = {};
            for (const page of pages) pagesValueMap[page.id] = pageSanitizer(page);
            return pagesValueMap;
        }),
        colors: computed(() => {
            const theme = wwLib.$store.getters['front/getTheme'];
             /* wwFront:start */
            // eslint-disable-next-line no-unreachable, no-undef
            return theme === 'dark' ? {"b1257881-73ba-4fa2-a388-e4bac81337a4":"#6A9FC8","5d9aedbc-69fb-4bc5-9dbf-a833bcd1e173":"#F6AE28","0f20c81f-5153-4478-8dc3-f1da96227dfc":"#3F3F46","04c02fba-283c-402c-9aab-6ffd226dd5c0":"#FFFFFF","5da613a5-e2f2-4ffc-acbb-19ee675df8fb":"#000000","4a006b5a-1a8b-40de-bbc4-86ab18904830":"#33658A","fbbeec68-500e-4177-9410-77dcd30aa1e8":"#A6C6DE","14c5f16f-e619-4aac-994a-d219212073ba":"#2F4858","faa0ec5e-73a8-4135-a7ed-f4a0e57a10fe":"#52525B","6166fb7e-1498-4c68-9bb5-97918eed342e":"#F8C462","321cd8ea-af9b-4f87-8173-eb14b84a7567":"#E29402","2e3b639d-1978-4bd6-8a82-5b4a06adf7bf":"#F16319","1c4deec6-a38a-46b0-9b83-208fd8d20f28":"#F9D38A","cd141ea3-f166-4845-a8b0-5b3003b2870e":"#BBBBC3","adf2c144-dd87-4920-9114-c7f94bd8870f":"#088C41","ce7b4929-6303-4344-baf1-a5d391c2a515":"#AA0306","c39460b2-dbde-4f50-921e-61ff339f3967":"#1C2C36","eae23ebd-9f55-4b96-bd92-2c28bb1c1ceb":"#E4EAED","daa41166-e967-4f74-8aaf-85a69d11cf85":"#FFFFFF80"} : {"b1257881-73ba-4fa2-a388-e4bac81337a4":"#6A9FC8","5d9aedbc-69fb-4bc5-9dbf-a833bcd1e173":"#F6AE28","0f20c81f-5153-4478-8dc3-f1da96227dfc":"#3F3F46","04c02fba-283c-402c-9aab-6ffd226dd5c0":"#FFFFFF","5da613a5-e2f2-4ffc-acbb-19ee675df8fb":"#000000","4a006b5a-1a8b-40de-bbc4-86ab18904830":"#33658A","fbbeec68-500e-4177-9410-77dcd30aa1e8":"#A6C6DE","14c5f16f-e619-4aac-994a-d219212073ba":"#2F4858","faa0ec5e-73a8-4135-a7ed-f4a0e57a10fe":"#52525B","6166fb7e-1498-4c68-9bb5-97918eed342e":"#F8C462","321cd8ea-af9b-4f87-8173-eb14b84a7567":"#E29402","2e3b639d-1978-4bd6-8a82-5b4a06adf7bf":"#F16319","1c4deec6-a38a-46b0-9b83-208fd8d20f28":"#F9D38A","cd141ea3-f166-4845-a8b0-5b3003b2870e":"#BBBBC3","adf2c144-dd87-4920-9114-c7f94bd8870f":"#088C41","ce7b4929-6303-4344-baf1-a5d391c2a515":"#AA0306","c39460b2-dbde-4f50-921e-61ff339f3967":"#1C2C36","eae23ebd-9f55-4b96-bd92-2c28bb1c1ceb":"#E4EAED","daa41166-e967-4f74-8aaf-85a69d11cf85":"#FFFFFF80"};
            /* wwFront:end */
        }),
        spacings:
         /* wwFront:start */
        // eslint-disable-next-line no-unreachable, no-undef
        {"940ff04d-b466-4873-9ed3-fd8f8e6545e0":"12px","cb1f2245-6b6f-4ba8-baaf-178531648c9f":"16px","4277fe1d-12ce-4b2b-8f5e-c9b8728ca581":"32px","4ca3e805-98f6-4a08-9cc8-eccf302bb2b7":"4px","7317598c-6c88-46dd-ac52-2ba44bae9b4b":"12px","214fa90e-68d5-43a1-bb64-0dd36bf5ffca":"20px","f0b3d6da-ec04-41dc-b93d-2407ab37c3fb":"24px","b6c5dad3-2dea-4e37-8d4b-150a2e0f89eb":"28px","8bddacc6-d560-4f91-abf0-33798ddef774":"8px","e43a7260-e8c4-4f2e-8c49-8c7b69540f50":"30px","38bc80b8-ba30-40d0-bdb6-9ba2c77b94e7":"40px","eca82273-2024-40bc-ba52-0eb352709f43":"60px","41a17572-f498-439e-873d-e4e353d89705":"100%"},
        /* wwFront:end */
        typographies:
         /* wwFront:start */
        // eslint-disable-next-line no-unreachable, no-undef
        {"b248ab1f-8373-4c1c-9985-5433635471ac":"500 14px/normal 'Bakbak One', serif","6dd32e4a-39ad-4b1a-9568-e50668b096d6":"500 18px/22px 'Bakbak One', serif","57e3d489-2fb6-435a-aaf6-36a7ce6e1be3":"700 16px/normal 'Bakbak One', serif","01d1d9a7-8969-47b6-b123-dcfab0c8339f":"100 12px/normal 'Bakbak One', serif","81542a6b-4fe2-4c2c-bd73-38c9db149c96":"500 24px/20px 'Bakbak One', serif","fc31c0f6-713b-43de-8054-9f6427e7c9a0":"500 18px/normal var(--ww-default-font-family, sans-serif)","1103cde8-a523-403d-8324-a88b3d17057a":"500 16px/normal var(--ww-default-font-family, sans-serif)","740afd19-7444-4266-a73a-f9241e3fed79":"400 14px/normal var(--ww-default-font-family, sans-serif)","632d613a-cea0-4fd3-8c6c-7f6e05eeb305":"400 10px/normal var(--ww-default-font-family, sans-serif)","3331627d-8459-46db-b280-d5b4effbae59":"400 12px/normal var(--ww-default-font-family, sans-serif)","f3898dea-8fc4-42ed-a39e-9081647d48df":"500 38px/100% 'Bakbak One', serif"},
        /* wwFront:end */
        browser: computed(() => {
            const router = wwLib.manager ? wwLib.getEditorRouter() : wwLib.getFrontRouter();
            const currentRoute = router.currentRoute.value;
            let currentQueries = currentRoute.query;
             return {
                url: window.location.origin + currentRoute.fullPath,
                path: currentRoute.path,
                // verify if auth plugin
                 /* wwFront:start */
                // eslint-disable-next-line no-dupe-keys
                source: currentQueries._source,
                /* wwFront:end */
                query: currentQueries,
                domain: window.location.hostname,
                baseUrl: window.location.origin,
                breakpoint: wwLib.$store.getters['front/getScreenSize'],
                environment: wwLib.getEnvironment(),
                theme: wwLib.$store.getters['front/getTheme'],
            };
        }),
        screen: services.scrollStore.screen,
        componentPositionInfo: services.scrollStore.componentPositionInfo,
    }),

    pageData: computed(() => {
        const lang = wwLib.$store.getters['front/getLang'];
        const cmsDataSetPath = wwLib.$store.getters['websiteData/getPage'].cmsDataSetPath;
        if (!cmsDataSetPath) {
            return { lang };
        }

        return { lang, data: wwLib.$store.getters['data/getPageCollectionData'] };
    }),

    getEnvironment() {
        return wwLib.manager
            ? 'editor'
            : window.location.host.includes(
                  // TODO: add staging2 ?
                  '-staging.' + (process.env.WW_ENV === 'staging' ? import.meta.env.VITE_APP_PREVIEW_URL : '')
              )
            ? 'staging'
            : window.location.host.includes(import.meta.env.VITE_APP_PREVIEW_URL)
            ? 'preview'
            : 'production';
    },

    useBaseTag() {
        return (
            wwLib.getEnvironment() === 'production' &&
            window.wwg_designInfo.baseTag &&
            window.wwg_designInfo.baseTag.href
        );
    },

    getBaseTag() {
        let baseTag = window.wwg_designInfo.baseTag?.href || '';
        if (!baseTag.startsWith('/')) {
            baseTag = '/' + baseTag;
        }
        if (!baseTag.endsWith('/')) {
            baseTag += '/';
        }
        return baseTag;
    },

    /**
     * @PUBLIC_API
     */
    getFrontWindow() {
        if (document.querySelector('.ww-manager-iframe')) {
            return document.querySelector('.ww-manager-iframe').contentWindow;
        }
        return window;
    },

    /**
     * @PUBLIC_API
     */
    getFrontDocument() {
        return this.getFrontWindow().document;
    },

    /**
     * @PUBLIC_API
     */
    getFrontRouter() {
        return this.front.router;
    },

    /**
     * @PUBLIC_API
     */
    getEditorWindow() {
         // eslint-disable-next-line no-unreachable
        return null;
    },

    /**
     * @PUBLIC_API
     */
    getEditorDocument() {
         // eslint-disable-next-line no-unreachable
        return null;
    },

    /**
     * @PUBLIC_API
     */
    getEditorRouter() {
        return this.editor.router;
    },

    /**
     * @PUBLIC_API
     * @DEPRECATED wwLib.wwApp.goTo
     */
    goTo(...args) {
        wwLib.wwLog.warn('wwLib.goTo is DEPRECATED, use wwLib.wwApp.goTo instead');
        wwLib.wwApp.goTo(...args);
    },

    /**
     * @PUBLIC_API
     * @DEPRECATED wwLib.wwUtils.getStyleFromToken
     */
    getStyleFromToken(...args) {
        // wwLib.wwLog.warn('wwLib.getStyleFromToken is DEPRECATED, use wwLib.wwUtils.getStyleFromToken instead');
        return wwLib.wwUtils.getStyleFromToken(...args);
    },

    /**
     * @PUBLIC_API
     * @DEPRECATED wwLib.wwUtils.getTypoFromToken
     */
    getTypoFromToken(...args) {
        // wwLib.wwLog.warn('wwLib.getTypoFromToken is DEPRECATED, use wwLib.wwUtils.getTypoFromToken instead');
        return wwLib.wwUtils.getTypoFromToken(...args);
    },

    /**
     * @PUBLIC_API
     * @DEPRECATED
     */
    element(value) {
        wwLib.wwLog.warn('wwLib.element is DEPRECATED');
        if (typeof value === 'object') {
            return { isWwObject: true, ...value };
        } else {
            return { isWwObject: true, type: value };
        }
    },

    /**
     * @PUBLIC_API
     * @DEPRECATED wwLib.wwUtils.resolveObjectPropertyPath
     */
    resolveObjectPropertyPath(...args) {
        // wwLib.wwLog.warn(
        //     'wwLib.resolveObjectPropertyPath is DEPRECATED, use wwLib.wwUtils.resolveObjectPropertyPath instead'
        // );
        return wwLib.wwUtils.resolveObjectPropertyPath(...args);
    },

    /**
     * @PUBLIC_API
     * @DEPRECATED wwLib.wwutils.getTextStyleFromContent
     */
    getTextStyleFromContent(...args) {
        // wwLib.wwLog.warn(
        //     'wwLib.getTextStyleFromContent is DEPRECATED, use wwLib.wwUtils.getTextStyleFromContent instead'
        // );
        return wwLib.wwUtils.getTextStyleFromContent(...args);
    },

    /**
     * @PUBLIC_API
     * @DEPRECATED wwLib.wwWorkflow.executeGlobal
     */
    async executeWorkflow(...args) {
        wwLib.wwLog.warn('wwLib.executeWorkflow is DEPRECATED, use wwLib.wwWorkflow.executeGlobal instead');
        return wwLib.wwWorkflow.executeGlobal(...args);
    },

    /**
     * @PUBLIC_API
     * @EDITOR
     * @DEPRECATED wwLib.wwEditor.findParentUidByFlag
     */
    findParentUidByFlag(...args) {
        wwLib.wwLog.warn('wwLib.wwEditor.findParentUidByFlag is DEPRECATED, use wwLib.findParentUidByFlag instead');
        return wwLib.wwEditor.findParentUidByFlag(...args);
    },

    /**
     * @PUBLIC_API
     * @EDITOR
     * @DEPRECATED wwLib.wwEditor.selectParentByFlag
     */
    selectParentByFlag(...args) {
        wwLib.wwLog.warn('wwLib.wwEditor.selectParentByFlag is DEPRECATED, use wwLib.selectParentByFlag instead');
        return wwLib.wwEditor.selectParentByFlag(...args);
    },

    /**
     * @PUBLIC_API
     * @DEPRECATED wwLib.wwElement.useCreate
     */
    useCreateElement() {
        wwLib.wwLog.warn('wwLib.useCreateElement is DEPRECATED, use wwLib.wwElement.useCreate instead');
        return this.wwElement.useCreate();
    },

    /**
     * @PUBLIC_API
     * @DEPRECATED wwLib.wwElement.useLayoutStyle
     */
    useLayoutStyle() {
        wwLib.wwLog.warn('wwLib.useLayoutStyle is DEPRECATED, use wwLib.wwElement.useLayoutStyle instead');
        return wwLib.wwElement.useLayoutStyle();
    },

    /**
     * @PUBLIC_API
     */
    useIcons() {
        const store = useIconsStore();
        return {
            getIcon: store.getIcon,
        };
    },
};

function pageSanitizer(page) {
    const keysToInclude = [
        'id',
        'name',
        'folder',
        'metaImage',
        'pageLoaded',
        'paths',
        'langs',
        'meta',
        'title',
        'sections',
        'pageUserGroups',
    ];

    const _page = {};
    keysToInclude.forEach(key => {
        _page[key] = page[key];
    });

    _page.meta && delete _page.meta.__typename;
    for (const section of _page.sections || []) {
        delete section.__typename;
    }

    const lang = wwLib.$store.getters['front/getLang'];
    if (_page.paths) _page.path = _page.paths[lang] || _page.paths.default;
    else _page.path = null;

    _page.lang = lang;

    return _page;
}
