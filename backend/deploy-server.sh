#!/bin/bash

# VPS服务器部署脚本
# 使用方法: ./deploy-server.sh [docker-image-name] [vercel-domain]

set -e

# 参数配置
DOCKER_IMAGE=${1:-"your-dockerhub-username/blog-backend:latest"}
VERCEL_DOMAIN=${2:-"https://your-project.vercel.app"}
CONTAINER_NAME="blog-backend-container"

echo "🚀 部署博客后端到VPS服务器"
echo "Docker镜像: ${DOCKER_IMAGE}"
echo "Vercel域名: ${VERCEL_DOMAIN}"

# 停止并删除现有容器（如果存在）
if docker ps -a --format 'table {{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo "🛑 停止现有容器: ${CONTAINER_NAME}"
    docker stop "${CONTAINER_NAME}" || true
    docker rm "${CONTAINER_NAME}" || true
fi

# 拉取最新镜像
echo "📥 拉取Docker镜像..."
docker pull "${DOCKER_IMAGE}"

# 创建数据目录
DATA_DIR="/home/$(whoami)/blog-data"
echo "📁 创建数据目录: ${DATA_DIR}"
mkdir -p "${DATA_DIR}"

# 运行新容器
echo "🐳 启动新容器..."
docker run -d \
  --name "${CONTAINER_NAME}" \
  -p 8080:8080 \
  -e ALLOWED_ORIGINS="${VERCEL_DOMAIN}" \
  -e GIN_MODE=release \
  -e JWT_SECRET="$(openssl rand -base64 32)" \
  -e DB_TYPE=sqlite \
  -e DB_PATH=/app/data/blog_system.db \
  -v "${DATA_DIR}:/app/data" \
  --restart unless-stopped \
  "${DOCKER_IMAGE}"

# 等待容器启动
echo "⏳ 等待容器启动..."
sleep 5

# 检查容器状态
if docker ps --format 'table {{.Names}}\t{{.Status}}' | grep -q "^${CONTAINER_NAME}"; then
    echo "✅ 容器启动成功!"
    
    # 显示容器信息
    echo "📊 容器状态:"
    docker ps --filter "name=${CONTAINER_NAME}" --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'
    
    # 显示最近的日志
    echo ""
    echo "📝 容器日志 (最近10行):"
    docker logs --tail 10 "${CONTAINER_NAME}"
    
    echo ""
    echo "🌐 服务访问地址:"
    echo "API地址: http://$(curl -s ifconfig.me || echo 'YOUR_SERVER_IP'):8080"
    echo "健康检查: http://$(curl -s ifconfig.me || echo 'YOUR_SERVER_IP'):8080/posts"
    
    echo ""
    echo "💡 有用的命令:"
    echo "查看日志: docker logs -f ${CONTAINER_NAME}"
    echo "重启容器: docker restart ${CONTAINER_NAME}"
    echo "停止容器: docker stop ${CONTAINER_NAME}"
else
    echo "❌ 容器启动失败!"
    echo "📝 错误日志:"
    docker logs "${CONTAINER_NAME}" 2>&1 || true
    exit 1
fi