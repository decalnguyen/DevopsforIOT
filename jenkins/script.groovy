def buildServices() [
    script{
        def dockerImage = docker.build('server/server')
        docker.withRegistry('http', '')
        {
              dockerImage.push()
        }
    }
    sh '''
    docker build -f Dockerfile.deploy -t devopsforiot .
    '''
]

def pullGit() {
    git credetialsId: github, url: https://github.com/decalnguyen/DevopsforIOT.git
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
        docker-compose up --build 
    '''
}
return this