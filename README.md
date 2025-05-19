# Weather Subscription Service

This service allows users to subscribe to regular weather forecast updates for a selected city.
![image](https://github.com/user-attachments/assets/44affd5e-e01b-4159-8745-d849afc369be)
![image](https://github.com/user-attachments/assets/29e18613-6b55-4255-b975-3d003f24b938)
![image](https://github.com/user-attachments/assets/8dd114ea-102d-4914-9fdc-12e5925aeda4)

Hosted on AWS EC2: http://44.203.146.21:3000/
## Features

- Get current weather for a city.
- Subscribe to hourly or daily weather updates via email.
- Email confirmation for subscriptions.
- Unsubscribe from updates.
- Data stored in PostgreSQL.
- Database migrations on startup.
- Dockerized for easy deployment.

## Prerequisites

- Node.js (v18 recommended)
- npm
- Docker & Docker Compose
- A WeatherAPI.com API Key
- An SMTP server for sending emails (e.g., Mailtrap for development)

## Setup

1.  **Clone the repository:**

    ```bash
    git clone <your-repo-url>
    cd weather-subscription-service
    ```

2.  **Create `.env` file:**
    Copy `.env.example` to `.env` and fill in the required values:

    ```bash
    cp .env.example .env
    # Edit .env with your credentials
    ```

    Key variables:

    - `NODE_ENV`: Set to "development" or "production".
    - `APP_PORT`: Application port (default: 3000).
    - `WEATHER_API_KEY`: Your API key from WeatherAPI.com.
    - `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`: SMTP server details for sending emails.
    - `DB_USER`, `DB_PASSWORD`, `DB_NAME`: PostgreSQL database credentials.

3.  **Build and run with Docker Compose:**

    **For Development:**

    ```powershell
    # Build the application
    docker-compose build app

    # Set environment to development (PowerShell)
    $env:NODE_ENV="development"

    # Start the services
    docker-compose up -d
    ```

    **For Production:**

    ```powershell
    # Build the application
    docker-compose build app

    # Set environment to production (PowerShell)
    $env:NODE_ENV="production"

    # Start the services
    docker-compose up -d
    ```

    **Stop the services:**

    ```powershell
    docker-compose down
    ```

    **View logs:**

    ```powershell
    # View application logs
    docker-compose logs --tail=50 app

    # View database logs
    docker-compose logs --tail=50 db
    ```

    The service will be available at `http://localhost:<PORT>` (e.g., `http://localhost:3000`).
    Database migrations will run automatically on startup.

## API Endpoints

The API follows the provided Swagger documentation. Base path: `/api`

- **GET `/api/weather?city=<cityName>`**: Get current weather.
- **POST `/api/subscribe`**: Subscribe to updates.
  - Form Data: `email`, `city`, `frequency` (`hourly` or `daily`).
- **GET `/api/confirm/:token`**: Confirm email subscription.
- **GET `/api/unsubscribe/:token`**: Unsubscribe from updates.

## Logic Overview

1.  **Subscription Request (`/api/subscribe`):**

    - Validates input (email, city, frequency).
    - Checks if the email is already subscribed.
    - Generates a unique confirmation token and an unsubscribe token.
    - Saves the subscription details to the `subscriptions` table in the database with `is_confirmed = false`.
    - Sends a confirmation email to the user with a link containing the confirmation token.

2.  **Email Confirmation (`/api/confirm/:token`):**

    - User clicks the confirmation link in the email.
    - The service finds the subscription by the confirmation token.
    - If found, it sets `is_confirmed = true` and clears/invalidates the `confirmation_token`.

3.  **Weather Updates (Scheduled Task):**

    - `node-cron` is used to schedule two jobs: one for hourly updates and one for daily updates.
    - The scheduler queries the database for all `is_confirmed = true` subscriptions matching the respective frequency.
    - For each subscription:
      - It fetches the current weather for the subscribed city using `WeatherAPI.com`.
      - It sends an email to the subscriber with the weather details and an unsubscribe link (using the `unsubscribe_token`).

4.  **Unsubscription (`/api/unsubscribe/:token`):**

    - User clicks the unsubscribe link (from a weather update email or potentially the confirmation email).
    - The service finds the subscription by the `unsubscribe_token` and deletes it from the database.

5.  **Get Current Weather (`/api/weather`):**
    - A simple endpoint to fetch and return the current weather for a specified city directly from `WeatherAPI.com`.

## Running Migrations Manually (if needed)

```bash
npx knex migrate:latest --knexfile knexfile.js
npx knex migrate:rollback --knexfile knexfile.js
```

## Troubleshooting

1. **"Cannot find module 'xyz'" error:**

   - Ensure all dependencies are properly installed.
   - For production mode, check that the dependency is in the `dependencies` section of `package.json`, not just in `devDependencies`.
   - Rebuild the Docker image: `docker-compose build app --no-cache`

2. **Database connection errors:**
   - Verify the database credentials in your `.env` file.
   - Check that the database container is running: `docker-compose ps`
   - Inspect the database logs: `docker-compose logs db`
3. **Email sending errors:**

   - Check the SMTP settings in your `.env` file.
   - For Gmail, make sure to use an App Password if 2FA is enabled.
   - Test your SMTP credentials with a tool like Swaks or a simple script.

4. **Environment variable issues:**
   - In PowerShell, set environment variables using `$env:VARIABLE_NAME="value"`.
   - In Bash/Linux, use `export VARIABLE_NAME=value`.
   - Check if your environment variables are being properly passed to containers.
