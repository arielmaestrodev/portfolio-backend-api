1. Finalization
- SETUP_BUILD_AND_LINT.md docs.
- Make sure to fix lints issue
- Node version must be v22.18.0 upwards
- Then proceed on testing npm run build and npm run start

2. Describe Technologies we will be using
- VPS: Server Machine
- Docker: Containerization
- Nginx: Reverse Proxy
-- A reverse proxy is an intermediary server that sits in front of web servers. It intercepts incoming requests from clients (users on the internet) and routes them to the appropriate backend server, acting as the public "face" of your infrastructure.
-- It hides the true IP addresses of your backend servers. Ex. 192.168.123.111:3000 -> www.arielbatoon.com or 192.168.123.111:8000 -> api.arielbatoon.com
-- You can easily host multiple sites as well as long as different ports and easily assign a domain.

3. Dockerfile & Docker Compose Setup
- Dockerfile -> instructions for building a single app/container
- docker-compose.yaml -> manages and connects multiple services like frontend, backend, database, nginx, etc.
- Docker Compose also removes most of the repetitive manual Docker commands
- Eg.: 8000:8000 (HOST_PORT : CONTAINER_PORT)
Example:
Pure Docker:
docker build -t backend .
docker run -p 8000:8000 backend

Docker Compose:
docker compose up -d
docker compose down

4. Setup VPS, Docker Hub, and SSH Key
- Buying VPS (Host with Hostinger): https://hostinger.com/ph
- Setup Dockerhub: https://hub.docker.com/
 - Create Repository
 - Account Settings -> Generate New Access Token (Secure/Save Password)
- Setup VPS Server
 - Open CMD then type ssh root@{IP_ADDRESS}
 - mkdir scripts then cd scripts
 - nano setup-docker.sh then Paste the content of scripts/setup-docker.sh after save by doing Ctrl + X then Y and Enter
 - Run the Docker Setup Script: sh setup-docker.sh
 - nano setup-nginx.sh then Paste the content of scripts/setup-nginx.sh after save by doing Ctrl + X then Y and Enter
 - Run the Nginx Setup Script: sh setup-nginx.sh
- Docker Login in VPS:
 - command: docker login -u {username} then enter the Access Token Password
- Setup SSH Key for the VPS (Will be using for the CI/CD) - Guide: portfolio-backend-api\Docs\SETUP_SSH_KEY.md
  - Navigate the SSH Key in the Hostinger (Stop until 1. Copy the content of your public key.)
  - Follow the Guide until you can get the SSH Key Public then paste it back to the Hostinger

 5. CI/CD with Github Action Setup
 - Go to VPS then mkdir docker
 - Setup portfolio-backend-api\.github\workflows\deploy.yaml
 - Setup Docker Compose (This one connected to the DockerHub unlike the other Docker is for internal network only for testing this one is for the production - so we need to make sure port here is different/unique than the other app): portfolio-backend-api\docker\docker-compose.yaml
 - Setup Scripts to automate process from Server -> CI/CD (Github Actions) -> DockerHub -> Deploy: portfolio-backend-api\scripts\deploy.sh
 - Go to GitHub Repository then Settings -> Secrets and variables -> Actions -> Add Repository secrets
  - DOCKERHUB_USERNAME: Your username in Docker Hub
  - DOCKERHUB_TOKEN: Generated Access Token in Docker Hub
  - SSH_HOST: IP Address
  - SSH_USER: root
  - SSH_PRIVATE_KEY: Copy the content of your private key -> portfolio-backend-api\Docs\SETUP_SSH_KEY.md (Copy the content of your private key)