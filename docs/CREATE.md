# Neptune

Inspiration:

- https://aws.amazon.com/blogs/database/build-a-graph-application-with-amazon-neptune-and-aws-amplify/

## Create cluster from CLI

Commands for Neptune cluster creation:

```
aws neptune create-db-cluster --db-cluster-identifier ws-database-1 --engine neptune --engine-version 1.1.1.0
aws neptune create-db-instance --db-instance-identifier ws-neptune --db-instance-class db.t3.medium --engine neptune --db-cluster-identifier ws-database-1
NOT THIS ONE YET - aws neptune create-db-instance --db-instance-identifier ws-read-neptune --db-instance-class db.r5.xlarge --engine neptune --db-cluster-identifier ws-database-1
```

Create IAM role for Neptune to interact with S3

- https://docs.aws.amazon.com/neptune/latest/userguide/bulk-load-tutorial-IAM.html
- Create
- Ensure ALL TCP is enabled on 0.0.0.0/0 (or locked down strictly for AWS Neptune port)

## Bulk load data

curl -X POST \
-H 'Content-Type: application/json' \
https://mind-manor-dev.cluster-cfnt2r7lvj4b.us-east-2.neptune.amazonaws.com:8182/loader -d '
{
"source" : "s3://mind-manor-neptune-data/vertex1.csv",
"format" : "csv",
"iamRoleArn" : "arn:aws:iam::298203888315:role/NeptuneReadS3",
"region" : "us-east-2",
"failOnError" : "FALSE",
"parallelism" : "MEDIUM",
"updateSingleCardinalityProperties" : "FALSE",
"queueRequest" : "TRUE"
}
'

curl -X POST \
-H 'Content-Type: application/json' \
https://mind-manor-dev.cluster-cfnt2r7lvj4b.us-east-2.neptune.amazonaws.com:8182/loader -d '
{
"source" : "s3://mind-manor-neptune-data/edge1.csv",
"format" : "csv",
"iamRoleArn" : "arn:aws:iam::298203888315:role/NeptuneReadS3",
"region" : "us-east-2",
"failOnError" : "FALSE",
"parallelism" : "MEDIUM",
"updateSingleCardinalityProperties" : "FALSE",
"queueRequest" : "TRUE"
}
'

#### Confirm bulk load

curl -G 'https://mind-manor-dev.cluster-cfnt2r7lvj4b.us-east-2.neptune.amazonaws.com:8182/loader/xxxxxxxxxxxxxxxxx'

## Query Data

// limit 1 record
curl -X POST -d '{"gremlin":"g.V().limit(1)"}' https://mind-manor-dev.cluster-cfnt2r7lvj4b.us-east-2.neptune.amazonaws.com:8182/gremlin
curl -X POST -d '{"gremlin":"g.V().limit(1)"}' https://mind-manor-dev.cluster-ro-cfnt2r7lvj4b.us-east-2.neptune.amazonaws.com:8182/gremlin

// all records
curl -X POST -d '{"gremlin":"g.V()"}' https://mind-manor-dev.cluster-cfnt2r7lvj4b.us-east-2.neptune.amazonaws.com:8182/gremlin

## Check status of neptune

curl https://mind-manor-dev.cluster-cfnt2r7lvj4b.us-east-2.neptune.amazonaws.com:8182/status

## Delete data

// Initialize database reset
curl -X POST \
-H 'Content-Type: application/x-www-form-urlencoded' \
https://mind-manor-dev.cluster-cfnt2r7lvj4b.us-east-2.neptune.amazonaws.com:8182/system \
-d 'action=initiateDatabaseReset'

// Perform the reset
curl -X POST -H 'Content-Type: application/json' https://mind-manor-dev.cluster-cfnt2r7lvj4b.us-east-2.neptune.amazonaws.com:8182/system -d '
{
"action": "performDatabaseReset" ,
"token" : "14c09a51-8191-b4f9-e961-deddb0441583"
}'
