
data "aws_iam_policy_document" "assume_role" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "iam_for_lambda" {
  name               = "iam_for_lambda"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}


resource "aws_lambda_function" "wtf_lambda" {
  function_name = "${var.app_name}-${var.env}-wtf-lambda"
  role          = aws_iam_role.iam_for_lambda.arn
  package_type  = "Image"
  image_uri     = "${aws_ecr_repository.wtf_vst_ecr_repo.repository_url}:latest"
}
