import { Component } from '@angular/core';
import { TrendingCoursesComponent } from './components/trending-courses/trending-courses.component';
import { PopularCoursesComponent }  from './components/popular-courses/popular-courses.component';
import { CoursesComponent }         from './components/courses/courses.component';
import { HeroCarouselComponent } from "./components/hero-carousel/hero-carousel.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CoursesComponent,
    TrendingCoursesComponent,
    PopularCoursesComponent,
    HeroCarouselComponent
],
  templateUrl: './home.component.html',
})
export class HomeComponent {}
