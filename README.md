# R-Shief Web app

Welcome!

Please put a dbConf.js like this:

```
module.exports = {
  mysqlstore: {
    host: "db.public.ip.address",
    port: '33060',
    user: "dbuser",
    password: "dbpassword",
    database: "defaultdatabase"
  },
  mysqlx: [
    {
      host: "db.public.ip.address",
      port: '33060',
      user: "dbuser",
      password: "dbpassword",
      schema: "defaultdatabase"
    },
    {
      pooling: {
        enabled: true,
        maxSize: 10
      }
    }
  ]
}
```

and a sessionConf.js like this:

```
module.exports = {
  secret: 'some secret',
  resave: false,
  saveUninitialized: true,
  cookie: {},
  name: 'nameofcookie.sid'
}
```

in the ```config/```, and please download ```usernames.json``` into ```bigData/```.
