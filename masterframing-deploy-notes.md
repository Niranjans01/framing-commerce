# Masterframing deploy notes

## General

- create firebase project (set default region to `australia-southeast1`)
- update .env files



## Database

- create firestore database (requires owner permissions)

## Authentication

- enable email/password sign-in method

## Buckets

- create public and private buckets:  `public-masterframing-{flavor}`  and `private-masterframing-{flavor}` where `flavor` is either `dev`, `staging` and`prod`. (ensure region is set to `australia-southeast1` - use single region, uniform permissions, google managed key)

- add `Cloud Storage Viewer` role to `allUser` on `public-masterframing-{flavor}`.

- add `Cloud Storage Admin` role to `masterframing-{flavor}@appspot.gserviceaccount.com` on `public-masterframing-{flavor}`and `private-masterframing-{flavor}`

- In IAM - add `Service Account Token Creator ` role to `masterframing-{flavor}@appspot.gserviceaccount.com` (requires owner permissions).

- add `delete object 1 day(s) since custom time` lifecycle policy to both buckets.

- enable IAM service account credentials: https://console.developers.google.com/apis/api/iamcredentials.googleapis.com/overview?project=3393121351

- Run: 

  ```shell
  gsutil cors set cors.json gs://public-masterframing-staging
  gsutil cors set cors.json gs://private-masterframing-staging
  ```

## Functions

### Configurations

Configurations can be set via `firebase functions:config:set service.key=value`

#### Eway

- `eway.key`
- `eway.password`
- `eway.endpoint`

#### Afterpay

- `afterpay.key`
- `afterpay.url`
- `afterpay.id`

#### Mandril

- `mandrill.key`

#### Mailchimp

- `mailchimp.key`
- `mailchimp.list`

#### Redirect URL calculations

- `host.web` (URL where the frontend is hosted, i.e `http://34.95.108.103`, `https://masterframing.com.au`)
- `host.api` (URL where the API is hosted, i.e `https://australia-southeast1-masterframing-staging.cloudfunctions.net/api`).

#### Image buckets

- `bucket.public` (i.e `public-masterframing-staging`)
- `bucket.private` (i.e `private-masterframing-staging`)

## Hosting

### Configurations

Configurations can be set in `firebase.json`

Default configurations for hosting are:

```json
"hosting": {
  "public": "out",
  "headers": [ {
    "source" : "**",
    "headers" : [ {
      "key" : "Access-Control-Allow-Origin",
      "value" : "*"
    } ]
  } ]
}
```
### Deploying

```shell
$ ./ci/bin/deploy_functions -t <token> -f <staging|prod>
$ ./ci/bin/deploy_hosting
```