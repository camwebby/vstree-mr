
resource "aws_ecr_repository" "vst_p_ecr_repo" {
  name = "${var.app_name}-repo-${var.env}"
  tags = {
    Environment = var.env
    Project     = var.project_name
  }

  force_delete = true
}

resource "aws_ecr_lifecycle_policy" "vst_p_ecr_repo_policy" {
  repository = aws_ecr_repository.vst_p_ecr_repo.name
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
