# 前端构建配置说明

## 概述
VSS 前端项目已配置为在 Docker 容器中进行构建，避免在本地维护 `node_modules` 文件夹。

## 配置文件

### 1. .gitignore (根目录)
```
VSS-frontend/node_modules/
VSS-frontend/dist/
VSS-frontend/.vite/
```
- 忽略 `node_modules` 文件夹，避免提交大量依赖文件
- 忽略构建产物 `dist` 和 Vite 缓存文件

### 2. .dockerignore (VSS-frontend/)
```
node_modules/
dist/
build/
*.log
.env.local
.env.development.local
.env.test.local
.env.production.local
```
- 防止本地的 `node_modules` 和构建产物被复制到 Docker 镜像中
- 保留 `.env.proxy` 文件用于 Docker 构建

### 3. Dockerfile (多阶段构建)
```dockerfile
# 构建阶段
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY .env .env
RUN npm config set registry https://registry.npmmirror.com && npm install
COPY . .
RUN npm run build

# 生产阶段
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY ../nginx/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 构建流程

### 开发环境
1. 本地开发时，可以运行 `npm install` 安装依赖
2. 使用 `npm run dev` 启动开发服务器
3. `node_modules` 文件夹会被 Git 忽略

### 生产环境 (Docker)
1. Docker 构建时会自动安装依赖：
   ```bash
   docker-compose build frontend
   ```
2. 构建过程中会：
   - 安装 npm 依赖
   - 执行 `npm run build` 构建项目
   - 将构建产物复制到 nginx 容器中

### 重新构建
如果需要重新构建前端：
```bash
# 重新构建镜像
docker-compose build frontend

# 重启容器
docker-compose restart frontend
```

## 优势
1. **减少仓库大小**：不提交 `node_modules` 文件夹
2. **环境一致性**：所有环境都使用相同的 Docker 构建过程
3. **自动化**：构建过程完全自动化，无需手动管理依赖
4. **缓存优化**：Docker 层缓存可以加速重复构建

## 注意事项
1. 确保 `package.json` 和 `package-lock.json` 文件被提交到 Git
2. 环境变量文件 `.env.proxy` 需要存在于项目根目录
3. 如果修改了依赖，需要重新构建 Docker 镜像