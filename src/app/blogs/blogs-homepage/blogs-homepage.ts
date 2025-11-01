import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-blogs-homepage',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './blogs-homepage.html',
  styleUrl: './blogs-homepage.scss',
  encapsulation: ViewEncapsulation.None
})
export class BlogsHomepage {}
