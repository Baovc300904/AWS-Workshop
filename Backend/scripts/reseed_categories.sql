-- Create categories if missing
INSERT INTO category (name, description) VALUES ('Horror',NULL) ON DUPLICATE KEY UPDATE name=name;
INSERT INTO category (name, description) VALUES ('Co-op',NULL) ON DUPLICATE KEY UPDATE name=name;
INSERT INTO category (name, description) VALUES ('Multiplayer',NULL) ON DUPLICATE KEY UPDATE name=name;
INSERT INTO category (name, description) VALUES ('Survival',NULL) ON DUPLICATE KEY UPDATE name=name;
INSERT INTO category (name, description) VALUES ('Open World',NULL) ON DUPLICATE KEY UPDATE name=name;
INSERT INTO category (name, description) VALUES ('Creature',NULL) ON DUPLICATE KEY UPDATE name=name;
INSERT INTO category (name, description) VALUES ('Action',NULL) ON DUPLICATE KEY UPDATE name=name;
INSERT INTO category (name, description) VALUES ('Adventure',NULL) ON DUPLICATE KEY UPDATE name=name;
INSERT INTO category (name, description) VALUES ('Casual',NULL) ON DUPLICATE KEY UPDATE name=name;
INSERT INTO category (name, description) VALUES ('Shooter',NULL) ON DUPLICATE KEY UPDATE name=name;

-- Helper inserts for each game by name
-- PEAK
INSERT INTO game_categories (game_id, categories_name)
SELECT g.id, 'Multiplayer' FROM game g WHERE LOWER(g.name)='peak'
AND NOT EXISTS (SELECT 1 FROM game_categories gc WHERE gc.game_id=g.id AND gc.categories_name='Multiplayer');
INSERT INTO game_categories (game_id, categories_name)
SELECT g.id, 'Casual' FROM game g WHERE LOWER(g.name)='peak'
AND NOT EXISTS (SELECT 1 FROM game_categories gc WHERE gc.game_id=g.id AND gc.categories_name='Casual');

-- Palworld / Palword
INSERT INTO game_categories (game_id, categories_name)
SELECT g.id, 'Survival' FROM game g WHERE LOWER(g.name) LIKE 'palw%'
AND NOT EXISTS (SELECT 1 FROM game_categories gc WHERE gc.game_id=g.id AND gc.categories_name='Survival');
INSERT INTO game_categories (game_id, categories_name)
SELECT g.id, 'Open World' FROM game g WHERE LOWER(g.name) LIKE 'palw%'
AND NOT EXISTS (SELECT 1 FROM game_categories gc WHERE gc.game_id=g.id AND gc.categories_name='Open World');
INSERT INTO game_categories (game_id, categories_name)
SELECT g.id, 'Creature' FROM game g WHERE LOWER(g.name) LIKE 'palw%'
AND NOT EXISTS (SELECT 1 FROM game_categories gc WHERE gc.game_id=g.id AND gc.categories_name='Creature');

-- Call of Duty
INSERT INTO game_categories (game_id, categories_name)
SELECT g.id, 'Shooter' FROM game g WHERE LOWER(g.name) LIKE '%call of duty%'
AND NOT EXISTS (SELECT 1 FROM game_categories gc WHERE gc.game_id=g.id AND gc.categories_name='Shooter');
INSERT INTO game_categories (game_id, categories_name)
SELECT g.id, 'Action' FROM game g WHERE LOWER(g.name) LIKE '%call of duty%'
AND NOT EXISTS (SELECT 1 FROM game_categories gc WHERE gc.game_id=g.id AND gc.categories_name='Action');

-- Phasmophobia
INSERT INTO game_categories (game_id, categories_name)
SELECT g.id, 'Horror' FROM game g WHERE LOWER(g.name)='phasmophobia'
AND NOT EXISTS (SELECT 1 FROM game_categories gc WHERE gc.game_id=g.id AND gc.categories_name='Horror');
INSERT INTO game_categories (game_id, categories_name)
SELECT g.id, 'Co-op' FROM game g WHERE LOWER(g.name)='phasmophobia'
AND NOT EXISTS (SELECT 1 FROM game_categories gc WHERE gc.game_id=g.id AND gc.categories_name='Co-op');
INSERT INTO game_categories (game_id, categories_name)
SELECT g.id, 'Multiplayer' FROM game g WHERE LOWER(g.name)='phasmophobia'
AND NOT EXISTS (SELECT 1 FROM game_categories gc WHERE gc.game_id=g.id AND gc.categories_name='Multiplayer');

-- REPO
INSERT INTO game_categories (game_id, categories_name)
SELECT g.id, 'Action' FROM game g WHERE LOWER(g.name)='repo'
AND NOT EXISTS (SELECT 1 FROM game_categories gc WHERE gc.game_id=g.id AND gc.categories_name='Action');
INSERT INTO game_categories (game_id, categories_name)
SELECT g.id, 'Adventure' FROM game g WHERE LOWER(g.name)='repo'
AND NOT EXISTS (SELECT 1 FROM game_categories gc WHERE gc.game_id=g.id AND gc.categories_name='Adventure');

-- Rematch
INSERT INTO game_categories (game_id, categories_name)
SELECT g.id, 'Action' FROM game g WHERE LOWER(g.name)='rematch'
AND NOT EXISTS (SELECT 1 FROM game_categories gc WHERE gc.game_id=g.id AND gc.categories_name='Action');

-- Cuphead
INSERT INTO game_categories (game_id, categories_name)
SELECT g.id, 'Action' FROM game g WHERE LOWER(g.name)='cuphead'
AND NOT EXISTS (SELECT 1 FROM game_categories gc WHERE gc.game_id=g.id AND gc.categories_name='Action');

-- V Rising
INSERT INTO game_categories (game_id, categories_name)
SELECT g.id, 'Action' FROM game g WHERE LOWER(g.name) IN ('v rising','v-rising','vrising')
AND NOT EXISTS (SELECT 1 FROM game_categories gc WHERE gc.game_id=g.id AND gc.categories_name='Action');


