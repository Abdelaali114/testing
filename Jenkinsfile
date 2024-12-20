pipeline {
    agent any

    stages {
        stage('Checkout') {

            steps {
                git(
                    url: 'https://github.com/SalmaHazal/Dockerized_Alumni.git',
                    branch: 'main',
                    credentialsId: 'github_credentials'
                )
            }
        }

        stage('Stop and Remove Previous Containers') {
            steps {
                script {
                    sh 'docker-compose down --volumes --remove-orphans'
                }
            }
        }

        // stage('Remove Previous Docker Images') {
        //     steps {
        //         script {
        //             // Stop and remove all containers
        //             sh '''
        //             running_containers=$(docker ps -q)
        //             if [ ! -z "$running_containers" ]; then
        //                 echo "Stopping running containers..."
        //                 docker stop $running_containers
        //             else
        //                 echo "No running containers to stop."
        //             fi

        //             all_containers=$(docker ps -aq)
        //             if [ ! -z "$all_containers" ]; then
        //                 echo "Removing all containers..."
        //                 docker rm -f $all_containers
        //             else
        //                 echo "No containers to remove."
        //             fi
        //             '''

        //             // Remove all images, including those with dependencies, by forcing where necessary
        //             sh '''
        //             all_images=$(docker images -q)
        //             if [ ! -z "$all_images" ]; then
        //                 echo "Removing all images..."
        //                 docker rmi -f $all_images
        //             else
        //                 echo "No images to remove."
        //             fi
        //             '''
        //         }
        //     }
        // }


        stage('Build New Images') {
            steps {
                script {
                    sh 'docker-compose build'
                }
            }
        }

        stage('Start Containers') {
            steps {
                script {
                    sh 'docker-compose up -d'
                }
            }
        }

        stage('Cleanup') {
            steps {
                script {
                    // Optional: Clean up unused Docker images, networks, volumes after the build
                    sh 'docker system prune -f'
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
    }
}
