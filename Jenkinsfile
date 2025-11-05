pipeline {
    agent any
    environment {
        APP_NAME = "flask-backend"
    }
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/Anju-Narnolia/Flask-backend.git', credentialsId: 'github-creds'
            }
        }
        stage('Build Docker Image') {
            steps {
                script {
                    sh 'docker build -t ${APP_NAME}:latest .'
                }
            }
        }
        stage('Run Container') {
            steps {
                script {
                    // Stop any existing container with same name
                    sh 'docker stop ${APP_NAME} || true && docker rm ${APP_NAME} || true'
                    // Run new container on port 5000
                    sh 'docker run -d -p 5000:5000 --name ${APP_NAME} ${APP_NAME}:latest'
                }
            }
        }
    }
    post {
        success {
            echo "✅ Flask backend deployed successfully!"
        }
        failure {
            echo "❌ Build failed. Check logs."
        }
    }
}
