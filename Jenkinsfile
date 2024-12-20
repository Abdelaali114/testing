pipeline {
    agent any

    environment {
        DOCKERHUB_USERNAME = "abdelaali2550"
        BACKEND_IMAGE = "${DOCKERHUB_USERNAME}/alumni-server:v1.0"
        FRONTEND_IMAGE = "${DOCKERHUB_USERNAME}/alumni-client:v1.0"
        REGISTRY_CREDS = "dockerhub"
    }

    stages {
        stage('Cleanup Workspace') {
            steps {
                echo 'Cleaning up workspace...'
                cleanWs()
            }
        }

        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                git(
                    branch: 'main',
                    credentialsId: 'github',
                    url: 'https://github.com/Abdelaali114/testing.git'
                )
            }
        }

        stage('Stopping Previous Containers') {
            steps {
                echo 'Stopping and removing previous containers...'
                sh '''
                docker-compose down -v || true
                docker container prune -f
                '''
            }
        }

        stage('Install Client & Server Dependencies') {
            steps {
                echo 'Installing dependencies...'
                sh '''
                cd server
                npm install 
                cd ../client
                npm install
                '''
            }
        }

        stage('Build Client Image') {
            steps {
                echo 'Building client image...'
                sh '''
                docker build -t ${FRONTEND_IMAGE} -f client/Dockerfile client
                '''
            }
        }

        stage('Build Server Image') {
            steps {
                echo 'Building server image...'
                sh '''
                docker build -t ${BACKEND_IMAGE} -f server/Dockerfile server
                '''
            }
        }

        stage('Pushing Images') {
            steps {
                echo 'Pushing images to Docker Hub...'
                withCredentials([usernamePassword(credentialsId: REGISTRY_CREDS, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh '''
                    echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                    docker push ${FRONTEND_IMAGE}
                    docker push ${BACKEND_IMAGE}
                    '''
                }
            }
        }
        stage('Run Containers') {
            steps {
                echo 'Running containers...'
                sh '''
                docker run -d --name alumni-server -p 3001:3001 ${BACKEND_IMAGE}
                docker run -d --name alumni-client -p 5173:5173 ${FRONTEND_IMAGE}
                '''
            }
        }
    }

    post {
        success {
            echo 'Deployment succeeded!'
        }

        failure {
            echo 'Deployment failed. Please check the logs.'
        }

        always {
            echo 'Pipeline execution completed.'
        }
    }
}
