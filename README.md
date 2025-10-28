# Photography

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.1.5.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## PayPal configuration and secret management

Important: Do not commit credentials. The application reads PayPal settings exclusively from environment variables and never from the repository.

Required server environment variables:

- PAYPAL_CLIENT_ID
- PAYPAL_SECRET
- PAYPAL_ENV (live | sandbox)

How to configure on your host (IONOS or similar):

- Preferred: Set the variables in your hosting panel (environment variables for PHP/Apache or FPM).
- Alternative: Configure them via your virtual host (Apache SetEnv) without committing values to the repo.

Local testing options:

- Set process environment variables before starting PHP (e.g., via your web server/PHP manager).

Security notes:

- Secrets were removed from the repository and replaced with an environment-based loader at `src/paypal-secret.php` and `deploy-to-ionos/paypal-secret.php`.
- If secrets were ever committed, rotate the keys in the PayPal developer dashboard and scrub the git history (see below).

History scrub (manual):

- Use BFG Repo-Cleaner or git filter-repo to remove the files/strings from history, then force-push. Be aware this rewrites history and requires collaborators to re-clone.

