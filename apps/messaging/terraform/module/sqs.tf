resource "aws_sqs_queue" "wtf_queue" {
  name = "${var.app_name}-${var.env}-wtf-queue"
}