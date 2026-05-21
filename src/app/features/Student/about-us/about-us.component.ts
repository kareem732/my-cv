import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarAboutUsComponent } from './navbar-about-us/navbar-about-us.component';
import { HomeAboutUsComponent } from './home-about-us/home-about-us.component';
import { OursuccessAboutUsComponent } from './oursuccess-about-us/oursuccess-about-us.component';
import { WhyguidyAboutUsComponent } from './whyguidy-about-us/whyguidy-about-us.component';
import { ExploreProgramsComponent } from "./explore-programs/explore-programs.component";
import { SuccessStoriesComponent } from "./success-stories/success-stories.component";
import { AboutUsFooterComponent } from "./about-us-footer/about-us-footer.component";

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [CommonModule, NavbarAboutUsComponent, HomeAboutUsComponent, OursuccessAboutUsComponent, WhyguidyAboutUsComponent, ExploreProgramsComponent, SuccessStoriesComponent, AboutUsFooterComponent],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.css'
})
export class AboutUsComponent  {



}
