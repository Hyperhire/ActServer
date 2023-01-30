1. Mongodb
- Test Server
-- systemctl start mongod (mongodb 켜지게 하기)
-- systemctl status mongod (mongodb 켜졌는지 확인)
-- systemctl restart mongod (mongodb restart)

- Live Server
-- mongodb atlas로 해결  

2. Redis (email verification)
- Test Server
-- cd redis-stable
-- pm2 start "redis-server redis.conf"

- Live Server
-- systemctl start redis-server

3. Main server
- Test Server
-- cd ActServer
-- pm2 start "yarn start"

- Live Server
-- cd ActServer
-- yarn pm2 start "yarn start"