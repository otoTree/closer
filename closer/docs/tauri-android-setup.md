# Tauri Android 开发环境配置指南

本文档记录了在 macOS 上配置 Tauri Android 开发环境的完整过程，包括遇到的问题和解决方案。

## 环境信息

- **操作系统**: macOS
- **项目**: Tauri + React + TypeScript
- **目标**: 配置 Android 开发环境

## 配置过程

### 1. Java 环境配置

#### 问题描述
初始检查发现 `/Library/Java/JavaVirtualMachines/` 目录为空，Java 未正确安装。

#### 解决方案
使用 Homebrew 安装 OpenJDK 17：

```bash
# 安装 Java 17
brew install openjdk@17

# 查看安装路径
brew --prefix openjdk@17
# 输出: /opt/homebrew/opt/openjdk@17
```

#### 环境变量配置
编辑 `~/.zshrc` 文件，添加以下内容：

```bash
# Java 环境变量
export JAVA_HOME="/opt/homebrew/opt/openjdk@17"
export PATH="$JAVA_HOME/bin:$PATH"
```

#### 验证安装
```bash
# 重新加载配置
source ~/.zshrc

# 验证 Java 安装
java -version
javac -version
```

### 2. Android SDK 配置

#### 问题描述
`sdkmanager --version` 命令失败，提示无法确定 SDK 根目录。

#### 解决方案
修复 `cmdline-tools` 目录结构：

```bash
# 进入 Android SDK 目录
cd $HOME/Library/Android/sdk/cmdline-tools

# 创建 latest 目录
mkdir latest

# 移动现有文件到 latest 目录
mv bin lib latest/
```

正确的目录结构应该是：
```
$HOME/Library/Android/sdk/cmdline-tools/
└── latest/
    ├── bin/
    ├── lib/
    └── ...
```

#### 验证修复
```bash
# 测试 sdkmanager
sdkmanager --version
```

### 3. NDK 安装

#### 问题描述
运行 `pnpm tauri android dev` 时提示 `NDK_HOME` 环境变量未设置。

#### 解决方案
安装 Android NDK：

```bash
# 查看可用的 NDK 版本
sdkmanager --list | grep ndk

# 安装 NDK（推荐最新版本）
sdkmanager "ndk;26.1.10909125"
```

#### 环境变量配置
在 `~/.zshrc` 中添加：

```bash
# NDK 环境变量
export NDK_HOME="$HOME/Library/Android/sdk/ndk/26.1.10909125"
export PATH="$NDK_HOME:$PATH"
```

### 4. Android 系统镜像安装

#### 问题描述
安装 Android 34 系统镜像时遇到 `Error on ZipFile unknown archive` 错误。

#### 解决方案
推荐使用 Android Studio 的 SDK Manager 下载系统镜像，这是最可靠的方法：

```bash
# 安装 Android Studio（如果未安装）
brew install --cask android-studio
```

或者尝试下载其他版本的系统镜像：

```bash
# 尝试 Android 33
sdkmanager "system-images;android-33;google_apis;x86_64"

# 或者 Android 32
sdkmanager "system-images;android-32;google_apis;x86_64"
```

### 5. Tauri Android 项目初始化

#### 初始化项目
```bash
# 初始化 Tauri Android 项目
pnpm tauri android init
```

#### 运行开发模式
```bash
# 启动 Android 开发模式
pnpm tauri android dev
```

## 最终环境变量配置

完整的 `~/.zshrc` 配置：

```bash
# Java 环境变量
export JAVA_HOME="/opt/homebrew/opt/openjdk@17"
export PATH="$JAVA_HOME/bin:$PATH"

# Android SDK 环境变量
export ANDROID_HOME="$HOME/Library/Android/sdk"
export PATH="$ANDROID_HOME/cmdline-tools/latest/bin:$PATH"
export PATH="$ANDROID_HOME/platform-tools:$PATH"
export PATH="$ANDROID_HOME/emulator:$PATH"

# NDK 环境变量
export NDK_HOME="$HOME/Library/Android/sdk/ndk/26.1.10909125"
export PATH="$NDK_HOME:$PATH"
```

## 验证完整配置

运行以下命令验证所有组件是否正确安装：

```bash
# 验证 Java
java -version
javac -version

# 验证 Android SDK
sdkmanager --version
adb --version

# 验证 NDK
ls $NDK_HOME

# 验证 Tauri Android
cd /path/to/your/project
pnpm tauri android dev
```

## 成功标志

当看到以下输出时，表示配置成功：

```
Finished release [optimized] target(s) in 43.28s
[INFO] Linking libcloser_lib.so
[INFO] Opening Android Studio
```

## 常见问题和解决方案

### 1. Java 版本问题
- 确保使用 Java 17 或更高版本
- 使用 Homebrew 安装的 Java 路径通常在 `/opt/homebrew/opt/openjdk@17`

### 2. Android SDK 路径问题
- 确保 `cmdline-tools` 目录结构正确
- 使用 `latest` 子目录包含实际的工具文件

### 3. NDK 版本兼容性
- 推荐使用最新的稳定版本
- 确保 `NDK_HOME` 指向正确的版本目录

### 4. 系统镜像下载问题
- 优先使用 Android Studio 的 SDK Manager
- 如果命令行下载失败，可以尝试不同的 API 级别

## 推荐的开发工作流

1. **开发阶段**：使用 `pnpm tauri android dev` 进行实时开发和调试
2. **测试阶段**：在 Android Studio 中运行和测试应用
3. **构建阶段**：使用 `pnpm tauri android build` 构建发布版本

## 总结

通过以上步骤，成功配置了完整的 Tauri Android 开发环境。关键点包括：

- 正确安装和配置 Java 17
- 修复 Android SDK 工具的目录结构
- 安装必要的 NDK 组件
- 设置正确的环境变量
- 使用可靠的方法下载系统镜像

配置完成后，可以开始在 Android 平台上开发 Tauri 应用。