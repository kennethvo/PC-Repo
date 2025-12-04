
2025-09-24 23:22

Tags: [[AWS]], [[Summary]], [[IAM]]

# IAM Guidelines & Best Practices

- Don't use the root acc except for AWS acc setup
- One physical user = One AWS user
- Create strong password policy, and use MFA
- Create/use Roles for giving perms to AWS services
- Use Access Keys for Programmatic Access (CLI and SDK)
- Audit perms using IAM Cred Report and Access Advisor
- Never share IAM users & Access Keys

## Shared Responsibility Model for IAM

AWS is responsible for:
- Infrastructure (global network security)
- Config and vulnerability analysis
- Compliance validation

You are responsible for:
- Users, Groups, Roles, Policies
- MFA on accounts
- Rotating keys often
- Using IAM tools for appropriate permissions
- Analyzing access patterns and reviewing perms

## Summary

Users: mapped to physical user, has a password for console
Groups: contain users only
Policies: JSON docs that outline perms for users or groups
Roles: IAM entity that defines perms for AWS services requests
Security: MFA + Password policy
CLI: manage AWS using command line
SDK: manage AWS using programming language
Access Keys: access AWS using CLI or SDK
Audit: Cred Reports or Access Advisor

## Keep in Mind

- A statement in an IAM Policy consists of Sid, Effect, Principal, Action, Resource and Condition

# References