import { Routes } from '@angular/router';
import { ByCapitalPageComponent } from './pages/by-capital-page/by-capital-page.component';
import { CountryLayoutComponent } from './layouts/CountryLayout/CountryLayout.component';

export const countryRoutes: Routes = [
    {
        path: '', 
        component: CountryLayoutComponent,
        children: [
        {
            path: 'by-capital',
            component: ByCapitalPageComponent
        },
        // {
        //     path: 'by-country',
        //             component: ByCountryPageComponent,


        // },
        // {
        //     path: 'by-region',
        //     component: ByRegionPageComponent,
        // },
        {
            path:'**', 
            redirectTo: 'by-capital',
        }]

    }


   // ,
    //  {
    //      path: 'country',
    //      loadChildren: () => import('./')
    //  },
    
];

export default countryRoutes;