resource "aws_instance" "timesmanager_prod" {
  ami           = "ami-0c036b62d1a414d7f"
  instance_type = "t3.micro"

  key_name                    = "keypair:timesmanager-ec2-prod"
  subnet_id                   = "subnet-00a0271e16ae9d477"
  private_ip                  = "172.31.31.101"
  vpc_security_group_ids      = ["sg-09c155df8f42aa7de"]
  associate_public_ip_address = true

  ebs_optimized     = true
  monitoring        = false
  source_dest_check = true

  metadata_options {
    http_endpoint               = "enabled"
    http_protocol_ipv6          = "disabled"
    http_put_response_hop_limit = 2
    http_tokens                 = "required"
    instance_metadata_tags      = "disabled"
  }

  root_block_device {
    volume_size           = 8
    volume_type           = "gp3"
    delete_on_termination = true
    encrypted             = false
    iops                  = 3000
    throughput            = 125
  }

  tags = {
    Name = "timesmanager-ec2-prod"
  }
}
resource "aws_iam_role" "timesmanager_ec2_prod_instance_role" {
  assume_role_policy = jsonencode({
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "ec2.amazonaws.com"
      }
    }]
    Version = "2012-10-17"
  })
  max_session_duration = 3600
  name                 = "timesmanager-ec2-prod-instanceRole"
  path                 = "/"
}
resource "aws_iam_instance_profile" "timesmanager_ec2_prod_instance_profile" {
  name = "timesmanager-ec2-prod-instanceRole"
  path = "/"
  role = aws_iam_role.timesmanager_ec2_prod_instance_role.name
}