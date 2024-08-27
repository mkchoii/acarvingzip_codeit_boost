const express = require('express');
const db = require('../../models/groupModel'); // 경로 수정

const groupController = express.Router();

// 그룹 등록 라우터
groupController.post('/', async (req, res) => {
    const { name, imageUrl, description, isPublic, password } = req.body;

    const sql = `
        INSERT INTO groups (name, imageUrl, description, isPublic, password, createdAt)
        VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `;

    try {
        const result = await new Promise((resolve, reject) => {
            db.run(sql, [name, imageUrl, description, isPublic, password], function(err) {
                if (err) {
                    return reject(err);
                }
                resolve(this.lastID);
            });
        });

        // 그룹 생성 후 배지 획득 여부 체크
        const badgeCheckSql = `
            SELECT createdAt, badges FROM groups WHERE id = ?
        `;
        db.get(badgeCheckSql, [result], (err, row) => {
            if (err) {
                console.error("배지 조회 오류:", err.message);
            } else {
                const createdAt = new Date(row.createdAt);
                const currentDate = new Date();
                const diffTime = Math.abs(currentDate - createdAt);
                const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365)); // 연도 차이 계산

                // 배지가 0이고 1년이 지났을 때만 배지 증가
                if (row.badges === 0 && diffYears >= 1) {
                    const badgeUpdateSql = `
                        UPDATE groups 
                        SET badges = badges + 1 
                        WHERE id = ?
                    `;
                    db.run(badgeUpdateSql, [result], (err) => {
                        if (err) {
                            console.error("배지 수 업데이트 오류:", err.message);
                        }
                    });
                }
            }
        });

        res.status(201).json({ id: result, message: '그룹이 성공적으로 등록되었습니다.' });
    } catch (err) {
        console.error("그룹 등록 오류:", err.message);
        res.status(500).json({ error: '그룹 등록에 실패했습니다.' });
    }
});

// 그룹 목록 조회 라우터
groupController.get('/', async (req, res) => {
    const { name, sortBy, visibility } = req.query; // 쿼리 파라미터에서 그룹 이름, 정렬 기준, 공개 여부를 받음
    let sql = 'SELECT * FROM groups';
    const params = [];
    let whereClauseAdded = false; // WHERE 절이 추가되었는지 여부를 체크하는 변수

    // 공개 그룹 또는 비공개 그룹 필터링
    if (visibility === 'private') {
        sql += ' WHERE isPublic = 0'; // 비공개 그룹 필터링
        whereClauseAdded = true; // WHERE 절이 추가되었음을 표시
    } else {
        sql += ' WHERE isPublic = 1'; // 공개 그룹 필터링
    }

    // 그룹 이름으로 검색 기능 추가
    if (name) {
        sql += whereClauseAdded ? ' AND name LIKE ?' : ' WHERE name LIKE ?';
        params.push(`%${name}%`); // 부분 일치 검색을 위한 LIKE 조건
    }

    // 정렬 기준 설정
    const sortOrder = sortBy === 'latest' ? 'createdAt DESC'
                    : sortBy === 'postCount' ? '(SELECT COUNT(*) FROM posts WHERE groupId = groups.id) DESC'
                    : sortBy === 'badgeCount' ? 'badges DESC'
                    : 'likes DESC'; // 기본값: 공감순

    sql += ` ORDER BY ${sortOrder}`; // 정렬 기준 추가

    try {
        const rows = await new Promise((resolve, reject) => {
            db.all(sql, params, (err, rows) => {
                if (err) {
                    console.error("그룹 목록 조회 오류:", err.message);
                    return reject(err);
                }
                resolve(rows);
            });
        });

        // 게시글 수를 비동기로 가져오는 Promise 배열 생성
        const postCountPromises = rows.map(row => {
            return new Promise((resolve, reject) => {
                db.get('SELECT COUNT(*) as postCount FROM posts WHERE groupId = ?', [row.id], (err, postRow) => {
                    if (err) {
                        console.error("게시글 수 조회 오류:", err.message);
                        return resolve(0); // 오류 발생 시 0으로 설정
                    }
                    resolve(postRow.postCount);
                });
            });
        });

        // 모든 게시글 수를 비동기로 가져옴
        const postCounts = await Promise.all(postCountPromises);

        // 디데이 계산
        const currentDate = new Date();
        const responseRows = rows.map((row, index) => {
            const createdAt = new Date(row.createdAt);
            const diffTime = Math.abs(currentDate - createdAt);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (row.isPublic) {
                // 공개 그룹의 경우
                return {
                    id: row.id, 
                    name: row.name,
                    imageUrl: row.imageUrl,
                    description: row.description,
                    isPublic: row.isPublic,
                    dDay: diffDays,
                    badges: row.badges,
                    posts: postCounts[index], 
                    likes: row.likes 
                };
            } else {
                // 비공개 그룹의 경우
                return {
                    id: row.id, 
                    name: row.name,
                    isPublic: row.isPublic,
                    dDay: diffDays,
                    posts: postCounts[index], 
                    likes: row.likes 
                };
            }
        });
        res.status(200).json(responseRows);
    } catch (err) {
        console.error("그룹 목록 조회 오류:", err.message);
        res.status(500).json({ error: '그룹 목록을 조회하는 데 실패했습니다.' });
    }
});


