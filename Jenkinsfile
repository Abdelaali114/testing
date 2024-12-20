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
                docker stop alumni-server || true
                docker rm alumni-server || true
                docker stop alumni-client || true
                docker rm alumni-client || true
                docker container prune -f || true
                docker network rm alumni-network || true
                '''
            }
        }

        stage('Build and Push Images') {
            parallel {
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
            }
        }

        stage('Push Images') {
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
                script {
                    def UNIQUE_ID = UUID.randomUUID().toString().take(8)
                    echo 'Running containers...'
                    sh """
                    docker network create alumni-network || true

                    docker run -d --name alumni-server-${UNIQUE_ID} --network alumni-network -p 3001:3001 ${BACKEND_IMAGE}
                    docker run -d --name alumni-client-${UNIQUE_ID} --network alumni-network -p 5173:5173 \
                      -e VITE_API_URL=http://alumni-server-${UNIQUE_ID}:3001 ${FRONTEND_IMAGE}
                    """
                }
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
