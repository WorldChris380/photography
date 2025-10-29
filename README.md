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

## Deployment to IONOS

### Prerequisites

1. **Environment Variables**: Your IONOS hosting must have these environment variables configured:
   - `PAYPAL_CLIENT_ID` - Your PayPal client ID
   - `PAYPAL_SECRET` - Your PayPal secret key
   - `PAYPAL_ENV` - Either `live` or `sandbox`

2. **PHP Support**: Ensure PHP 7.4+ is enabled on your hosting
3. **MySQL Database**: Configure database credentials in `deploy-to-ionos/lib/db.php`

### Deployment Steps

1. **Prepare deployment folder**:
   ```powershell
   .\deploy-ionos.ps1
   ```
   This script will:
   - Build the Angular application for production
   - Clear the `deploy-to-ionos` folder (keeping backend files)
   - Copy compiled Angular files
   - Copy PHP backend files
   - Verify all critical files are present

2. **Configure environment on IONOS**:
   - Log into your IONOS control panel
   - Navigate to PHP settings or environment variables
   - Set the three PayPal environment variables listed above

3. **Upload to server**:
   - Connect via FTP/SFTP to your IONOS web space
   - Upload all contents of `deploy-to-ionos/` to your web root (usually `htdocs` or `public_html`)

4. **Set folder permissions**:
   - Ensure `data/` folder is writable (chmod 755 or 775)
   - Ensure `private_downloads/` folder is writable
   - Both folders should have `.htaccess` files to prevent direct access

5. **Test the deployment**:
   - Visit your domain to verify the Angular app loads
   - Test PayPal functionality (use sandbox first!)
   - Check that PHP endpoints respond correctly

### Manual Deployment (without script)

If you prefer manual deployment:

```powershell
# 1. Build
ng build --configuration production

# 2. Copy dist/photography/browser/* to deploy-to-ionos/
# 3. Copy PHP files from src/ to deploy-to-ionos/
# 4. Upload deploy-to-ionos/ contents to your server
```

### Troubleshooting

- **502 errors**: Check `paypal_errors.log` in your web root
- **PayPal auth fails**: Verify environment variables are set correctly
- **Database errors**: Check credentials in `lib/db.php`
- **403 errors**: Verify `.htaccess` files are present and working

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

