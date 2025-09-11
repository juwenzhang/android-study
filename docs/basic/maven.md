# Maven 指南

## Maven 下载和安装
* 首先进行安装 `maven` 前，前确保自己的电脑已经安装了 java 环境。
    * 安装 java 环境的话可以直接去该链接即可： https://www.azul.com/core-post-download/?endpoint=zulu&uuid=def9fcf9-82c4-4485-bfa8-7399e63ba4ea
    * 验证是否安装好： `java -version`，如果安装成功的话，会显示 `java` 的版本信息
* 安装 maven 的话：
    * 首先本教程只提供 `macos` 的安装方式吧：
        * 直接使用 `brew` 安装即可： `brew install maven`，后续直接等待安装就可以了吧
        * 验证是否安装好： `mvn -version`，如果安装成功的话，会显示 `maven` 的版本信息

## mvn 项目构建和声明周期
* 项目构建和声明周期：
    * 项目构建： 项目构建是指将项目的源代码转换为可执行的二进制文件的过程。
    * 声明周期： 声明周期是指项目构建的过程中，各个阶段的执行顺序。
* `mvn clean` 清理项目
* `mvn compile` 编译项目
* `mvn test` 测试项目
* `mvn package` 打包项目
* `mvn install` 安装项目
* `mvn deploy` 部署项目

## mvn 项目依赖管理
* `mvn dependency:tree` 查看项目依赖树
* `mvn dependency:resolve` 解析项目依赖
* `mvn dependency:resolve-plugins` 解析项目插件依赖
* `mvn dependency:list` 查看项目依赖列表
* `mvn dependency:purge-local-repository` 清理本地仓库

## 使用 mvn 从零构建项目脚手架

### 前置条件
* java 环境 -- `java --version`
* maven 环境 -- `mvn -version`

### 创建项目骨架
* `mvn archetype:generate` 创建项目骨架，类似于前端的 `npm init` `pnpm init` 
    * 一般具备 java普通项目以及 java web 项目的骨架
    * 可以通过 `mvn archetype:generate -Dlist` 查看所有的项目骨架
* 类似于 `package.json` 类似的一些提示
    * `groupId` 项目的唯一标识符，类似于 `package.json` 中的 `name`
    * `artifactId` 项目的名称，类似于 `package.json` 中的 `name`
    * `version` 项目的版本号，类似于 `package.json` 中的 `version`
    * `package` 项目的包名，类似于 `package.json` 中的 `name`

* `Choose a number or apply filter (format: [groupId:]artifactId, case sensitive contains): `

```
groupId: com.juwenzhang
artifactId: my-first-maven-project
version: 1.0.0
package: com.juwenzhang.demo
```

### 基本的结构
```
my-first-maven-project/
├── pom.xml               # 核心配置文件（类似 package.json）
└── src/
    ├── main/
    │   └── java/         # 主代码目录
    │       └── com/
    │           └── example/
    │               └── demo/
    │                   └── App.java  # 主类
    └── test/
        └── java/         # 测试代码目录
            └── com/
                └── example/
                    └── demo/
                        └── AppTest.java  # 测试类
```
* `pom.xml` 项目的配置文件，类似于 `package.json` 中的 `dependencies` 以及 `devDependencies`

### 启动 maven 项目流程
* `mvn clean package` 进行项目的打包
* `java -cp ./target/my-first-maven-project-1.0.0.jar com.juwenzhang.demo.App` 启动项目
    * `java -cp` 表示启动 java 项目
    * `./target/my-first-maven-project-1.0.0.jar` 表示项目的 jar 包
    * `com.juwenzhang.demo.App` 表示项目的主类

> mvn archetype:generate

> maven-archetype-webapp 就是一个 java web 项目的骨架

> maven-archetype-quickstart  就是一个 java 普通项目的骨架

## pom.xml 配置
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>

  <!-- 指定的是java项目的 groupID -->
  <groupId>com.juwenzhang</groupId>
  <!-- 指定的是 java 项目的 artifactid -->
  <artifactId>MyFirstMavenProject</artifactId>
  <!-- 指定的是 java 项目的版本号 -->
  <version>1.0.0</version>
  <!-- 指定的是 java 项目的名称 -->
  <name>MyFirstMavenProject</name>
  <!-- FIXME change it to the project's website -->
  <!-- 指定的是 java 项目的网站 -->
  <url>http://www.example.com</url>

  <properties>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <maven.compiler.release>17</maven.compiler.release>
  </properties>

  <dependencyManagement>
    <dependencies>
      <dependency>
        <groupId>org.junit</groupId>
        <artifactId>junit-bom</artifactId>
        <version>5.11.0</version>
        <type>pom</type>
        <scope>import</scope>
      </dependency>
    </dependencies>
  </dependencyManagement>

  <dependencies>
    <dependency>
      <groupId>org.junit.jupiter</groupId>
      <artifactId>junit-jupiter-api</artifactId>
      <scope>test</scope>
    </dependency>
    <!-- Optionally: parameterized tests support -->
    <dependency>
      <groupId>org.junit.jupiter</groupId>
      <artifactId>junit-jupiter-params</artifactId>
      <scope>test</scope>
    </dependency>
  </dependencies>

  <build>
    <pluginManagement><!-- lock down plugins versions to avoid using Maven defaults (may be moved to parent pom) -->
      <plugins>
        <!-- clean lifecycle, see https://maven.apache.org/ref/current/maven-core/lifecycles.html#clean_Lifecycle -->
        <plugin>
          <artifactId>maven-clean-plugin</artifactId>
          <version>3.4.0</version>
        </plugin>
        <!-- default lifecycle, jar packaging: see https://maven.apache.org/ref/current/maven-core/default-bindings.html#Plugin_bindings_for_jar_packaging -->
        <plugin>
          <artifactId>maven-resources-plugin</artifactId>
          <version>3.3.1</version>
        </plugin>
        <plugin>
          <artifactId>maven-compiler-plugin</artifactId>
          <version>3.13.0</version>
        </plugin>
        <plugin>
          <artifactId>maven-surefire-plugin</artifactId>
          <version>3.3.0</version>
        </plugin>
        <plugin>
          <artifactId>maven-jar-plugin</artifactId>
          <version>3.4.2</version>
        </plugin>
        <plugin>
          <artifactId>maven-install-plugin</artifactId>
          <version>3.1.2</version>
        </plugin>
        <plugin>
          <artifactId>maven-deploy-plugin</artifactId>
          <version>3.1.2</version>
        </plugin>
        <!-- site lifecycle, see https://maven.apache.org/ref/current/maven-core/lifecycles.html#site_Lifecycle -->
        <plugin>
          <artifactId>maven-site-plugin</artifactId>
          <version>3.12.1</version>
        </plugin>
        <plugin>
          <artifactId>maven-project-info-reports-plugin</artifactId>
          <version>3.6.1</version>
        </plugin>
      </plugins>
    </pluginManagement>
  </build>
</project>
```