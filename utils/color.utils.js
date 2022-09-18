const models = require("../models");
const COLOR_OBJ = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
const COLOR_LENGTH = 16;
const { Op } = require("sequelize");

async function checkDuplicateColor(color, animal_type) { //동일한 색 & 동일한 동물이 있는지 확인
	await models.animal_possession.findOne({
		where: { [Op.and]: [{ color: color }, { animal_id: animal_type }] },
	}).then((result) => {
		if (result) {
			return true;
		} else {
			return false;
		}
	});
}

exports.synthesizeColor = async function (color1, color2, animal_type) {
	color1_json = JSON.parse(color1);
	color2_json = JSON.parse(color2);
	let new_color;
	while (true) {
		new_color = COLOR_OBJ;
		for (let i = 0; i < COLOR_LENGTH; i++) {
			rdm = Math.round(Date.now() + Math.random()) % 3;
			if (rdm == 0) { // 33% 확률로 color1의 색상을 가져옴
				new_color[i].r = color1_json[i].r;
				new_color[i].g = color1_json[i].g;
				new_color[i].b = color1_json[i].b;
				new_color[i].a = 255;
			}
			else if (rdm == 1) { // 33% 확률로 color2의 색상을 가져옴
				new_color[i].r = color2_json[i].r;
				new_color[i].g = color2_json[i].g;
				new_color[i].b = color2_json[i].b;
				new_color[i].a = 255;
			}
			else if (rdm == 2) { // 33% 확률로 랜덤 색상을 가져옴
				new_color[i].r = (color1_json[i].r + color2_json[i].r) % 255;
				new_color[i].g = (color1_json[i].g + color2_json[i].g) % 255;
				new_color[i].b = (color1_json[i].b + color2_json[i].b) % 255;
				new_color[i].a = 255;
			}
		}
		if (await checkDuplicateColor(JSON.stringify(new_color), animal_type))
			continue;
		else
			break;
	}
	return JSON.stringify(new_color);
}

