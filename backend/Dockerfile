# --- Stage 1: The Builder ---
# 使用官方的 Go 镜像作为构建环境
FROM golang:1.24-alpine AS builder

# 安装必要的构建工具
RUN apk add --no-cache git ca-certificates tzdata

# 设置工作目录
WORKDIR /app

# 拷贝依赖管理文件
COPY go.mod go.sum ./

# 下载依赖
RUN go mod download

# 拷贝所有源代码
COPY . .

# 编译应用。CGO_ENABLED=0 和 GOOS=linux 确保生成一个静态链接的、适用于 Linux 的可执行文件
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

# --- Stage 2: The Runner ---
# 使用一个极度轻量级的 Alpine Linux 作为运行环境
FROM alpine:latest

# 安装ca-certificates以支持HTTPS请求，安装tzdata以支持时区，安装wget用于健康检查
RUN apk --no-cache add ca-certificates tzdata wget

# 创建非root用户
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup

# 设置工作目录
WORKDIR /app

# 创建数据目录
RUN mkdir -p /app/data && chown appuser:appgroup /app/data

# 从 builder 阶段拷贝编译好的二进制文件
COPY --from=builder /app/main .

# 修改文件权限
RUN chown appuser:appgroup /app/main && chmod +x /app/main

# 切换到非root用户
USER appuser

# 声明容器将监听 8080 端口
EXPOSE 8080

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/posts || exit 1

# 定义容器启动时执行的命令
CMD ["./main"]