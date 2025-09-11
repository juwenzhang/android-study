# GIT 工具

## 介绍
* git 是一个版本控制工具
* 主要是用来进行代码的版本控制的

## 安装
* macbook: `brew install git`
* windows: `choco install git`
* linux: `apt install git`
* 验证安装: `git --version`

## SSH 配置
* 生成 SSH 密钥: `ssh-keygen -t rsa -P "" -f ~/.ssh/id_rsa`
* 查看 SSH 公钥: `cat ~/.ssh/id_rsa.pub`
* 复制 SSH 公钥到 Git 仓库
    * 登录 Git 仓库
    * 点击头像 -> Settings -> SSH and GPG keys
    * 点击 New SSH key
    * 粘贴 SSH 公钥
    * 点击 Add SSH key
* 验证 SSH 配置
    * 登录 Git 仓库
    * 点击头像 -> Settings -> SSH and GPG keys
    * 查看是否添加成功

## company|personal
* 对于很多的开发者而言可能有很多的疑惑就是：
    * 如何在上班摸鱼的时候进行维护属于自己的开源代码呐？？🤔🤔
    * 此时最好的方法就是一个：
        * git 全局配置和本地配置
* git 全局信息配置
    * `git config --global user.name "your-company-username"`
    * `git config --global user.email "your-company-email@example.com"`
    * 直接在全局配置中添加自己的 company 账号信息即可
* git 本地维护项目配置
    * `git config --local user.name "your-personal-username"`
    * `git config --local user.email "your-personal-email@example.com"`
    * 直接在本地项目配置中添加自己的 personal 账号信息即可
* 验证配置
    * `git config --list`
    * 查看全局配置和本地配置是否添加成功

## 协同开发命令
* 克隆项目到本地：`git clone git@github.com:company/repo.git`
* 创建新分支：`git checkout -b feature/branch-name`
* 提交代码：`git add . && git commit -m "Add new feature"`
* 推送分支：`git push origin feature/branch-name`
> * 注意事项
> `1. git status` 查看当前分支的状态

> `2. git stash` 暂存当前分支的修改: 此时就可以进行后续的比如： git pull|checkout 的命令了

> `3. git stash pop` 恢复暂存的修改

> `4. git branch -a` 查看所有分支

> `5. git branch -r` 查看远程分支

> `6. git branch -d branch-name` 删除本地分支

> `7. git branch -D branch-name` 删除本地分支（强制）

> `8. git push origin --delete branch-name` 删除远程分支

> `9. git pull` 拉取最新代码

> `10. git merge branch-name` 合并分支

> `11. git rebase branch-name` 衍合分支

> `12. git log` 查看提交日志

> `13. git diff` 查看差异

> `14. git reset --hard HEAD~1` 回退到上一个版本

> `15. git reset --hard commit-id` 回退到指定版本

> `16. git tag` 查看标签

> `17. git commit --amend`  在本次的提交信息基础上进行提交新的代码

> `18. git commit --amend -m "new commit message"`  修改本次的提交信息
