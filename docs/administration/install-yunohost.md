# Installing Soapbox FE via YunoHost

If you want to install Soapbox FE to a Pleroma instance installed using [YunoHost](https://yunohost.org), you can do so by following these steps.

## 1. Download the build

First, download the latest build of Soapbox FE from GitLab.

```sh
curl -L https://gitlab.com/soapbox-pub/soapbox-fe/-/jobs/artifacts/v1.3.0/download?job=build-production -o soapbox-fe.zip
```

## 2. Unzip the build

Then, unzip the build to the Pleroma directory under YunoHost's directory:

```sh
busybox unzip soapbox-fe.zip -o -d /home/yunohost.app/pleroma/
```

**That's it! 🎉 Soapbox FE is installed.** The change will take effect immediately, just refresh your browser tab. It's not necessary to restart the Pleroma service.

---

Thank you to [@jeroen@social.franssen.xyz](https://social.franssen.xyz/@jeroen) for discovering this method.
