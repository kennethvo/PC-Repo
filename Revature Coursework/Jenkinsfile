pipeline {
    agent any
    
    tools {
        jdk 'JDK25'
    }
    
    environment { //set environment variables for the pipeline
        DOCKER_IMAGE = 'kafkamessager'
        DOCKER_TAG = "${BUILD_NUMBER}"
    }
    
    stages {
        stage('Hello') {
            steps {
                echo 'Hello World'
            }
        }
        
        stage('Git Checkout') { // git checkout the source code
            steps {
                echo 'Clone the repo...'
                git branch: 'main', url: 'https://github.com/251027-Java/trainer-code.git'
            }
        }
        
        stage('Maven dependencies') { // mvnw install dependencies
            steps {
                echo 'Running a clean install' 
                sh 'cd ./W8/Kafka && chmod +x ./mvnw && ./mvnw clean install'
            }
        }
        
        stage('Build and Package') { // build the jar
            steps {
                dir('./W8/Kafka') {
                    sh './mvnw package -DskipTests'
                }
            }
        }
        
        stage('Build a Docker Image') { // docker build
            steps {
                dir('./W8/Kafka') {
                    sh "docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} ."
                }
            }
        }
    }
}
