const express = require('express');
const db = require('../../models/groupModel'); // 경로 수정
const groupController = express.Router(); 

// 그룹 등록 라우터
groupController.post('/', async (req, res) => {
    const { name, image, description, isPublic, password } = req.body;

    const sql = `
        INSERT INTO groups (name, image, description, isPublic, password)
        VALUES (?, ?, ?, ?, ?)
    `;

    try {
        const result = await new Promise((resolve, reject) => {
            db.run(sql, [name, image, description, isPublic, password], function(err) {
                if (err) {
                    return reject(err); // 오류 발생 시 reject
                }
                resolve(this.lastID); // 성공 시 마지막 ID 반환
            });
        });

        res.status(201).json({ id: result, message: '그룹이 성공적으로 등록되었습니다.' });
    } catch (err) {
        console.error("그룹 등록 오류:", err.message);
        res.status(500).json({ error: '그룹 등록에 실패했습니다.' });
    }
});

// 그룹 수정 라우터
groupController.put('/:groupId', async (req, res) => {
    const { groupId } = req.params;
    const { password, name, image, description, isPublic } = req.body;

    // 비밀번호 확인을 위한 쿼리
    const checkPasswordSql = `
        SELECT password FROM groups WHERE id = ?
    `;

    try {
        const existingPassword = await new Promise((resolve, reject) => {
            db.get(checkPasswordSql, [groupId], (err, row) => {
                if (err) {
                    return reject(err);
                }
                resolve(row ? row.password : null); // 비밀번호 반환
            });
        });

        if (!existingPassword || existingPassword !== password) {
            return res.status(403).json({ error: '비밀번호가 올바르지 않습니다.' });
        }

        const updateSql = `
            UPDATE groups
            SET name = ?, image = ?, description = ?, isPublic = ?
            WHERE id = ?
        `;

        const result = await new Promise((resolve, reject) => {
            db.run(updateSql, [name, image, description, isPublic, groupId], function(err) {
                if (err) {
                    return reject(err);
                }
                resolve(this.changes); // 수정된 행 수 반환
            });
        });

        if (result === 0) {
            return res.status(404).json({ error: '그룹을 찾을 수 없습니다.' });
        }

        res.json({ message: '그룹이 성공적으로 수정되었습니다.' });
    } catch (err) {
        console.error("그룹 수정 오류:", err.message);
        res.status(500).json({ error: '그룹 수정에 실패했습니다.' });
    }
});

// 그룹 삭제 라우터
groupController.delete('/:groupId', async (req, res) => {
    const { groupId } = req.params;
    const { password } = req.body; // 비밀번호를 요청 본문에서 받음

    // 비밀번호 확인을 위한 쿼리
    const checkPasswordSql = `
        SELECT password FROM groups WHERE id = ?
    `;

    try {
        const existingPassword = await new Promise((resolve, reject) => {
            db.get(checkPasswordSql, [groupId], (err, row) => {
                if (err) {
                    return reject(err);
                }
                resolve(row ? row.password : null); // 비밀번호 반환
            });
        });

        if (!existingPassword || existingPassword !== password) {
            return res.status(403).json({ error: '비밀번호가 올바르지 않습니다.' });
        }

        const deleteSql = `
            DELETE FROM groups
            WHERE id = ?
        `;

        const result = await new Promise((resolve, reject) => {
            db.run(deleteSql, [groupId], function(err) {
                if (err) {
                    return reject(err);
                }
                resolve(this.changes); // 삭제된 행 수 반환
            });
        });

        if (result === 0) {
            return res.status(404).json({ error: '그룹을 찾을 수 없습니다.' });
        }

        res.json({ message: '그룹이 성공적으로 삭제되었습니다.' });
    } catch (err) {
        console.error("그룹 삭제 오류:", err.message);
        res.status(500).json({ error: '그룹 삭제에 실패했습니다.' });
    }
});

module.exports = groupController; 
