# Angular 20 Deep‑Dive: Feature‑First Routing & Composition

> **Mastery Track** — Child & Nested Routes • Component Communication with Signals • Tailwind CSS + DaisyUI • Route Files per Feature • Lazy‑Loaded Route Modules

<br/>

## Table of Contents
1. [Overview](#overview)  
2. [Child Routes](#child-routes)  
3. [Nested Routes](#nested-routes)  
4. [Component Creation & Communication](#component-creation--communication)  
5. [Styling with Tailwind CSS & DaisyUI](#styling-with-tailwindcss--daisyui)  
6. [Route Files per Feature / Module](#route-files-per-feature--module)  
7. [Lazy Loading Route Modules](#lazy-loading-route-modules)  
8. [Putting It Together](#putting-it-together)  
9. [Further Resources](#further-resources)

---

## Overview

Angular 20 builds on the *stand‑alone component era* introduced in v17 and super‑charges it with an even leaner router, better DX for feature‑first code‑splitting, and first‑class Signals in templates.  
This guide takes a “scientific” lens—dissecting each moving part, showing *why* it works, and giving you **proof‑of‑concept (PoC) snippets** you can paste straight into a fresh `ng new` workspace.

> **Prerequisites**: Node 20 +, Angular CLI 20, and basic familiarity with the command line.

---

## Child Routes

Child routes are the building blocks of complex navigations—a *composition of URLs* inside the parent’s outlet.

```ts
// src/app/features/admin/admin.routes.ts
import { Routes } from '@angular/router';
import { AdminComponent } from './admin.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',                // /admin
    component: AdminComponent,
    children: [
      {
        path: 'users',       // /admin/users
        loadChildren: () => import('./users/users.routes'),
      },
      {
        path: 'roles',       // /admin/roles
        loadChildren: () => import('./roles/roles.routes'),
      },
    ],
  },
];
```

**Why it matters**  
* Each child shares the parent resolver / guard context.  
* Breadcrumbs & side‑menus auto‑reflect the hierarchy.  
* Outlets can be *named* for multi‑region layouts (think `<router-outlet name="sidebar">`).

---

## Nested Routes

Nested routes push the hierarchy further—grand‑children & beyond. Angular 20’s router parses them in **depth‑first order**, ensuring guards cascade naturally.

```ts
// src/app/features/admin/users/users.routes.ts
import { Routes } from '@angular/router';
import { UsersComponent } from './users.component';
import { UserDetailComponent } from './user-detail.component';

export const USERS_ROUTES: Routes = [
  { path: '', component: UsersComponent },            // /admin/users
  { path: ':id', component: UserDetailComponent },    // /admin/users/42
];
```

💡 *Tip*: Combine **auxiliary outlets** with nested routes for master–detail views without losing URL state.

---

## Component Creation & Communication

Angular 20 encourages **Signal‑first thinking** for component state.

```ts
// user-card.component.ts (stand‑alone)
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'user-card',
  standalone: true,
  template: `
    <div class="card shadow-lg p-4 grid gap-2">
      <h2 class="font-bold">{{ user().name }}</h2>
      <button class="btn btn-error" (click)="deleted.emit(user().id)">Delete</button>
    </div>
  `,
})
export class UserCard {
  user = input<{ id: number; name: string }>();
  deleted = output<number>();
}
```

```ts
// user-list.component.ts
import { Component, signal } from '@angular/core';
import { NgFor } from '@angular/common';
import { UserCard } from './user-card.component';

@Component({
  selector: 'user-list',
  standalone: true,
  imports: [NgFor, UserCard],
  template: `
    <user-card
      *ngFor="let u of users()"
      [user]="u"
      (deleted)="remove($event)">
    </user-card>
  `,
})
export class UserList {
  private _users = signal([{ id: 1, name: 'Ada' }, { id: 2, name: 'Linus' }]);
  users = this._users.asReadonly();

  remove(id: number) {
    this._users.update(list => list.filter(u => u.id !== id));
  }
}
```

**Key Take‑aways**  
* `input()` / `output()` APIs are **type‑safe** and *signal‑aware*.  
* Updates are synchronous—no `ChangeDetectorRef` juggling.  
* Combine with `effect()` for side‑effects like analytics.

---

## Styling with Tailwind CSS & DaisyUI

Angular 20 CLI integrates Tailwind in one flag:

```bash
ng add @angular/cli-tailwind --daisyui
```

> Under the hood it edits `tailwind.config.js`, appends `daisyui` to the plugins array, and scopes Tailwind to your project’s `content` globs.

### Example Button

```html
<button class="btn btn-primary">
  🚀 Launch
</button>
```

**Why DaisyUI?** It converts Tailwind’s low‑level utilities into *accessible component classes* (`btn`, `card`, `alert`), preserving design consistency without custom CSS variables.

---

## Route Files per Feature / Module

Instead of a single monolithic `app.routes.ts`, each feature owns its route file. Benefits:

1. 💡 **Tree‑shakable** — only imported when lazy‑loaded.  
2. 🧪 **Unit‑testable** — supply a mock router config per spec.  
3. 🤝 **Team‑friendly** — fewer merge conflicts.

```ts
// src/app/features/analytics/analytics.routes.ts
import { Routes } from '@angular/router';
import { AnalyticsDashboard } from './dashboard.component';

export const ANALYTICS_ROUTES: Routes = [
  { path: '', component: AnalyticsDashboard },
];
```

---

## Lazy Loading Route Modules

Angular 20 keeps the `loadChildren` promise syntax but supports **ES imports with explicit exports**:

```ts
{
  path: 'analytics',
  loadChildren: () =>
    import('./features/analytics/analytics.routes').then(m => m.ANALYTICS_ROUTES),
  data: { preload: true },
}
```

### Preloading Strategy

In `app.config.ts`:

```ts
import { provideRouter, withPreloading } from '@angular/router';
import { PreloadAllModules } from '@angular/router';

export const APP_CONFIG = [
  provideRouter(APP_ROUTES, withPreloading(PreloadAllModules)),
];
```

> **Scientific Note**: Preloading runs *after bootstrap*, leveraging idle network time to download bundles, improving Time‑to‑Interactive by ~15‑30 % on real devices.

---

## Putting It Together

1. **Scaffold**  
   ```bash
   ng new lab-routing --standalone --routing --style=scss
   cd lab-routing
   ng add @angular/cli-tailwind --daisyui
   ```
2. **Generate Features**  
   ```bash
   ng generate feature admin --standalone --routing
   ng generate feature analytics --standalone --routing
   ```
3. **Wire Routes** inside `app.routes.ts` (root) referencing the feature route files.  
4. **Run**  
   ```bash
   ng serve --open
   ```
   Navigate to `/admin/users` or `/analytics` and observe **lazy bundle loading** in DevTools ▶ Network.

---

## Further Resources

| Resource | Why It’s Valuable |
|----------|------------------|
| [Angular 20 Docs](https://angular.dev) | Official reference, RFCs & migration guides |
| [Tailwind CSS](https://tailwindcss.com/docs/installation/angular) | Utility‑first styling, Angular walkthrough |
| [DaisyUI](https://daisyui.com/docs/install/) | Component library built on Tailwind |
| [Angular Signals RFC](https://github.com/angular/angular/discussions/48245) | Deep dive into the reactivity model |

---

### 🤓 You’re Now Routing Like a Scientist!

Re‑mix the examples, measure bundle sizes with `ng build --stats-json`, and iterate. Happy hacking 🚀





# CountrySPA
In this section, we will learn and reinforce topics such as:  Child Routes Nested Routes Creation and Communication between Components Tailwind and DaisyUI Route Files per Feature / Module Lazy Loading of Route Modules The goal is to build the application that we will then run.

https://tailwindcss.com/docs/installation/framework-guides/angular


https://daisyui.com/docs/install/
https://daisyui.com/components/hero/
https://daisyui.com/components/menu/
https://iconify.design/

https://angular.dev/style-guide#dont-prefix-output-properties
https://restcountries.com/
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass 
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
