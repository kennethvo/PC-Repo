# AWS CLI - command line interface

- download and install the aws cli
- configure with keys to establish link to AWS
- default region
- default ouput format
- validate the cli install
    `aws --version`

**Be careful of the REGION!!!**

Elastic beanstalk has it's own tool!

- install python to get pip package manager
- use pip to install the EB cli
`pip install awsebcli --upgrade`

## S3 bucket creation

- bucket creation -  `$ aws s3 mb s3://2304-sspa-navbar-cli --region us-west-1`
- Static web hosting - `$ aws s3 website s3://2304-sspa-navbar-cli --index-document index.html`
- check public policy - `$ aws s3api get-public-access-block --bucket 2304-sspa-navbar-cli`
- allow policy access - `$ aws s3api delete-public-access-block --bucket 2304-sspa-navbar-cli`
- access policy - `$ aws s3api put-bucket-policy --bucket 2304-sspa-navbar-cli --policy file://bucket-policy.json`
- cors policy - `$ aws s3api put-bucket-cors --bucket 2304-sspa-navbar-cli --cors-configuration file://bucket-cors-policy.json`
- deploy files - `$ aws s3 sync dist/ s3://2304-sspa-navbar-cli/ --delete`

---

## Elastic Beanstalk

I had to update my path first to make this work, turns out my install went to:
`C:\Users\RichardHawkins\AppData\Roaming\Python\Python313\Scripts`
When you install, you can run `pip show awsebcli` and look for the `Location`.
swap the `\site-packages` for `\Scripts`, and add that new location to your PATH.

- Install the EB cli - `pip install awsebcli --upgrade`
- Verify the install - `eb --version`
- Inialize the EB - `eb init --region us-west-1`
- Create and EB env - `eb create 2304-sspa-products-cli-env --single`

