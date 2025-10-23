import { createRouter, createWebHistory } from 'vue-router';

import wwPage from './views/wwPage.vue';

import { initializeData, initializePlugins, onPageUnload } from '@/_common/helpers/data';

let router;
const routes = [];

function scrollBehavior(to) {
    if (to.hash) {
        return {
            el: to.hash,
            behavior: 'smooth',
        };
    } else {
        return { top: 0 };
    }
}

 
/* wwFront:start */
import pluginsSettings from '../../plugins-settings.json';

// eslint-disable-next-line no-undef
window.wwg_designInfo = {"id":"30109186-72e8-4791-9f64-cc980bc61728","homePageId":"80d066bd-ebf2-4182-a572-14fcc4088265","authPluginId":"6a64802c-52f8-4637-9932-580bf178aaa7","baseTag":null,"defaultTheme":"light","langs":[{"lang":"en","default":true}],"background":{},"workflows":[],"pages":[{"id":"80d066bd-ebf2-4182-a572-14fcc4088265","linkId":"80d066bd-ebf2-4182-a572-14fcc4088265","name":"Landingpage","folder":null,"paths":{"en":"home","default":"home"},"langs":["en"],"cmsDataSetPath":null,"sections":[{"uid":"3ab0a051-4b54-4a45-8905-6756d82244f7","sectionTitle":"Navbar Section","linkId":"20fb5cfc-fa0c-477a-b5e3-bf71a000de49"},{"uid":"04be78e5-13a6-4751-8759-50631be2ff0e","sectionTitle":"Section2","linkId":"a6a0f61b-9063-4df6-bd05-b2ee50a77405"},{"uid":"b25917a5-eebd-4952-a0d3-e4b86b2f21df","sectionTitle":"Section3","linkId":"6991b99a-c084-42fd-a9bb-2bba9f1dd649"},{"uid":"513f8ada-cfa3-48fb-98fc-71f10394cf8b","sectionTitle":"Section4","linkId":"32b39e53-d9a3-47d6-aa38-2e08bdfb5ab5"},{"uid":"5a376b20-bb02-4b59-96d9-22979437c623","sectionTitle":"Section5","linkId":"89eac5c0-2585-471f-9d7b-60fa1427270c"},{"uid":"11952755-e7ea-4b16-9a5d-c2debad02acf","sectionTitle":"Section6","linkId":"1ad352f0-59e2-47a1-b1e9-8a3b6d920f11"},{"uid":"ebec3eb0-6bec-4155-a337-b22bee735161","sectionTitle":"Process Section","linkId":"2320b358-495e-42ae-a84c-d211e6482826"},{"uid":"cac35806-9d5f-44e1-ade0-bff44d6dab42","sectionTitle":"Section8","linkId":"81a834e3-8340-4c4d-88d4-27a30179756b"},{"uid":"5b6842d7-44bf-47b4-84e6-172aef75edfd","sectionTitle":"Sección Plantillas y Proyectos Demo","linkId":"a8394c8a-c6b4-4d10-8b7e-ed27742fc898"},{"uid":"0d722c85-f3f7-472e-8da3-178628848821","sectionTitle":"Section Footer","linkId":"182e8647-3fde-4f38-ad2a-327b58ed9000"}],"pageUserGroups":[],"title":{"en":"","fr":"Vide | Commencer à partir de zéro"},"meta":{"desc":{},"keywords":{},"socialDesc":{},"socialTitle":{},"structuredData":{}},"metaImage":""}],"plugins":[{"id":"9c40819b-4a8f-468f-9ba5-4b9699f3361f","name":"Charts","namespace":"chartjs"},{"id":"832d6f7a-42c3-43f1-a3ce-9a678272f811","name":"Date","namespace":"dayjs"},{"id":"6a64802c-52f8-4637-9932-580bf178aaa7","name":"WeWeb Auth","namespace":"wewebAuth"},{"id":"d66a250d-8468-469e-ad33-ee028f632398","name":"OpenAI","namespace":"openai"}]};
// eslint-disable-next-line no-undef
window.wwg_cacheVersion = 1;
// eslint-disable-next-line no-undef
window.wwg_pluginsSettings = pluginsSettings;
// eslint-disable-next-line no-undef
window.wwg_disableManifest = false;

const defaultLang = window.wwg_designInfo.langs.find(({ default: isDefault }) => isDefault) || {};

