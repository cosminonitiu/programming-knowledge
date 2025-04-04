import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { CategoryPageComponent } from './pages/category-page/category-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { ThreadPageComponent } from './pages/thread-page/thread-page.component';
import { TopicPageComponent } from './pages/topic-page/topic-page.component';

export const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', component: HomePageComponent },
            { path: ':categoryId/:subcategoryId', component: CategoryPageComponent },
            { path: ':categoryId/:subcategoryId/:topicId', component: TopicPageComponent },
            { path: ':categoryId/:subcategoryId/:topicId/:threadId', component: ThreadPageComponent },
            { path: 'not-found', component: NotFoundPageComponent },
            { path: '**', redirectTo: '/not-found', pathMatch: 'full' }
        ]
    }
];
