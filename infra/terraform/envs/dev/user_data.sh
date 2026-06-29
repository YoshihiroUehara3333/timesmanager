#!/bin/bash
dnf update -y

#Java Corettoインストール

#nginxインストール
dnf install -y nginx

systemctl enable nginx
systemctl start nginx


# WSL Ubuntu
wsl -l -v

# Ansibleインストール
pipx install --include-deps ansible
ansible --version