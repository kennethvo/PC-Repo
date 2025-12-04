
2025-10-05 01:47

Tags: [[AWS]], [[EC2]]

# EC2 - Security Groups
Fundamental of network security in AWS
- control how traffic is allowed in and out of EC2 Instances (act as a firewall)
- Security groups only contain allow rules
- rules can reference by IP or by group

Regulate:
- Access to ports
- Authorized IP ranges - IPv4 and IPv6
- Control of in/outbound network (from other to the instance/from instance to other)
![[Pasted image 20251005015112.png]]
- Port range is where the traffic can go on through the instance
- Source is IP address range

![[Pasted image 20251005015400.png]]

## Security groups Good to knows
- can be attached to multiple instances
- locked down to a region /VPC combination
- lives outside the EC2 (if traffic is blocked, EC2 instance won't see it)
- good to maintain one separate security group for SSH access
- if your app is NOT ACCESSIBLE, it's a security group issue
- if your app gives CONNECTION REFUSED ERROR, it's an app error/ it's not launched
- all inbound traffic is blocked by default
- all outbound is authorized by default
- timeout during ANY connection it is the cause of an EC2 security group

![[Pasted image 20251005015746.png]]

## Ports to know
- 22 = SSH (Secure Shell) - log into Linux instance
- 21 = FTP (File Transfer Protocol) - upload files into file share
- 22 = SFTP (Secure File Transfer Protocol) - upload files using SSH
- 80 = HTTP - access unsecured websites
- 443 = HTTPS - access secured websites
- 3389 = RDP (Remote Desktop Protocol) - log into a windows instance





# References
[[EC2 - Basics]]
[[EC2 - Instance Types]]