#!/usr/bin/env bash

set -eu

error() {
  echo "$1"
  exit 1
}

SCRIPT=$0

print_usage() {
  echo "usage: $SCRIPT --flavor flavor"
  echo "   -f, --flavor flavor     Flavor to deploy to, possible values are 'staging' and 'prod'"
}

FLAVOR=
SKIP_IMAGE_BUILD=

while [[ $# -gt 0 ]]
do
  key="$1"

  case $key in
      -f|--flavor)
        FLAVOR="$2"
        shift
        shift
      ;;
      --skip-image-build)
        SKIP_IMAGE_BUILD=true
        shift
      ;;
      -h|--help)
        print_usage
        exit 0
      ;;
      *)    # unknown option
        error "Unknown option $1"
      ;;
  esac
done

if [[ -z "$FLAVOR" ]]; then
  print_usage
  exit 0
fi

PROJECT=
ZONE="australia-southeast1-b"

case $FLAVOR in
  staging)
    PROJECT=masterframing-staging
  ;;
  prod)
    PROJECT=masterframing-prod
  ;;
  *)
    error "Unsupported flavor: $FLAVOR"
  ;;
esac

IMAGE=asia.gcr.io/$PROJECT/masterframing-web
INSTANCE_GROUP=masterframing-web

if [[ "$SKIP_IMAGE_BUILD" != "true" ]]; then
  echo "Building image: $IMAGE"
  docker build . -t $IMAGE --build-arg flavor="$FLAVOR"

  echo "Deploying image: $IMAGE"
  docker push $IMAGE
else
  echo "Skipping image build"
fi

echo "Recreating instances for: $INSTANCE_GROUP"
gcloud --project "$PROJECT" compute instance-groups managed rolling-action replace "$INSTANCE_GROUP" --zone="$ZONE" --max-surge=3 --max-unavailable=1

echo "Waiting for updates to finish"
gcloud --project "$PROJECT" compute instance-groups managed wait-until --stable "$INSTANCE_GROUP" --zone="$ZONE"

