resource "aws_cloudwatch_log_group" "compute_log_group" {
  name = "${var.app_name}-${var.env}"
  tags = {
    Environment = var.env
    Project     = var.app_name
  }
}
