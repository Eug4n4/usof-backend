use usf;
DELIMITER //

CREATE TRIGGER IF NOT EXISTS ins_like_dislike
BEFORE INSERT ON likes
FOR EACH ROW
BEGIN
    DECLARE author_id INT;
    IF NEW.post_id IS NOT NULL THEN
        SELECT posts.author INTO author_id FROM posts WHERE posts.id = NEW.post_id;
        IF NEW.type = 1 THEN

            UPDATE users
            SET rating = rating + 1
            WHERE id = author_id;
        ELSEIF NEW.type = 0 THEN
            UPDATE users
            SET rating = rating - 1
            WHERE id = author_id;
        END IF;
    ELSEIF NEW.comment_id IS NOT NULL THEN
        SELECT comments.author INTO author_id FROM comments WHERE comments.id = NEW.comment_id;
        IF NEW.type = 1 THEN
            UPDATE users
            SET rating = rating + 1
            WHERE id = author_id;
        ELSEIF NEW.type = 0 THEN
            UPDATE users
            SET rating = rating + 1
            WHERE id = author_id;
        END IF;
    END IF;
END;

CREATE TRIGGER IF NOT EXISTS del_like_dislike
AFTER DELETE ON likes
FOR EACH ROW
BEGIN
    DECLARE author_id INT;
    IF OLD.post_id IS NOT NULL THEN
        SELECT posts.author INTO author_id FROM posts WHERE posts.id = OLD.post_id;
        IF OLD.type = 1 THEN
            UPDATE users
            SET rating = rating - 1
            WHERE id = author_id;
        ELSEIF OLD.type = 0 THEN
            UPDATE users
            SET rating = rating + 1
            WHERE id = author_id;
        END IF;

    ELSEIF OLD.comment_id IS NOT NULL THEN
        SELECT comments.author INTO author_id FROM comments WHERE comments.id = OLD.comment_id;
        IF OLD.type = 1 THEN
            UPDATE users
            SET rating = rating - 1
            WHERE id = author_id;
        ELSEIF OLD.type = 0 THEN
            UPDATE users
            SET rating = rating + 1
            WHERE id = author_id;
        END IF;
    END IF;
END;//

DELIMITER ;