// 그룹 공감하기 라우터
groupController.post('/:groupId/like', (req, res) => {
    const { groupId } = req.params;

    const sql = 'UPDATE groups SET likes = likes + 1 WHERE id = ?';
    db.run(sql, [groupId], async function(err) {
        if (err) {
            console.error("공감 추가 오류:", err.message);
            return res.status(500).json({ error: '공감을 추가하는 데 실패했습니다.' });
        }

        // 배지 획득 여부 확인
        const badgeCheckSql = 'SELECT badges, likes FROM groups WHERE id = ?';
        db.get(badgeCheckSql, [groupId], (err, row) => {
            if (err) {
                console.error("배지 조회 오류:", err.message);
            } else {
                // 배지가 0이고 공감 수가 10,000개 이상일 때만 배지 증가
                if (row.badges === 0 && row.likes >= 10000) {
                    const badgeUpdateSql = `
                        UPDATE groups 
                        SET badges = badges + 1 
                        WHERE id = ?
                    `;
                    db.run(badgeUpdateSql, [groupId], (err) => {
                        if (err) {
                            console.error("배지 수 업데이트 오류:", err.message);
                        }
                    });
                }
            }
        });

        res.status(200).json({ message: '공감이 추가되었습니다.' });
    });
});

// 그룹 수정 라우터
groupController.put('/:groupId', async (req, res) => {
    const { groupId } = req.params;
    const { name, imageUrl, description, isPublic, password } = req.body;

    // 비밀번호 확인
    const checkPasswordSql = 'SELECT password FROM groups WHERE id = ?';
    db.get(checkPasswordSql, [groupId], async (err, row) => {
        if (err || !row) {
            return res.status(404).json({ error: '그룹을 찾을 수 없습니다.' });
        }
        if (row.password !== password) {
            return res.status(403).json({ error: '비밀번호가 일치하지 않습니다.' });
        }

        const updateSql = `
            UPDATE groups
            SET name = ?, imageUrl = ?, description = ?, isPublic = ?
            WHERE id = ?
        `;

        try {
            await new Promise((resolve, reject) => {
                db.run(updateSql, [name, imageUrl, description, isPublic, groupId], function(err) {
                    if (err) {
                        return reject(err);
                    }
                    resolve();
                });
            });
            res.status(200).json({ message: '그룹이 성공적으로 수정되었습니다.' });
        } catch (err) {
            console.error("그룹 수정 오류:", err.message);
            res.status(500).json({ error: '그룹 수정에 실패했습니다.' });
        }
    });
});

// 그룹 삭제 라우터
groupController.delete('/:groupId', (req, res) => {
    const { groupId } = req.params;
    const { password } = req.body;

    // 비밀번호 확인
    const checkPasswordSql = 'SELECT password FROM groups WHERE id = ?';
    db.get(checkPasswordSql, [groupId], (err, row) => {
        if (err || !row) {
            return res.status(404).json({ error: '그룹을 찾을 수 없습니다.' });
        }
        if (row.password !== password) {
            return res.status(403).json({ error: '비밀번호가 일치하지 않습니다.' });
        }

        const deleteSql = 'DELETE FROM groups WHERE id = ?';
        db.run(deleteSql, [groupId], (err) => {
            if (err) {
                console.error("그룹 삭제 오류:", err.message);
                return res.status(500).json({ error: '그룹 삭제에 실패했습니다.' });
            }
            res.status(200).json({ message: '그룹이 성공적으로 삭제되었습니다.' });
        });
    });
});

module.exports = groupController;

