pipeline {
    agent any
    tools {
        nodejs 'NodeJS'
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
    }
}