# Installing Soapbox FE on a subdomain

If you would like to retain Pleroma FE on your Pleroma server, but install Soapbox FE alongside it on a subdomain, you can do so by following these steps.

## 1. Download the build

Create a directory on your system for Soapbox FE.

```sh
mkdir -p /opt/soapbox
```

Fetch the build.

```sh
curl -L https://gitlab.com/soapbox-pub/soapbox-fe/-/jobs/artifacts/v1.3.0/download?job=build-production -o /tmp/soapbox-fe.zip
```

Unzip the build.

```sh
busybox unzip /tmp/soapbox-fe.zip -o -d /opt/soapbox
```

## 2. Configure Nginx

You will need to add an Nginx vhost for the subdomain.
Create a new file in `/etc/nginx/sites-available/soapbox.nginx` with the following content:

```nginx
server {
    server_name    soapbox.example.com;

    listen         80;
    listen         [::]:80;

    # Uncomment this if you need to use the 'webroot' method with certbot. Make sure
    # that the directory exists and that it is accessible by the webserver. If you followed
    # the guide, you already ran 'mkdir -p /var/lib/letsencrypt' to create the folder.
    # You may need to load this file with the ssl server block commented out, run certbot
    # to get the certificate, and then uncomment it.
    #
    location ~ /\.well-known/acme-challenge {
        root /var/lib/letsencrypt/;
    }

    location / {
      return         301 https://$server_name$request_uri;
    }
}

# Enable SSL session caching for improved performance
ssl_session_cache shared:ssl_session_cache:10m;

server {
    server_name soapbox.example.com;

    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    ssl_session_timeout 5m;

    ssl_trusted_certificate   /etc/letsencrypt/live/soapbox.example.com/chain.pem;
    ssl_certificate           /etc/letsencrypt/live/soapbox.example.com/fullchain.pem;
    ssl_certificate_key       /etc/letsencrypt/live/soapbox.example.com/privkey.pem;

    # Add TLSv1.0 to support older devices
    ssl_protocols TLSv1.2;
    # Uncomment line below if you want to support older devices (Before Android 4.4.2, IE 8, etc.)
    # ssl_ciphers "HIGH:!aNULL:!MD5 or HIGH:!aNULL:!MD5:!3DES";
    ssl_ciphers "ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA384:!aNULL:!eNULL:!EXPORT:!DES:!MD5:!PSK:!RC4";
    ssl_prefer_server_ciphers on;
    # In case of an old server with an OpenSSL version of 1.0.2 or below,
    # leave only prime256v1 or comment out the following line.
    ssl_ecdh_curve X25519:prime256v1:secp384r1:secp521r1;
    ssl_stapling on;
    ssl_stapling_verify on;

    #brotli on;
    #brotli_static on;
    #brotli_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript application/activity+json application/atom+xml;

    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_buffers 16 8k;
    gzip_http_version 1.1;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript application/activity+json application/atom+xml;

    # the nginx default is 1m, not enough for large media uploads
    client_max_body_size 40m;

    root /opt/soapbox/static/;

    location / {
        try_files $uri /index.html;
    }

    location = /index.html {
        expires 30s;
    }

    # here goes long list of what we will use from real instance
    location ~ ^/(api|.well-known|nodeinfo|proxy|media|emoji|oauth|favicon.*) {

        proxy_pass       $scheme://127.0.0.1$request_uri;
#        proxy_redirect   $scheme://example.com$request_uri $scheme://soapbox.example.com$request_uri;
        proxy_set_header Host example.com;
        proxy_set_header X-Real-IP $remote_addr;

        # doesn't work with some browsers
        # return 308 $scheme://example.com$request_uri;
    }

    access_log /var/log/nginx/access.soapbox.log;
    error_log /var/log/nginx/error.soapbox.log;
}
```

Replace `soapbox.example.com` with your desired subdomain and save the file.
You should also adjust `client_max_body_size` to your instance file size limit.
Replace `example.com` to your original domain.

Additionally, activate the vhost file:

```sh
sudo ln -s /etc/nginx/sites-available/soapbox.nginx /etc/nginx/sites-enabled/soapbox.nginx
```

## 3. Configure HTTPS support

TODO

## 4. Reload Nginx

Finally, test that your new configuration is valid:

```sh
nginx -t
```

If that passed, reload Nginx:

```sh
systemctl reload nginx
```

If all is well, you should be able to visit the subdomain in your browser and access Soapbox FE!

---

Thank you to [@a1batross@expired.mentality.rip](https://expired.mentality.rip/users/a1batross) for originally discovering and authoring this method.
