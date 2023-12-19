//CODE_CHANGES = getGitChanges()
pipeline {
    agent any
    environment{
        IMAGE_NAME='server'
    }
    stages {
       /* stage('init') { 
            steps {
                script {
                    gv = load "script.groovy"
                }
            }
        }*/
        //stage('Check') {
         //   steps {
          //      checkout scmGit(branches: [[name: '*/master']], extensions: [], userRemoteConfigs: [[credentialsId: 'github', url: 'https://github.com/decalnguyen/DevopsforIOT.git']])
           //     sh 'mvn clean install'
           // }
      //  }
        stage('Build') {
            steps {
                script {
                    sh '''
                        cd thingsboard
                        docker build -t decalnguyen/webapp .
                        '''
                }
            }
        }
        stage('Push') {
            steps {
                script {
                    withCredentials([string(credentialsId: 'github-gat', variable: 'docker-regis')]) {
                     sh '''
                            docker login -u decalnguyen -p ${docker-regis}
                            docker push decalnguyen/webapp:latest
                        '''
                    }
                    }
                }
            }
        stage('Deploy') {
            steps {
               /* when {
                    expression {
                        BRANCH_NAME == 'master' && CODE_CHANGES == true
                    }
                }*/
                script { 
                    sh '''
                        docker pull decalnguyen/webapp:latest
                        docker rm -f webapp
                        docker-compose -f docker-compose-ui.yml up --build
                    '''
                    
                }

            }
        }
    }
}