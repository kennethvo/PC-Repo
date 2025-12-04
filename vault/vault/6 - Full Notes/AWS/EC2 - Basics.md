
2025-09-25 12:57

Tags: [[AWS]], [[EC2]]

# EC2 - Basics
Elastic Compute Cloud = Infrastructure as a Service
- Rent virtual machines (EC2)
- Store data on virtual drives (EBS)
- Distribute load across machines (ELB)
- Scale services using an auto-scaling group (ASG)

## EC2 configurations
- OS used
- Computing power & cores (CPU)
- RAM
- Storage space
	- Network-attached (EBS & EFS)
	- Hardware (EC2 Instance Store)
- Network card: speed of card, public IP address
- Firewall rules: security group
- Bootstrap script

## Bootstrapping
You can bootstrap instances using EC2 User data script
- means launching commands when a machine starts
- only runes once at the instance first start
EC2 user data is used to automate boot tasks like:
- installing updates or software
- downloading common files
EC2 User data script runs with the root user

# References