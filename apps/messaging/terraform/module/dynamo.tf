resource "aws_dynamodb_table" "vst_dynamo" {

  name = "${var.app_name}-dynamo-${var.env}"

  tags = {
    Environment = var.env
    Project     = var.app_name
  }

  billing_mode = "PAY_PER_REQUEST"

  hash_key  = "id"
  range_key = "created_at"

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "to_user_id"
    type = "S"
  }

#   attribute {
#     name = "initiate_user_id"
#     type = "S"
#   }

  attribute {
    name = "created_at"
    type = "N"
  }

#   attribute {
#     name = "message"
#     type = "S"
#   }

#   attribute {
#     name = "redirect"
#     type = "S"
#   }

#   attribute {
#     name = "image"
#     type = "S"
#   }

#   attribute {
#     name = "event_type"
#     type = "S"
#   }

  attribute {
    name = "read_at"
    type = "N"
  }

  global_secondary_index {
    name            = "to_user_id_index"
    hash_key        = "to_user_id"
    range_key       = "read_at"
    projection_type = "ALL"
    read_capacity   = 4000
    write_capacity  = 4000
  }

  #   global_secondary_index {
  #     name            = "event_type_index"
  #     hash_key        = "event_type"
  #     range_key       = "created_at"
  #     projection_type = "ALL"
  #     read_capacity   = 4000
  #     write_capacity  = 4000
  #   }
}
