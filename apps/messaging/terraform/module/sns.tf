resource "aws_sns_topic" "vst-core-topic" {
  name = "${var.app_name}-${var.env}-core-topic"
}

resource "aws_sns_topic_subscription" "wtf_subscription" {
  topic_arn = aws_sns_topic.vst-core-topic.arn
  protocol  = "sqs"
  endpoint  = aws_sqs_queue.wtf_queue.arn

  filter_policy = <<POLICY
  {
    "event_type": ["wtf"]
  }
  POLICY
}



