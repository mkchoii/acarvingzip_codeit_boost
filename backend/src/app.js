const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const groupController = require('./controllers/groupController'); 
const postController = require('./controllers/postController'); 
const imageController = require('./controllers/imageController'); 

const app = express();
const port = 3000;

// 미들웨어 설정
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API 라우터 설정
app.use('/api/groups', groupController);
app.use('/api/image', imageController);
app.use('/api/groups', postController);
app.use('/api/posts', postController); 

app.get('/', (req, res) => {
    res.send('그룹 관리 서버가 실행 중입니다.');
});

app.listen(port, () => {
    console.log(`서버가 http://localhost:${port}에서 실행 중입니다.`);
});
