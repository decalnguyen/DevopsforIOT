//CODE_CHANGES = getGitChanges()
pipeline {
    agent any
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
        stage('Install Dependencies') {
            steps {
                script {
                    sh''' 
                    cd thingsboard
                        npm install
                    '''
                }
            }
        }
       /* stage('Build') {
            steps {
                script {
                    sh '''
                        docker build -t decalnguyen/devopsforiot/webapp .
                        '''
                }
            }
        }*/
        stage('Push') {
            steps {
                script {
                    withDockerRegistry(credentialsId: 'docker-regis', url: 'decalnguyen/devopsforiot') {
                            sh '''
                            docker build -t decalnguyen/devopsforiot/webapp:latest .
                            docker push 
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