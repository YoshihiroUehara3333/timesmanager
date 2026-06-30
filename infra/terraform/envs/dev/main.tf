import {
  to = aws_instance.timesmanager_dev
  id = "i-067a66f67ad8a7b60"
}
import {
  to = aws_iam_role.timesmanager_ec2_dev_instance_role
  id = "timesmanager-ec2-dev-instanceRole"
}
import {
  to = aws_iam_instance_profile.timesmanager_ec2_dev_instance_profile
  id = "timesmanager-ec2-dev-instanceRole"
}
import {
  to = aws_dynamodb_table.timesmanager_dynamodb_dev
  id = "timesmanager_dev"
}