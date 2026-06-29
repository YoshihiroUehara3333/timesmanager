resource "aws_instance" "timesmanager_dev" {
  ami                         = "ami-0c036b62d1a414d7f"
  instance_type               = "t3.micro"
  subnet_id                   = "subnet-0a3c4aef206ae8865"
  vpc_security_group_ids      = ["sg-0c9fa67718696f345"]
  iam_instance_profile        = "timesmanager-ec2-dev-instanceRole"
  key_name                    = "keypair:timesmanager-ec2-dev"
  availability_zone           = "ap-northeast-1c"
  private_ip                  = "172.31.2.114"
  associate_public_ip_address = true

  ebs_optimized = true
  monitoring    = false

  metadata_options {
    http_endpoint               = "enabled"
    http_tokens                 = "required"
    http_put_response_hop_limit = 2
  }

  root_block_device {
    volume_size           = 8
    volume_type           = "gp3"
    delete_on_termination = true
    encrypted             = false
  }

  tags = {
    Name = "timesmanager-ec2-dev"
  }
}