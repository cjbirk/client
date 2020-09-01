我是光年实验室高级招聘经理。
我在github上访问了你的开源项目，你的代码超赞。你最近有没有在看工作机会，我们在招软件开发工程师，拉钩和BOSS等招聘网站也发布了相关岗位，有公司和职位的详细信息。
我们公司在杭州，业务主要做流量增长，是很多大型互联网公司的流量顾问。公司弹性工作制，福利齐全，发展潜力大，良好的办公环境和学习氛围。
公司官网是http://www.gnlab.com,公司地址是杭州市西湖区古墩路紫金广场B座，若你感兴趣，欢迎与我联系，
电话是0571-88839161，手机号：18668131388，微信号：echo 'bGhsaGxoMTEyNAo='|base64 -D ,静待佳音。如有打扰，还请见谅，祝生活愉快工作顺利。

## Keybase [![Build Status](https://travis-ci.org/keybase/client.svg?branch=master)](https://travis-ci.org/keybase/client) [![Build status](https://ci.appveyor.com/api/projects/status/90mxorxtj6vixnum/branch/master?svg=true)](https://ci.appveyor.com/project/keybase/client-x5qrt/branch/master)

Hi, and welcome to the Keybase client repo.  All our client apps (macOS,
Windows, Linux, iOS, and Android) are being actively developed in this
repository. Please, dig around.

### Warnings

We'd love you to read our source code.

But - some of the things in this repo are explorations, and the app you build
from source just *might not do what it says it's doing*. So, if you just want
to install Keybase on your computer, you should **[monitor our releases](https://keybase.io/download)** for macOS, Linux, or Windows.

![Sharing](https://keybase.io/images/github/repo_share.png?)


### Code Layout

* **go**: Core crypto libraries; the Keybase service; the command line client. [Learn More](go/README.md)
* **shared/react-native**: Android and iOS apps developed with [React Native](https://facebook.github.io/react-native/).
* **shared/desktop**: Desktop application for macOS, Linux, and Windows, made with the [Electron](https://github.com/atom/electron) framework, sharing React code with react-native.
* **packaging**: Scripts for releasing packages across the various platforms.
* **protocol**: Defines the protocol for communication for clients to the Keybase services. Uses [Avro](http://avro.apache.org/docs/1.7.7/). [Learn More](protocol/README.md)
* **media**: Icons, graphics, media for Keybase apps.
* **osx**: The macOS Keybase.app, development parallel to an Electron-based application above. [Learn More](osx/README.md)

### Problems?

Report any issues with client software on this GitHub
[issue tracker](https://github.com/keybase/client/issues).
Internally, we track our progress using Jira, but all PRs come through GitHub
for your review!

If you're having problems with the command line `keybase` client, take a
look at [the troubleshooting doc](go/doc/troubleshooting.md).

If you're having problems with our Website, try the
[keybase-issues](https://github.com/keybase/keybase-issues) issue tracker.

We check and update both frequently.

### License

Most code is released under the New BSD (3 Clause) License.  If subdirectories
include a different license, that license applies instead.

### Development Guidelines

We check all git commits with pre-commit hooks generated via
[pre-commit.com](http://pre-commit.com) pre-commit hooks.
To enable use of these pre-commit hooks:

* [Install](http://pre-commit.com/#install) the `pre-commit` utility. For some common cases:
  * `pip install pre-commit`
  * `brew install pre-commit`
* Remove any existing pre-commit hooks via `rm .git/hooks/pre-commit`
* Configure via `pre-commit install`

Then proceed as normal.

#### External Contributors

If you forked this repository on GitHub and made a PR, then it'll show up as
having failed Jenkins CI. We do not build external PRs because it's a security
risk to do so without a review first. If your PR is successfully reviewed by a
member of the Keybase team, then we will merge your commits to a branch on our
primary fork and build from there.


### Cryptography Notice

This distribution includes cryptographic software. The country in which you
currently reside may have restrictions on the import, possession, use, and/or
re-export to another country, of encryption software. BEFORE using any
encryption software, please check your country's laws, regulations and policies
concerning the import, possession, or use, and re-export of encryption
software, to see if this is permitted. See http://www.wassenaar.org/ for more
information.

The U.S. Government Department of Commerce, Bureau of Industry and Security
(BIS), has classified this software as Export Commodity Control Number (ECCN)
5D002.C.1, which includes information security software using or performing
cryptographic functions with asymmetric algorithms. The form and manner of this
distribution makes it eligible for export under the License Exception ENC
Technology Software Unrestricted (TSU) exception (see the BIS Export
Administration Regulations, Section 740.13) for both object code and source
code.
