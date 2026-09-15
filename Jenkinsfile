pipeline {
    agent any
    tools {
        nodejs 'NodeJs'
    }

    environment {
        DOCKER_HUB_REPO = 'b00mgr3rt/devopschallenge1'
        DOCKER_HUB_CREDENTIALS_ID = 'DevOpsChallenge1'
    }
    stages {
        stage('Checkout Github'){
            steps {
               git branch: 'main', credentialsId: 'github-token', url: 'https://github.com/bom254/DevOpsChallenge1.git'
            }
        }

        stage('Install node dependencies'){
            steps{
                sh '''
                echo 'installing node dependencies...'
                '''
                sh 'npm install'
            }
        }
        stage('Build Docker Image'){
            steps {
                script {
                    echo 'building docker image...'
                    def dockerImage = docker.build("${DOCKER_HUB_REPO}:latest")
                }
            }
        }
        stage('Trivy Scan'){
            steps {
                sh 'docker run --rm \
                            -v /var/run/docker.sock:/var/run/docker.sock \
                            aquasec/trivy:latest image \
                            --severity HIGH,CRITICAL \
                            --no-progress \
                            --skip-update \
                            --formart table \
                            -o trivy-scan-report.txt \
                            --exit-code 1 \
                            --ignore-unfixed \
                            ${DOCKER_HUB_REPO}:latest'
            }
        }
    }
    post {
        success {
            echo 'Build & Deploy completed successfully!'
        }
        failure {
            echo 'Build & Deploy failed. Check logs.'
        }
    }
}