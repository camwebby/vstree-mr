terraform {
  backend "s3" {
    bucket = "vstpriceservice-terraform-state"
    key    = "vstpriceservice-prod"
    region = "eu-west-2"
  }
}
module "vst_price_service" {
  source           = "./module"
  project_name     = "vstpriceservice"
  app_name         = "vstpriceservice"
  desired_count    = 1
  env              = "prod"
  docker_image_tag = var.docker_image_tag
}
