resource "aws_ecs_cluster" "vst_p_cluster" {
  name = "${var.app_name}-cluster-${var.env}"
}

resource "aws_ecs_task_definition" "vst_p_task" {
  family                   = "${var.app_name}-${var.env}"
  container_definitions    = <<DEFINITION
  [
    {
      "name": "${var.app_name}-${var.env}",
      "image": "${aws_ecr_repository.vst_p_ecr_repo.repository_url}:${var.docker_image_tag}",
      "essential": true,
      "environment": [],
      "portMappings": [
        {
          "containerPort": 1323,
          "hostPort": 1323
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "${aws_cloudwatch_log_group.compute_log_group.name}",
          "awslogs-region": "eu-west-2",
          "awslogs-stream-prefix": "${var.app_name}-"
        }
      },
      "memory": 512,
      "cpu": 256
    }
  ]
  DEFINITION
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  memory                   = 512
  cpu                      = 256
  execution_role_arn       = aws_iam_role.ecsTaskExecutionRole.arn
}

# resource "aws_ecs_service" "vst_p_health_check" {
#   name            = "${var.app_name}-ecs-${var.env}"
#   cluster         = aws_ecs_cluster.vst_p_cluster.id
#   task_definition = aws_ecs_task_definition.vst_p_task.arn
#   desired_count   = var.desired_count
#   launch_type     = "FARGATE"

#   network_configuration {
#     subnets          = ["${aws_default_subnet.vst_p_subnet_a.id}", "${aws_default_subnet.vst_p_subnet_b.id}", "${aws_default_subnet.vst_p_subnet_c.id}"]
#     assign_public_ip = true
#     security_groups  = ["${aws_security_group.vst_p_service_security_group.id}"]
#   }
# }


resource "aws_ecs_task" "vst_p_task" {
  cluster         = aws_ecs_cluster.vst_p_cluster.id
  task_definition = aws_ecs_task_definition.vst_p_task.arn

  network_configuration {
    subnets          = ["${aws_default_subnet.vst_p_subnet_a.id}", "${aws_default_subnet.vst_p_subnet_b.id}", "${aws_default_subnet.vst_p_subnet_c.id}"]
    assign_public_ip = true
    security_groups  = ["${aws_security_group.vst_p_service_security_group.id}"]
  }

  launch_type   = "FARGATE"
  desired_count = var.desired_count
}
