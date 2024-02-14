terraform {
  backend "s3" {
    bucket = "vst-messaging-terraform-state"
    key    = "vst-messaging"
    region = "eu-west-2"
  }
}

module "vst-messaging" { 
    source = "./module"
    env = "staging"
    app_name = "vst-messaging"
}
