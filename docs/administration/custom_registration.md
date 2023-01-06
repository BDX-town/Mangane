# Custom registration URL
In case user account registration is provided by third party service (eg. LDAP) you could redirect new potential users to a URL where they could create account.
In order to enable this feature, add following variables in the config:
 - `customRegProvider` "name of provider eg. your service name"
 - `customRegUrl` "URL to redirect users to create account"
