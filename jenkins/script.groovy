def buildServices() [
    sh '''
    docker build -f Dockerfile.deploy -t devopsforiot .
    '''
]

def git() {
    sh
}
def pushServices() {

    sh '''
    '''
}

def testServices() {
    echo 'Testing'
}

def deployServices() {
    sh '''
        docker run 
    '''
}
return this