// // user-card.component.ts (stand‑alone)
// import { Component, input, output } from '@angular/core';

// @Component({
//   selector: 'app-user-card',
//   imports: [],
//   standalone: true,
//   template: `
//     <div class="card shadow-lg p-4 grid gap-2">
//       <h2 class="font-bold">{{ user().name }}</h2>
//       <button class="btn btn-error" (click)="deleted.emit(user().id)">Delete</button>
//     </div>
//   `,
// })
// export class UserCardComponent { 
//   user = input<{ id: number; name: string }>();
//   deleted = output<number>();

// }


// user-card.component.ts (stand‑alone)
// import { Component, input, output } from '@angular/core';

// @Component({
//   selector: 'user-card',
//   standalone: true,
//   template: `
//     <div class="card shadow-lg p-4 grid gap-2">
//       <h2 class="font-bold">{{ user().name }}</h2>
//       <button class="btn btn-error" (click)="deleted.emit(user().id)">Delete</button>
//     </div>
//   `,
// })
// export class UserCard {
//   user = input<{ id: number; name: string }>();
//   deleted = output<number>();
// }