const express = require('express');
const db = require('../../models/postModel');
const postController = express.Router();

// 게시글 등록
postController.post('/:groupId/posts', async (req, res) => {
    const { groupId } = req.params;
    const { nickname, title, content, postPassword, groupPassword, imageUrl, tags, location, moment, isPublic } = req.body;

    const sql = `
        INSERT INTO posts (groupId, nickname, title, content, postPassword, imageUrl, tags, location, moment, isPublic)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    try {
        const result = await new Promise((resolve, reject) => {
            db.run(sql, [groupId, nickname, title, content, postPassword, imageUrl, tags.join(','), location, moment, isPublic], function(err) {
                if (err) {
                    return reject(err); // 오류 발생 시 reject
                }
                resolve(this.lastID); // 성공 시 마지막 ID 반환
            });
        });

        // 생성된 게시글 정보를 가져옴
        const newPost = await new Promise((resolve, reject) => {
            db.get('SELECT * FROM posts WHERE id = ?', [result], (err, row) => {
                if (err) {
                    return reject(err);
                }
                resolve(row);
            });
        });

        res.status(201).json(newPost);
    } catch (err) {
        console.error("게시물 등록 오류:", err.message);
        res.status(400).json({ message: '잘못된 요청입니다' });
    }
});

// 게시글 수정
postController.put('/posts/:postId', async (req, res) => {
    const { postId } = req.params;
    const { nickname, title, content, postPassword, imageUrl, tags, location, moment, isPublic } = req.body;

    // 요청 본문이 유효한지 검사
    if (!nickname || !title || !content || !postPassword) {
      return res.status(400).json({ message: "잘못된 요청입니다" });
    } 

    // 게시글 비밀번호 확인
    const checkPasswordSql = `
        SELECT postPassword FROM posts WHERE id = ?
    `;

    try {
        // 기존 게시글의 비밀번호를 조회
        const existingPassword = await new Promise((resolve, reject) => {
            db.get(checkPasswordSql, [postId], (err, row) => {
                if (err) {
                    return reject(err);
                }
                resolve(row ? row.postPassword : null);
            });
        });

        // 게시글이 존재하지 않는 경우
        if (existingPassword === null) {
          return res.status(404).json({ message: "존재하지 않습니다" });
        }

        // 비밀번호가 일치하지 않는 경우
        if (existingPassword !== postPassword) {
          return res.status(403).json({ message: "비밀번호가 틀렸습니다" });
        }

        // 게시글 업데이트 쿼리
        const updateSql = `
            UPDATE posts
            SET nickname = ?, title = ?, content = ?, imageUrl = ?, tags = ?, location = ?, moment = ?, isPublic = ?
            WHERE id = ?
        `;

        const result = await new Promise((resolve, reject) => {
            db.run(updateSql, [nickname, title, content, imageUrl, tags.join(','), location, moment, isPublic, postId], function(err) {
                if (err) {
                    return reject(err);
                }
                resolve(this.changes);
            });
        });

        // 업데이트된 행이 없는 경우
        if (result === 0) {
            return res.status(404).json({ message: '존재하지 않습니다.' });
        }

        // 수정된 게시글을 응답으로 반환
        const updatedPostSql = `
            SELECT * FROM posts WHERE id = ?
        `;
        const updatedPost = await new Promise((resolve, reject) => {
            db.get(updatedPostSql, [postId], (err, row) => {
                if (err) {
                    return reject(err);
                }
                resolve(row);
            });
        });

        res.json(updatedPost);
    } catch (err) {
        console.error("게시글 수정 오류:", err.message);
        res.status(500).json({ message: '게시글 수정에 실패했습니다.' });
    }
});

// 게시글 삭제
postController.delete('/posts/:postId', async (req, res) => {
    const { postId } = req.params;
    const { postPassword } = req.body;

    // 요청 본문이 유효한지 검사
    if (!postPassword) {
        return res.status(400).json({ message: "잘못된 요청입니다" });
    }

    // 기존 게시글 비밀번호 확인
    const checkPasswordSql = `
        SELECT postPassword FROM posts WHERE id = ?
    `;

    try {
        // 기존 게시글 비밀번호 조회
        const existingPassword = await new Promise((resolve, reject) => {
            db.get(checkPasswordSql, [postId], (err, row) => {
                if (err) {
                    return reject(err);
                }
                resolve(row ? row.postPassword : null);
            });
        });

        // 게시글이 존재하지 않는 경우
        if (existingPassword === null) {
            return res.status(404).json({ message: "존재하지 않습니다" });
        }

        // 비밀번호가 일치하지 않는 경우
        if (existingPassword !== postPassword) {
            return res.status(403).json({ message: "비밀번호가 틀렸습니다" });
        }

        // 게시글 삭제 쿼리
        const deleteSql = `
            DELETE FROM posts WHERE id = ?
        `;

        const result = await new Promise((resolve, reject) => {
            db.run(deleteSql, [postId], function(err) {
                if (err) {
                    return reject(err);
                }
                resolve(this.changes); // 삭제된 행 수 반환
            });
        });

        // 삭제된 행이 없는 경우
        if (result === 0) {
            return res.status(404).json({ message: "존재하지 않습니다" });
        }

        res.status(200).json({ message: "게시글 삭제 성공" });
    } catch (err) {
        console.error("게시글 삭제 오류:", err.message);
        res.status(500).json({ message: '게시글 삭제에 실패했습니다.' });
    }
});

module.exports = postController;
