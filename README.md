# FinCard Waitlist Application

A multi-stage Dockerized application with a React frontend and Node.js backend for a fintech waitlist. This application collects user information for a waitlist and stores it in a PostgreSQL database.

## Project Structure

- `/frontend`: React frontend application
- `/backend`: Node.js Express backend API
- `docker-compose.yml`: Local development setup

## Local Development

### Prerequisites

- Docker and Docker Compose
- Node.js (for local development without Docker)
- Git

### Running Locally with Docker

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd devops-static-site
   ```

2. Start the application using Docker Compose:
   ```bash
   docker-compose up -d
   ```

3. The application will be available at:
   - Frontend: http://localhost
   - Backend API: http://localhost:5000
   - PostgreSQL: localhost:5432

### Running Without Docker

#### Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. The frontend will be available at http://localhost:3000

#### Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. The API will be available at http://localhost:5000

## EC2 Deployment Process

### EC2 Instance Setup (for both instances)

1. Launch two EC2 instances:
   - One for the frontend
   - One for the backend

2. For each instance:
   - Use Amazon Linux 2 or Ubuntu
   - Ensure security groups allow the necessary ports:
     - Frontend: HTTP (80), HTTPS (443), SSH (22)
     - Backend: HTTP (5000), SSH (22)
   - Attach an Elastic IP to each instance for a static public IP

3. Connect to each instance:
   ```bash
   ssh -i your-key.pem ec2-user@instance-public-ip
   ```

4. Install Docker on each instance:
   ```bash
   # For Amazon Linux 2
   sudo yum update -y
   sudo amazon-linux-extras install docker
   sudo service docker start
   sudo usermod -a -G docker ec2-user
   
   # For Ubuntu
   sudo apt update
   sudo apt install -y docker.io
   sudo systemctl enable --now docker
   sudo usermod -a -G docker ubuntu
   ```

5. Install Git:
   ```bash
   # For Amazon Linux 2
   sudo yum install -y git
   
   # For Ubuntu
   sudo apt install -y git
   ```

### Backend Deployment (EC2 Instance 1)

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd devops-static-site
   ```

2. Build and run the backend Docker container:
   ```bash
   cd backend
   docker build -t fincard-backend .
   docker run -d --name fincard-backend \
     -p 5000:5000 \
     -e DB_HOST=your-rds-endpoint.rds.amazonaws.com \
     -e DB_PORT=5432 \
     -e DB_NAME=fincard \
     -e DB_USER=postgres \
     -e DB_PASSWORD=your-password \
     fincard-backend
   ```

3. For RDS PostgreSQL setup:
   - Create an RDS PostgreSQL instance in AWS
   - Configure security groups to allow traffic from your backend EC2 instance
   - Create the initial database named `fincard`
   - Update the environment variables to connect to your RDS instance

### Frontend Deployment (EC2 Instance 2)

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd devops-static-site
   ```

2. Update the API URL to point to your backend EC2 instance:
   ```bash
   cd frontend
   # Edit the .env file or pass the environment variable during build
   echo "REACT_APP_API_URL=http://backend-ec2-public-ip:5000" > .env
   ```

3. Build and run the frontend Docker container:
   ```bash
   docker build -t fincard-frontend .
   docker run -d --name fincard-frontend -p 80:80 fincard-frontend
   ```

### Adding HTTPS with Certbot (Optional)

1. Install Certbot on the frontend EC2 instance:
   ```bash
   # For Amazon Linux 2
   sudo amazon-linux-extras install epel
   sudo yum install -y certbot
   
   # For Ubuntu
   sudo apt install -y certbot python3-certbot-nginx
   ```

2. Obtain and install SSL certificate (replace with your domain):
   ```bash
   sudo certbot --nginx -d yourdomain.com
   ```

### Setting Up CI/CD with GitHub Actions (Optional)

1. Create `.github/workflows/deploy.yml` in your repository for automated deployments.

2. Add AWS credentials as GitHub secrets:
   - AWS_ACCESS_KEY_ID
   - AWS_SECRET_ACCESS_KEY

3. Configure the workflow to build and deploy to your EC2 instances on pushes to main branch.

## Monitoring and Maintenance

1. Set up CloudWatch for monitoring EC2 instances:
   ```bash
   sudo yum install -y amazon-cloudwatch-agent
   # Configure CloudWatch agent...
   ```

2. Set up log rotation for Docker containers:
   ```bash
   docker run -d --name fincard-backend \
     --log-driver=json-file \
     --log-opt max-size=10m \
     --log-opt max-file=3 \
     # other options...
   ```

3. Create a backup strategy for your PostgreSQL database using RDS automated backups.

## Troubleshooting

- Check container logs:
  ```bash
  docker logs fincard-frontend
  docker logs fincard-backend
  ```

- Check if containers are running:
  ```bash
  docker ps
  ```

- Restart containers:
  ```bash
  docker restart fincard-frontend
  docker restart fincard-backend
  ```

## Contact

For more information, please contact your DevOps team.