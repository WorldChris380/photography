import { 
  trigger, 
  animate, 
  transition, 
  style, 
  query, 
  group 
} from '@angular/animations';

export const fadeSlideInOut = trigger('fadeSlideInOut', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('300ms', style({ opacity: 1 }))
  ]),
  transition(':leave', [
    style({ opacity: 1 }),
    animate('300ms', style({ opacity: 0 }))
  ]),
  transition('* <=> *', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%'
      })
    ], { optional: true }),
    query(':enter', [
      style({ opacity: 0 })
    ], { optional: true }),
    query(':leave', [
      style({ opacity: 1 })
    ], { optional: true }),
    group([
      query(':leave', [
        animate('300ms ease', style({ opacity: 0 }))
      ], { optional: true }),
      query(':enter', [
        animate('300ms ease', style({ opacity: 1 }))
      ], { optional: true })
    ])
  ])
]);