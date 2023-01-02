1. Mongodb
- systemctl start mongod (mongodb 켜지게 하기)
- systemctl status mongod (mongodb 켜졌는지 확인)
- systemctl restart mongod (mongodb restart)

2. Redis (email verification)
- cd redis-stabble
- pm2 start "redis-server redis.conf"

3. Main server
- cd ActServer
- pm2 start "yarn start"