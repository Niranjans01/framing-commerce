#!/usr/bin/env bash

set -eu

error() {
  echo "$1"
  exit 1
}

SCRIPT=$0

print_usage() {
  echo "usage: $SCRIPT --token token --flavor flavor"
  echo "   -t, --token token       Token from running 'firebase login:ci'"
  echo "   -f, --flavor flavor     Flavor to deploy to, possible values are 'staging' and 'prod'"
}

TOKEN=
FLAVOR=

while [[ $# -gt 0 ]]
do
  key="$1"

  case $key in
      -f|--flavor)
        FLAVOR="$2"
        shift # past argument
        shift # past value
      ;;
      -t|--token)
        TOKEN="$2"
        shift # past argument
        shift # past value
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

if [[ -z "$TOKEN" || -z "$FLAVOR" ]]; then
  print_usage
  exit 0
fi

PROJECT=

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

firebase --project "$PROJECT" --token "$TOKEN" deploy --only functions