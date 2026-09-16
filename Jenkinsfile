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
                    dockerImage = docker.build("${DOCKER_HUB_REPO}:latest")
                }
            }
        }
        stage('Trivy Scan'){
            steps {
                sh 'trivy image --severity HIGH,CRITICAL --no-progress --skip-db-update --format table -o trivy-scan-report.txt ${DOCKER_HUB_REPO}:latest'
            }
        }
        stage('Push Image to DockerHub'){
            steps {
                script {
                    echo 'pushing docker image to DockerHub...'
                    docker.withRegistry('https://registry.hub.docker.com', "${DOCKER_HUB_CREDENTIALS_ID}"){
                        dockerImage.push('latest')
                    }
                }
            }
        }
        stage('Install Kubectl & ArgoCd'){
            steps {
                sh '''
                echo 'installing Kubectl & ArgoCd...'
                curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
                chmod +x kubectl
                mv kubectl /usr/local/bin/kubectl
                curl -sSL -o /usr/local/bin/argocd https://github.com/argoproj/argo-cd/releases/latest/download/argocd-linux-amd64
                chmod +x /usr/local/bin/argocd
                '''
            }
        }
        stage('Apply Kubernetes Manifests & Sync App with ArgoCD'){
            steps {
                script {
                    kubeconfig(credentialsId: 'kubeconfig', serverUrl: 'https://192.168.49.2:8443'){
                        sh '''
                        argocd login --port-forward --port-forward-namespace=argocd --username admin --password $(kubectl get secret -n argocd argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d) --insecure
                        argocd app sync node-app --port-forward --port-forward-namespace=argocd
                        '''
                    }
                }
            }
        }
    }
    post {
        always {
            sh 'docker logout'
        }
        success {
            echo 'Build & Deploy completed successfully!'
        }
        failure {
            echo 'Build & Deploy failed. Check logs.'
        }
    }
}