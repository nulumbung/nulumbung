<div align="center">

# Nulumbung

**A modern news & organization management platform**

Built with Laravel, Inertia.js and React — featuring an Inertia-driven admin panel, role-based access control, a rich editorial workflow and a built-in newsletter system.

</div>

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| Backend | PHP 8.3+, [Laravel 13](https://laravel.com) |
| Frontend | [React 19](https://react.dev) + [Inertia.js v3](https://inertiajs.com) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) + shadcn/ui |
| Auth | [Laravel Fortify](https://laravel.com/docs/fortify) (login, registration, email verification, password reset, two-factor authentication, passkeys) |
| Authorization | [spatie/laravel-permission](https://spatie.be/docs/laravel-permission) |
| Routing | [Laravel Wayfinder](https://laravel.com/docs/wayfinder) (typed routes & controller actions) |
| Testing | [Pest](https://pestphp.com) |
| Code style | [Laravel Pint](https://laravel.com/docs/pint) |

---

## Features

### Authentication & Account
- Login, registration, email verification and password reset (Fortify)
- Two-factor authentication (TOTP / QR codes / recovery codes)
- Passkeys (WebAuthn) support
- Profile management: name, email, WhatsApp, address, avatar
- Appearance switcher (light / dark / system)

### Content Management
- **News** — articles with cover image, rich text editor with inline image upload, publishing workflow (Draft / Publish / Archive) and placements (Headline, Trending, Popular, Latest, Newsletter)
- **Categories** — organize content with an icon picker
- **Media** — photo & video library with visibility statuses
- **History** — dated articles with image uploads
- **Banom & Officers** — organization records and their official positions (Chairman / Secretary / Treasurer, Active / Demisioner)

### Newsletter
- Subscriber management (email, name, status: Subscribed / Unsubscribed)
- Public subscribe form and token-based unsubscribe links
- **Automatic delivery**: news flagged for the newsletter is emailed to all subscribers the moment it is published
- Manual send / resend from the admin panel
- SMTP configuration stored in the database and applied at boot, with a "send test email" tool

### Administration & Security
- **Users** — create, edit, assign roles and delete users
- **Roles** — CRUD with a grouped permission picker
- **Permissions** — a role × permission matrix page for granting access to every section (superadmin is locked)
- **Platform settings** — brand name, tagline, logo, favicon, and mail (SMTP) configuration

### Public
- Landing / welcome page
- Public newsletter subscribe & unsubscribe pages

---

## Requirements

- PHP >= 8.3
- Composer 2
- Node.js >= 22
- MySQL / PostgreSQL / SQLite

---

## Installation

Run the official setup command (installs backend + frontend dependencies, creates `.env`, generates the app key and runs migrations):

```bash
composer run setup
```

Or step by step:

```bash
# 1. Install PHP dependencies
composer install

# 2. Environment configuration
cp .env.example .env
php artisan key:generate
# -> set your database & mail credentials inside .env

# 3. Database schema + seeders
php artisan migrate --seed

# 4. Frontend dependencies
npm install

# 5. Serve the app
npm run dev        # Vite dev server (with a second terminal running `php artisan serve`)
# or, for production assets:
npm run build
```

### Seeded default admin

The `SuperSeeder` creates the `superadmin` role and an administrator account. The credentials are defined in `database/seeders/SuperSeeder.php` — change the password right after your first login in production.

---

## Roles & Permissions

Access control is powered by `spatie/laravel-permission` and modeled with a PHP enum (`app/Enums/Permission.php`):

| Permission | Grants access to |
| --- | --- |
| `manage-system` | Platform settings & mail configuration |
| `manage-users` | User management |
| `manage-roles` | Role management |
| `manage-permissions` | Permission matrix |
| `manage-categories` | Categories |
| `manage-news` | News (including newsletter delivery) |
| `manage-media` | Media library |
| `manage-history` | History |
| `manage-banom` | Banom & officers |
| `manage-newsletter` | Newsletter subscribers |

Any non-superadmin account needs a role with at least the permissions it should see. The **superadmin** role always holds every permission and cannot be edited, renamed or deleted.

---

## Project Structure

```
app/
├── Actions/Fortify/        # Fortify auth actions
├── Enums/                  # Permission & status enums
├── Http/Controllers/       # Controllers (modules + System + Settings)
├── Http/Requests/          # Form requests & validation
├── Mail/                   # Newsletter & test email mailable
├── Models/                 # Eloquent models
└── Providers/              # Service providers (mail config at boot)
database/
├── factories/              # Model factories
├── migrations/             # Schema
└── seeders/                # Permissions, superadmin, platform settings
resources/js/
├── components/             # React components (incl. shadcn/ui)
├── layouts/                # App, sidebar & auth layouts
├── lib/                    # Domain helpers & option lists
├── pages/                  # Inertia pages (admin, auth, public)
├── routes/                 # Generated Wayfinder routes
└── actions/                # Generated Wayfinder controller actions
routes/                     # Route definitions per module
tests/                      # Pest feature & unit tests
```

---

## Scripts

| Command | Description |
| --- | --- |
| `composer run setup` | Full first-time setup |
| `php artisan serve` | Start the backend |
| `npm run dev` | Vite dev server |
| `npm run build` | Production frontend build |
| `php artisan test` | Run the test suite (Pest) |
| `composer lint` | Fix code style with Pint |
| `composer test` | Full CI check (Pint + PHPStan + Pest) |

---

## Testing

The suite runs against an in-memory SQLite database, so no external database is required:

```bash
php artisan test
```

---

## License

This project is open-sourced under the [MIT license](LICENSE).