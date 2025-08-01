#!/bin/bash

# Docker镜像构建脚本
# 使用方法: ./build-docker.sh [your-dockerhub-username]

set -e

# 获取Docker Hub用户名
DOCKER_USERNAME=${1:-"your-dockerhub-username"}
IMAGE_NAME="blog-backend"
TAG="latest"
FULL_IMAGE_NAME="${DOCKER_USERNAME}/${IMAGE_NAME}:${TAG}"

echo "🐳 构建Docker镜像: ${FULL_IMAGE_NAME}"

# 检查Docker是否运行
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker daemon未运行，请先启动Docker"
    exit 1
fi

# 构建镜像
echo "📦 开始构建镜像..."
docker build -t "${FULL_IMAGE_NAME}" .

if [ $? -eq 0 ]; then
    echo "✅ 镜像构建成功: ${FULL_IMAGE_NAME}"
    
    # 显示镜像信息
    echo "📊 镜像信息:"
    docker images "${FULL_IMAGE_NAME}"
    
    echo ""
    echo "🚀 下一步操作:"
    echo "1. 推送到Docker Hub:"
    echo "   docker push ${FULL_IMAGE_NAME}"
    echo ""
    echo "2. 本地测试运行:"
    echo "   docker run -d -p 8080:8080 --name blog-backend-test ${FULL_IMAGE_NAME}"
    echo ""
    echo "3. 查看容器日志:"
    echo "   docker logs blog-backend-test"
else
    echo "❌ 镜像构建失败"
    exit 1
fi