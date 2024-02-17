
resource "aws_ecr_repository" "wtf_vst_ecr_repo" {
  name = "${var.app_name}-repo-${var.env}-wtf"
  tags = {
    Environment = var.env
    Project     = var.app_name
  }
  image_tag_mutability = "MUTABLE"
  force_delete         = true

  // Setup dummy container
  provisioner "local-exec" {
    command = <<-EOT
        docker pull alpine
        docker tag alpine dummy_container
        docker push dummy_container
        EOT
  }
}

resource "aws_ecr_lifecycle_policy" "wtf_lambda_ecr_repo_policy" {
  repository = aws_ecr_repository.wtf_vst_ecr_repo.name
  policy     = <<EOF
{
    "rules": [
        {
            "rulePriority": 1,
            "description": "Keep last 5 images",
            "selection": {
                "tagStatus": "tagged",
                "tagPrefixList": ["${var.app_name}"],
                "countType": "imageCountMoreThan",
                "countNumber": 5
            },
            "action": {
                "type": "expire"
            }
        }
    ]
}
EOF
}
