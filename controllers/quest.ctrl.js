const models = require("../models");
const errorMsg = require("../message/msg_error");
const infoMsg = require("../message/msg_info");
const logger = require("../config/logger");

exports.getUserQuest = async function (req, res) {
    logger.info(`${req.method} ${req.originalUrl}`);

    // Setting Default
    if (!req.query.page) {
        req.query.page = 1;
    }
    if (!req.query.limit) {
        req.query.limit = 20;
    }

    const offset = (parseInt(req.query.page) - 1) * parseInt(req.query.limit);
    const limit = parseInt(req.query.limit);

    orderInfo = {
        Recently: ["createdAt", "DESC"],
        Oldest: ["createdAt", "ASC"],
    };

    if (!req.query.order) {
        req.query.order = orderInfo["Recently"];
    } else {
        if (!orderInfo[req.query.order]) {
            req.query.order = orderInfo["Recently"];
        } else {
            req.query.order = orderInfo[req.query.order];
        }
    }
    const order = req.query.order;

    try {
        let userQuests = await models.user_quest.findAll({
            where: { user_id: req.userId },
            include: [{
                model: models.quest,
                attributes: ["type", "title", "description", "action", "reward_coin", "reward_egg"],
            }],
            attributes: ["createdAt", "status", "get_reward"],
            limit: limit,
            offset: offset,
            order: [order],
        });
        let questResultList = [];
        userQuests.forEach((userQuest) => {
            data = {
                "type": userQuest.quest.type,
                "title": userQuest.quest.title,
                "description": userQuest.quest.description,
                "action": userQuest.quest.action,
                "reward_coin": userQuest.quest.reward_coin,
                "reward_egg": userQuest.quest.reward_egg,
                "status": userQuest.status,
                "get_reward": userQuest.get_reward,
                "createdAt": userQuest.createdAt
            }
            questResultList.push(data);
        });
        let result = {
            "data": questResultList
        }
        return res.status(200).send(result);
    } catch (e) {
        logger.error(e);
        return res.status(500).send(errorMsg.internalServerError);
    }


};

exports.getUserQuestCount = async function (req, res) {
    logger.info(`${req.method} ${req.originalUrl}`);
    try {
        let count = await models.user_quest.count({ where: { user_id: req.userId, status: false } });
        result = {
            "status": "success",
            "data": {
                "totalCount": count
            }
        }
        return res.status(200).send(result);
    } catch (e) {
        logger.error(e);
        return res.status(500).send(errorMsg.internalServerError);
    }
};

exports.completeQuest = async function (req, res) {
    logger.info(`${req.method} ${req.originalUrl}`);
    try {
        const { quest_id } = req.body;
        const userQuest = await models.user_quest.findOne({ where: { user_id: req.userId, quest_id: quest_id } });
        if (!userQuest) {
            return res.status(400).send(errorMsg.questNotFound);
        }
        if (userQuest.status == true) {
            return res.status(400).send(errorMsg.questAlreadyCompleted);
        }
        userQuest.status = true;
        userQuest.save();
        return res.status(200).send(infoMsg.questCompleted);
    } catch (e) {
        logger.error(e);
        return res.status(500).send(errorMsg.internalServerError);
    }
}

exports.getQuestReward = async function (req, res) {
    logger.info(`${req.method} ${req.originalUrl}`);
    try {
        const { quest_id } = req.body;
        const userQuest = await models.user_quest.findOne({ where: { user_id: req.userId, quest_id: quest_id } });
        if (!userQuest) {
            return res.status(404).send(errorMsg.questNotFound);
        }
        if (userQuest.status == false) {
            return res.status(400).send(errorMsg.questNotCompleted);
        }
        if (userQuest.status == true && userQuest.get_reward == true) {
            return res.status(400).send(errorMsg.questAlreadyGetReward);
        }
        if (userQuest.status == true && userQuest.get_reward == false) {
            await models.user_quest.update({ get_reward: true }, { where: { user_id: req.userId, quest_id: quest_id } });
            models.quest.findOne({
                where: { id: quest_id },
                include: [{
                    model: models.quest_reward,
                    as: "quest_reward",
                    attributes: ["coin", "egg"]
                }]
            }).then(
                async (result) => {
                    await models.user.increment(
                        {
                            coin: result.quest_reward.coin,
                            egg: result.quest_reward.egg
                        }, { where: { id: req.userId } }
                    )
                }
            )
            return res.status(200).send(infoMsg.questRewardSuccess);
        }

    } catch (e) {
        logger.error(e);
        return res.status(500).send(errorMsg.internalServerError);
    }

}

exports.createQuest = async function (req, res) {
    logger.info(`${req.method} ${req.originalUrl}`);
    try {
        const { title, description, type, coin, egg, action } = req.body;
        console.log(title, description, type, coin, egg, action);
        const result = await models.quest.create({
            title: title,
            description: description,
            type: type,
            action: action,
            reward_egg: egg,
            reward_coin: coin,
        }).then((result) => {
            logger.info(result);
        });;
        return res.status(200).send(result);
    } catch (e) {
        logger.error(e);
        return res.status(500).send(errorMsg.internalServerError);
    }

}

exports.sendQuestToUser = async function (req, res) {
    logger.info(`${req.method} ${req.originalUrl}`);
    try {
        const { quest_id, user_id_list } = req.body;
        const userQuest = await models.user_quest.bulkCreate(
            user_id_list.map((user_id) => {
                return {
                    user_id: user_id,
                    quest_id: quest_id,
                    status: false,
                    get_reward: false,
                };
            })
        );
        return res.status(200).send(userQuest);
    } catch (e) {
        logger.error(e);
        return res.status(500).send(errorMsg.internalServerError);
    }
}

exports.sendQuestToAllUser = async function (req, res) {
    logger.info(`${req.method} ${req.originalUrl}`);
    try {
        const { quest_id } = req.body;
        const userQuest = await models.user_quest.bulkCreate(
            (await models.user.findAll()).map((user) => {
                return {
                    user_id: user.id,
                    quest_id: quest_id,
                    status: false,
                    get_reward: false,
                };
            })
        );
        return res.status(200).send(userQuest);
    }
    catch (e) {
        logger.error(e);
        return res.status(500).send(errorMsg.internalServerError);
    }
}