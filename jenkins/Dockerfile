FROM jenkins/jenkins

USER root

ARG DOCKER_GID=137

RUN groupadd -g ${DOCKER_GID} docker \
    && usermod -a -G docker jenkins

USER jenkins