def gv 
CODE_CHANGES = getGitChanges()
pipeline {
    agent any
    environment{
        IMAGE_NAME='server'
    }
    stages {
        stage('init') { 
            steps {
                script {
                    gv = load "script.groovy"
                }
            }
        }
        stage('Build') {
            steps {
                script {
                    gv.buildServices()
                }
            }
        }
        stage('Push') {
            steps {
                script {
                    gv.pushServices()
                }
            }
        }
        stage('Deploy') {
            steps {
                when {
                    expression {
                        BRANCH_NAME == 'master' && CODE_CHANGES == true
                    }
                }
                script { 
                    gv.deployServices()
                }
            }
        }
    }

}