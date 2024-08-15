import { Routes } from '@angular/router';


export const medication_routes: Routes = [
    {path:'add', loadComponent:()=>import('./add.component').then(c=>c.AddComponent)},
    {path: 'update/:medication_id', loadComponent: ()=>import ('./update.component').then(c=>c.UpdateComponent)},  
    {path: ':medication_id/reviews/add', loadComponent: ()=>import ('./review/add-review.component').then(c=>c.AddReviewComponent)},
    {path: ':medication_id/reviews/update/:review_id', loadComponent: ()=>import ('./review/update-review.component').then(c=>c.UpdateReviewComponent)},
]