# README

### 初めにやること
作業ディレクトリにgit clone
```
$ mkdir {appName}
$ cd {appName}
$ git clone https://github.com/misaka3/flight_checker.git
```
imageのビルド、コンテナ作成
```
$ docker-compose up -d
```

### backend側対応
DB作成
```
$ docker compose exec api rails db:create
```

railsアプリへアクセス
```
http://localhost:3001/
```

### frontend側対応
Next.jsアプリへアクセス
```
http://localhost:3000/
```
