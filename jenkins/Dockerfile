FROM jenkins/jenkins

USER root

# Install prerequisites
RUN apt-get update && apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg2 \
    software-properties-common

# Add Docker’s official GPG key
RUN curl -fsSL https://download.docker.com/linux/debian/gpg | apt-key add -

# Add Docker repository
RUN add-apt-repository \
    "deb [arch=amd64] https://download.docker.com/linux/debian \
    $(lsb_release -cs) \
    stable"

# Install Docker
RUN apt-get update && apt-get install -y docker-ce-cli

ARG DOCKER_GID=1001

RUN groupadd docker \
    && usermod -aG docker jenkins

USER jenkins