const registerRoute = (page, lang, forcedPath) => {
    const langSlug = !lang.default || lang.isDefaultPath ? `/${lang.lang}` : '';
    let path =
        forcedPath ||
        (page.id === window.wwg_designInfo.homePageId ? '/' : `/${page.paths[lang.lang] || page.paths.default}`);

    //Replace params
    path = path.replace(/{{([\w]+)\|([^/]+)?}}/g, ':$1');

    routes.push({
        path: langSlug + path,
        component: wwPage,
        name: `page-${page.id}-${lang.lang}`,
        meta: {
            pageId: page.id,
            lang,
            isPrivate: !!page.pageUserGroups?.length,
        },
        async beforeEnter(to, from) {
            if (to.name === from.name) return;
            //Set page lang
            wwLib.wwLang.defaultLang = defaultLang.lang;
            wwLib.$store.dispatch('front/setLang', lang.lang);

            //Init plugins
            await initializePlugins();

            //Check if private page
            if (page.pageUserGroups?.length) {
                // cancel navigation if no plugin
                if (!wwLib.wwAuth.plugin) {
                    return false;
                }

                await wwLib.wwAuth.init();

                // Redirect to not sign in page if not logged
                if (!wwLib.wwAuth.getIsAuthenticated()) {
                    window.location.href = `${wwLib.wwPageHelper.getPagePath(
                        wwLib.wwAuth.getUnauthenticatedPageId()
                    )}?_source=${to.path}`;

                    return null;
                }

                //Check roles are required
                if (
                    page.pageUserGroups.length > 1 &&
                    !wwLib.wwAuth.matchUserGroups(page.pageUserGroups.map(({ userGroup }) => userGroup))
                ) {
                    window.location.href = `${wwLib.wwPageHelper.getPagePath(
                        wwLib.wwAuth.getUnauthorizedPageId()
                    )}?_source=${to.path}`;

                    return null;
                }
            }

            try {
                await import(`@/pages/${page.id.split('_')[0]}.js`);
                await wwLib.wwWebsiteData.fetchPage(page.id);

                //Scroll to section or on top after page change
                if (to.hash) {
                    const targetElement = document.getElementById(to.hash.replace('#', ''));
                    if (targetElement) targetElement.scrollIntoView();
                } else {
                    document.body.scrollTop = document.documentElement.scrollTop = 0;
                }

                return;
            } catch (err) {
                wwLib.$store.dispatch('front/showPageLoadProgress', false);

                if (err.redirectUrl) {
                    return { path: err.redirectUrl || '404' };
                } else {
                    //Any other error: go to target page using window.location
                    window.location = to.fullPath;
                }
            }
        },
    });
};

for (const page of window.wwg_designInfo.pages) {
    for (const lang of window.wwg_designInfo.langs) {
        if (!page.langs.includes(lang.lang)) continue;
        registerRoute(page, lang);
    }
}

const page404 = window.wwg_designInfo.pages.find(page => page.paths.default === '404');
if (page404) {
    for (const lang of window.wwg_designInfo.langs) {
        // Create routes /:lang/:pathMatch(.*)* etc for all langs of the 404 page
        if (!page404.langs.includes(lang.lang)) continue;
        registerRoute(
            page404,
            {
                default: false,
                lang: lang.lang,
            },
            '/:pathMatch(.*)*'
        );
    }
    // Create route /:pathMatch(.*)* using default project lang
    registerRoute(page404, { default: true, isDefaultPath: false, lang: defaultLang.lang }, '/:pathMatch(.*)*');
} else {
    routes.push({
        path: '/:pathMatch(.*)*',
        async beforeEnter() {
            window.location.href = '/404';
        },
    });
}

let routerOptions = {};

const isProd =
    !window.location.host.includes(
        // TODO: add staging2 ?
        '-staging.' + (process.env.WW_ENV === 'staging' ? import.meta.env.VITE_APP_PREVIEW_URL : '')
    ) && !window.location.host.includes(import.meta.env.VITE_APP_PREVIEW_URL);

if (isProd && window.wwg_designInfo.baseTag?.href) {
    let baseTag = window.wwg_designInfo.baseTag.href;
    if (!baseTag.startsWith('/')) {
        baseTag = '/' + baseTag;
    }
    if (!baseTag.endsWith('/')) {
        baseTag += '/';
    }

    routerOptions = {
        base: baseTag,
        history: createWebHistory(baseTag),
        routes,
    };
} else {
    routerOptions = {
        history: createWebHistory(),
        routes,
    };
}

router = createRouter({
    ...routerOptions,
    scrollBehavior,
});

//Trigger on page unload
let isFirstNavigation = true;
router.beforeEach(async (to, from) => {
    if (to.name === from.name) return;
    if (!isFirstNavigation) await onPageUnload();
    isFirstNavigation = false;
    wwLib.globalVariables._navigationId++;
    return;
});

//Init page
router.afterEach((to, from, failure) => {
    wwLib.$store.dispatch('front/showPageLoadProgress', false);
    let fromPath = from.path;
    let toPath = to.path;
    if (!fromPath.endsWith('/')) fromPath = fromPath + '/';
    if (!toPath.endsWith('/')) toPath = toPath + '/';
    if (failure || (from.name && toPath === fromPath)) return;
    initializeData(to);
});
/* wwFront:end */

export default router;
