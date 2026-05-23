# Backend Deployment Guide

This guide covers the deployment process for the portfolio backend API, including VPS setup, Docker, Nginx, and GitHub Actions CI/CD.

## 1. Finalization

Before deploying, ensure your local application is ready:
- Read the [SETUP_BUILD_AND_LINT.md](SETUP_BUILD_AND_LINT.md) docs.
- Make sure to fix any lint issues.
- **Node version** must be `v22.18.0` or upwards.
- Test your build and start locally:
  ```bash
  npm run build
  npm run start
  ```

## 2. Technologies Used

- **VPS**: Server Machine
- **Docker**: Containerization
- **Nginx**: Reverse Proxy
  - A reverse proxy is an intermediary server that sits in front of web servers. It intercepts incoming requests from clients (users on the internet) and routes them to the appropriate backend server, acting as the public "face" of your infrastructure.
  - It hides the true IP addresses of your backend servers. 
    *Example: `72.62.64.176:8000` -> `api.cloomero.cloud`*
  - You can easily host multiple sites on the same server using different ports and assign them unique domains.

## 3. Dockerfile & Docker Compose Setup

- **`Dockerfile`**: Instructions for building a single Express API container using Node.js.
- **`docker-compose.yaml`**: Manages and connects multiple services like frontend, backend, database, nginx, etc. We map port `8000` on the host to port `8000` on the container (`8000:8000`).
- Docker Compose removes most of the repetitive manual Docker commands.

**Examples:**

*Pure Docker:*
```bash
docker build -t backend .
docker run -p 8000:8000 backend
```

*Docker Compose:*
```bash
docker compose up -d
docker compose down
```

## 4. Setup VPS, Docker Hub, and SSH Key

