# 前端 Dockerfile - 多阶段构建
FROM node:18-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json (如果存在)
COPY package*.json ./

# 复制环境文件
COPY .env .env

# 设置 npm 镜像为淘宝源
RUN npm config set registry https://registry.npmmirror.com && npm install

# 复制源代码
COPY . .

# 设置生产环境变量
ENV NODE_ENV=production
ENV VITE_BUILD_MODE=production

# 构建应用
RUN npm run build

# 生产阶段 - 使用 nginx 提供静态文件
FROM nginx:alpine

# 复制构建的文件到 nginx 目录
COPY --from=builder /app/dist /usr/share/nginx/html

# 使用默认的 nginx 配置，通过 docker-compose 挂载统一配置

# 暴露端口
EXPOSE 80

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]
