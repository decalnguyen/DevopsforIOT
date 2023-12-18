def buildServices() [
    sh '''
    cd thingsboard
    docker build -t decalnguyen/webapp .
    '''
]

def pullGit() {
    git credetialsId: github, url: https://github.com/decalnguyen/DevopsforIOT.git
}
def pushServices() {

    sh '''
        docker push decalnguyen/webapp:latest
    '''
}

def testServices() {
    echo 'Testing'
}

def deployServices() {
    sh '''
        docker-compose up --build 
    '''
}
return this