resource "aws_instance" "timesmanager_dev" {
  ami                         = "ami-0c036b62d1a414d7f"
  instance_type               = "t3.micro"
  subnet_id                   = "subnet-0a3c4aef206ae8865"
  vpc_security_group_ids      = ["sg-0c9fa67718696f345"]
  iam_instance_profile        = aws_iam_instance_profile.timesmanager_ec2_dev_instance_profile.name
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
resource "aws_iam_role" "timesmanager_ec2_dev_instance_role" {
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
  name                 = "timesmanager-ec2-dev-instanceRole"
  path                 = "/"
}
resource "aws_iam_instance_profile" "timesmanager_ec2_dev_instance_profile" {
  name = "timesmanager-ec2-dev-instanceRole"
  path = "/"
  role = aws_iam_role.timesmanager_ec2_dev_instance_role.name
}
resource "aws_iam_role_policy_attachment" "cloudwatch" {
  role       = aws_iam_role.timesmanager_ec2_dev_instance_role.name
  policy_arn = "arn:aws:iam::aws:policy/CloudWatchAgentServerPolicy"
}
resource "aws_iam_role_policy" "timesmanager_dynamodb_dev" {
  name = "timesmanager-dynamodb-dev-policy"
  role = aws_iam_role.timesmanager_ec2_dev_instance_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
          "dynamodb:Query",
          "dynamodb:Scan"
        ]
        Resource = [
          aws_dynamodb_table.timesmanager_dynamodb_dev.arn,
          "${aws_dynamodb_table.timesmanager_dynamodb_dev.arn}/index/*"
        ]
      }
    ]
  })
}