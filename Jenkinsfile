pipeline {
    agent any

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
                 docker-compose down -v 
                 docker container prune -f
                '''
            }
        }

        stage('New Build') {
            steps {
                echo 'Starting new build with Docker Compose...'
                sh '''
                 docker-compose up --build -d
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
