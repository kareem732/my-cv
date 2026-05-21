import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";

@Component({
  selector: 'app-small-nav',
  imports: [RouterLink , RouterLinkActive],
  templateUrl: './small-nav.component.html',
  styleUrl: './small-nav.component.css'
})
export class SmallNavComponent {

}