- **Buying VPS** (Host with Hostinger): [Hostinger PH](https://hostinger.com/ph)
- **Setup Domain**: Add an **A Record** in your domain's DNS settings pointing `api` (e.g., `api.cloomero.cloud`) to your VPS IP (`72.62.64.176`).

### Docker Hub Setup
1. Create an account on [Docker Hub](https://hub.docker.com/).
2. Create a new Repository.
3. Go to **Account Settings -> Security -> New Access Token**. Generate and save this password securely.

### VPS Server Setup
1. Open CMD/Terminal and SSH into your server:
   ```bash
   ssh root@{IP_ADDRESS}
   ```
2. Create and navigate to the scripts folder:
   ```bash
   mkdir scripts && cd scripts
   ```
3. Set up Docker script:
   ```bash
   nano setup-docker.sh
   # Paste the content of scripts/setup-docker.sh
   # Save by pressing Ctrl + X, then Y, and Enter
   sh setup-docker.sh
   ```
4. Set up Nginx script:
   ```bash
   nano setup-nginx.sh
   # Paste the content of scripts/setup-nginx.sh
   # Save by pressing Ctrl + X, then Y, and Enter
   sh setup-nginx.sh
   ```
   *(Note: This will install Nginx, Certbot, and configure the proxy for `api.cloomero.cloud`)*

### VPS Docker Login
1. Run the login command:
   ```bash
   docker login -u {username}
   ```
2. Enter your generated Access Token when prompted for a password.

### Setup SSH Key (for CI/CD)
Follow the [SETUP_SSH_KEY.md](SETUP_SSH_KEY.md) guide.
- Navigate to the SSH Key section in Hostinger (Stop at "1. Copy the content of your public key").
- Follow the guide until you get the SSH Public Key, then paste it back into Hostinger.

## 5. CI/CD with GitHub Actions

### Server Environment Setup
1. Go to your VPS and create a Docker folder then copy the content of `docker` folder to it:
   ```bash
   mkdir docker
   cd docker
   nano docker-compose.yml
   # Paste the content of docker/docker-compose.yaml
   # Save by pressing Ctrl + X, then Y, and Enter
   ```
2. Add your `.env` to the VPS:
   ```bash
   mkdir -p env/portfolio-backend-api
   cd env/portfolio-backend-api
   nano .env
   ```
   *Paste the content of your local `.env`. Ensure variables like `DATABASE_URL` are set correctly for Prisma.*

### Configuration Files
- **GitHub Action Pipeline**: `.github/workflows/deploy.yaml`
- **Docker Compose (Production)**: `docker/docker-compose.yaml` 
  *(This connects to Docker Hub for production deployments. Make sure the ports match our setup, e.g., `8000:8000`)*
- **Deployment Script**: `scripts/deploy.sh` *(Automates Server -> CI/CD -> DockerHub -> Deploy)*

### GitHub Repository Secrets
Go to your GitHub Repository -> **Settings** -> **Secrets and variables** -> **Actions** -> **New repository secret**. Add the following:

- `DOCKERHUB_USERNAME`: Your username in Docker Hub
- `DOCKERHUB_TOKEN`: Generated Access Token in Docker Hub
- `SSH_HOST`: VPS IP Address (`72.62.64.176`)
- `SSH_USER`: `root`
- `SSH_PRIVATE_KEY`: The content of your private key from [SETUP_SSH_KEY.md](SETUP_SSH_KEY.md)

## 6. Setup Domain & SSL

1. **Configure DNS**: Add an **A Record** in your domain provider's DNS settings, pointing `api` (for `api.cloomero.cloud`) to your VPS IP (`72.62.64.176`).

2. **Create Nginx Configuration**:
   - SSH into your VPS and navigate to the sites-available directory:
     ```bash
     cd /etc/nginx/sites-available
     ```
   - Create a new configuration file (it's best practice to name it after your domain):
     ```bash
     nano api.cloomero.cloud
     ```
   - Paste the following server block configuration:
     ```nginx
     server {
         listen 80;
         server_name api.cloomero.cloud;

         location / {
             proxy_pass http://127.0.0.1:8000;

             proxy_set_header Host $host;
             proxy_set_header X-Real-IP $remote_addr;
             proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
             proxy_set_header X-Forwarded-Proto $scheme;
         }
     }
     ```
     *(Save by pressing Ctrl + X, then Y, and Enter)*

3. **Enable the Site Configuration**:
   Create a symlink to `sites-enabled`:
   ```bash
   sudo ln -s /etc/nginx/sites-available/api.cloomero.cloud /etc/nginx/sites-enabled/
   ```

4. **Restart Nginx**:
   Test Nginx configuration:
   ```bash
   sudo nginx -t
   ```
   Apply the changes by restarting the service:
   ```bash
   sudo systemctl restart nginx
   ```

5. **Verify DNS Propagation**:
   Check if your domain successfully points to your IP address using [whatsmydns.net](https://www.whatsmydns.net/).

6. **Add SSL Certificate (HTTPS)**:
   Run Certbot to automatically fetch and configure a free SSL certificate:
   ```bash
   sudo certbot --nginx -d api.cloomero.cloud
   ```
   *Follow the on-screen prompts to complete the setup.*

7. **Verify SSL Configuration**:
   - Check if `/etc/nginx/sites-enabled/api.cloomero.cloud` has been updated with the SSL configurations by Certbot.
   - Open [https://api.cloomero.cloud](https://api.cloomero.cloud) in your browser. You should see a green padlock indicating the connection is secure.

## 7. Cross-Domain Cookie Configuration (Important)

If you are hosting your frontend and backend on different subdomains (e.g., `www.cloomero.cloud` and `api.cloomero.cloud`), you must explicitly configure your authentication cookies to be shared across the entire root domain.

Update your cookie configuration in the backend:

**File:** `src/controllers/auth.controller.ts`
```typescript
private setAuthCookies(res: Response, tokens: { accessToken: string; refreshToken: string }) {
  const isProduction = ENV.NODE_ENV === "production";
  const domain = isProduction ? ".cloomero.cloud" : undefined;

  res.cookie("accessToken", tokens.accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    domain,
    maxAge: toMilliseconds(TokenExpiry.ACCESS_TOKEN_EXPIRES),
  });

  // Remember to do the same for the refreshToken!
}
```
*Note: You must also pass the `{ domain }` parameter inside the `res.clearCookie` options in your `logout` function so the cookie is successfully cleared when a user logs out!*