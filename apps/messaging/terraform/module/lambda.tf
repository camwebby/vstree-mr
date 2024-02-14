resource "aws_lambda_function" "wtf_lambda" {
  function_name    = "${var.app_name}-${var.env}-wtf-lambda" 
  role             = aws_iam_role.this_role.arn
  package_type = "Image"
  image_uri = "${aws_ecr_repository.vst_ecr_repo.repository_url}:latest"
}