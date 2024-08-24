const express = require('express');
const imageController = express.Router();

// 이미지 URL을 받는 라우터
imageController.post('/', (req, res) => {
    const { imageUrl } = req.body;

    if (!imageUrl) {
        return res.status(400).json({ error: '이미지 URL이 필요합니다.' });
    }

    res.status(201).json({ message: '이미지가 성공적으로 등록되었습니다.', imageUrl });
});

module.exports = imageController;
