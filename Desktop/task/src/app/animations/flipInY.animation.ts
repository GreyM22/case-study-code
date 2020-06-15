import { trigger, transition, useAnimation, query, style, stagger, animate, keyframes, animateChild, group } from '@angular/animations';


export const testAnimation = trigger('routeAnimations', [
  transition('home <=> createDepartment',
  [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%'
      })
    ]),
  ])
]);

