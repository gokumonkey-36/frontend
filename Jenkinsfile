pipeline {
    agent any

    environment {
        DOCKER_USER = "gokumonkey"
        TOKEN = "dckr_pat_vHMjHr6LEPU-5_bZln8EdQf_HzY"
        IMAGE_NAME = "frontend"
        DOCKER_SERVER = "ubuntu@3.110.109.12"
    }

    stages {

        stage('Source') {
            steps {
                git branch: 'main',
                url: 'https://github.com/gokumonkey-36/frontend.git'
            }
        }

        stage('Build') {
            steps {
                sh '''
                ssh ${DOCKER_SERVER} "
                    mkdir -p ~/frontend
                "

                scp -r ./* ${DOCKER_SERVER}:~/frontend/

                ssh ${DOCKER_SERVER} "
                    cd ~/frontend &&
                    docker build -t ${DOCKER_USER}/${IMAGE_NAME}:${BUILD_NUMBER} . &&
                    docker login -u ${DOCKER_USER} -p ${TOKEN} &&
                    docker push ${DOCKER_USER}/${IMAGE_NAME}:${BUILD_NUMBER}
                "
                '''
            }
        }

        stage('Test') {
            steps {
                echo 'Skipping tests for now'
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                ssh ${DOCKER_SERVER} "
                    cd ~/frontend &&

                    kubectl apply -f deployment.yaml
                "
                '''
            }
        }
    }
}
