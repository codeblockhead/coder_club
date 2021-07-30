const app = require("./app/index")
const { APP_PORT } = require("./app/config")
require('./app/database')


app.listen(APP_PORT, () => {
    console.log(`服务器端口号为${APP_PORT}启动成功`);
})