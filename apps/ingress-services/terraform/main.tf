terraform {
  backend "s3" {
    bucket = "go-api-terraform-state"
    key    = "go-api-prod"
    region = "eu-west-2"
  }
}
module "vst_price_service" {
  source           = "./module"
  project_name     = "vstpriceservice"
  app_name         = "vstpriceservice"
  desired_count    = 1
  env              = "vstpriceservice"
  docker_image_tag = var.docker_image_tag
}
