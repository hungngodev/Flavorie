
tag:=v1.0.${TAG}
images_name:=flavorie-peerjs
repository:=hungngodev

all: build push

build:
	@ docker build --platform linux/amd64 -t ${images_name}:${tag} .

push:
	@ echo "push ${repository}/${images_name}:${tag} to docker hub"
	@ docker tag ${images_name}:${tag} ${repository}/${images_name}:${tag}
	@ docker push ${repository}/${images_name}:${tag}