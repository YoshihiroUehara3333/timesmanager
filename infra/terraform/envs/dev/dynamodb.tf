resource "aws_dynamodb_table" "timesmanager_dynamodb_dev" {
  billing_mode                = "PAY_PER_REQUEST"
  deletion_protection_enabled = false
  hash_key                    = "partition_key"
  name                        = "timesmanager_dev"
  range_key                   = "sort_key"
  region                      = "ap-northeast-1"
  stream_enabled              = false
  table_class                 = "STANDARD"
  attribute {
    name = "partition_key"
    type = "S"
  }
  attribute {
    name = "sort_key"
    type = "S"
  }
  point_in_time_recovery {
    enabled = false
  }
  ttl {
    attribute_name = null
    enabled        = false
  }
}
