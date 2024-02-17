terraform {
  backend "s3" {
    bucket = "vst-messaging-terraform-state"
    key    = "vst-messaging"
    region = "eu-west-1"
  }
}

module "vst-messaging" {
  source   = "./module"
  env      = var.env
  app_name = "vst-messaging"
}
