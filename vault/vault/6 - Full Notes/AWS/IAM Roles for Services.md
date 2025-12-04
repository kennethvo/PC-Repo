
2025-09-24 22:50

Tags: [[AWS]], [[IAM]], [[Security Tools]], [[Roles]]

# IAM Roles for Services

Some AWS services need to perform actions for us. So we assign perms to AWS services using IAM Roles

## Example
We can assign IAM Role to EC2 Instance to access the call to AWS
- EC2 Instance roles
- Lambda function roles
- Roles for CloudFormation

## Creating a Role
Just go into roles and create and click AWS services and find EC2 under Use case. 
After that when asked to add permissions the tutorial just said to search for IAMReadOnlyAccess but you can do anything depending on what you need

# IAM Security Tools

## IAM Credentials Report (acc-level)
Report that lists all users and their statuses on various credentials
Can be generated under IAM > Access reports > Credential report

## IAM Access Advisor (user-level)
Shows service perms granted to a user and when they were last accessed.
- Can be used to revise your policies
IAM > Users > username > Last Accessed

# References
[[IAM Guidelines & Best Practices]]