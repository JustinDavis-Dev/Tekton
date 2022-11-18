import { lazy } from 'react';
const PageNotFound = lazy(() => import('../pages/error/PageNotFound'));
const Surveys = lazy(() => import('../pages/surveys/Surveys'));
const SurveysAnalytics = lazy(() => import('../pages/surveys/SurveysAnalytics'));
const SurveysCreate = lazy(() => import('../pages/surveys/SurveysCreate'));

const surveys = [
    {
        path: '/surveys',
        name: 'Surveys',
        element: Surveys,
        roles: ['Admin'],
        exact: true,
        isAnonymous: false,
        children: [
            {
                path: '/surveys/create',
                name: 'Surveys Create',
                element: SurveysCreate,
                roles: ['Admin'],
                exact: true,
                isAnonymous: false,
            },
            {
                path: '/surveys/edit/:id',
                name: 'Surveys Edit',
                element: SurveysCreate,
                roles: ['Admin'],
                exact: true,
                isAnonymous: false,
            },
            {
                path: '/surveys/analytics/:id',
                name: 'Surveys Analytics',
                element: SurveysAnalytics,
                roles: ['Admin'],
                exact: true,
                isAnonymous: false,
            },
        ],
    },
];

const errorRoutes = [
    {
        path: '*',
        name: 'Error - 404',
        element: PageNotFound,
        roles: ['User'],
        exact: true,
        isAnonymous: false,
    },
];

const allRoutes = [
    ...surveys,
    ...errorRoutes,
];
export default allRoutes;
