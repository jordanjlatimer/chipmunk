const aws = require("aws-sdk")

aws.config.update({
  accessKeyId: "AKIAJ7PTNQPCF7Q2FR3Q",
  secretAccessKey: "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",
  region: "us-east-1"
})

const db = new aws.DynamoDB.DocumentClient()

const params = {
  TableName: "chipmunk",
  Key: {
    username: "jordanjlatimer"
  }
}

db.get(params, (err, data) => {
  if (err){
    console.log(err)
  } else {
    console.log(data)
  }
})