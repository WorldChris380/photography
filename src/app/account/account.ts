import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-account',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './account.html',
	styleUrl: './account.scss',
	encapsulation: ViewEncapsulation.None
})
export class Account {}

