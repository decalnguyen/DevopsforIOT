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
                     git credentialsId: 'server_gat_2', branch: 'master', url: 'https://github.com/decalnguyen/DevopsforIOT.git'
            }
        }
        stage('Build') {
            steps {
                script {
                    sh '''
                        cd thingsboard
                        docker build -t decalnguyen/webapp:1.2 .
                        '''
                }
            }
        }
        stage('Push') {
            steps {
                script {
                    withCredentials([string(credentialsId: 'docker_cre3', variable: 'docker_cre')]) {
                           sh '''
                           docker login -u decalnguyen -p ${docker_cre}
                            docker push decalnguyen/webapp:1.2
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
                        docker run -d -p 8089:80 --name webapp decalnguyen/webapp
                    '''
                    
                }

            }
        }
    }
}