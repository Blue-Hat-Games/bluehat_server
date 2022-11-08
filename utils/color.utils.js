const models = require("../models");
const COLOR_OBJ = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
const COLOR_LENGTH = 16;
const { Op } = require("sequelize");
const PASTEL_MIN = 150;
const EYE_COLOR = 10;

async function checkDuplicateColor(color, animal_type) { //동일한 색 & 동일한 동물이 있는지 확인
	await models.animal_possession.findOne({
		where: { [Op.and]: [{ color: color }, { animal_type: animal_type }] },
	}).then((result) => {
		if (result) {
			return true;
		} else {
			return false;
		}
	});
}

exports.makeDefaultColor = function () {
	let default_color = COLOR_OBJ;
	for (let i = 0; i < COLOR_LENGTH; i++) {
		default_color[i].r = 255;
		default_color[i].g = 255;
		default_color[i].b = 255;
		default_color[i].a = 255;
	}
	return JSON.stringify(default_color);
}
exports.synthesizeColor = async function (color1, color2, animal_type) {
	color1_json = JSON.parse(color1);
	color2_json = JSON.parse(color2);
	let new_color;
	while (true) {
		new_color = COLOR_OBJ;
		for (let i = 0; i < COLOR_LENGTH; i++) {
			if (i == COLOR_LENGTH - 1) {
				new_color[i] = setEyeColor(new_color[i]);
				break;
			}
			rdm = Math.round(Math.random() * 100) % 3;
			if (rdm == 0) { // 1/3 확률로 red centered pastel color 생성
				new_color[i].r = convertToPastelColor(244 + Math.floor(Math.random() * 10));
				new_color[i].g = convertToPastelColor((color1_json[i].g + color2_json[i].g + Math.round(Math.floor(Math.random() * 256)) % 255) % 255);
				new_color[i].b = convertToPastelColor((color1_json[i].b + color2_json[i].b + Math.round(Math.floor(Math.random() * 256)) % 255) % 255);
				new_color[i].a = 255;
			}
			else if (rdm == 1) { // 1/3 확률로 green centered pastel color 생성
				new_color[i].r = convertToPastelColor((color1_json[i].r + color2_json[i].r + Math.round(Math.floor(Math.random() * 256)) % 255) % 255);
				new_color[i].g = convertToPastelColor(244 + Math.floor(Math.random() * 10));
				new_color[i].b = convertToPastelColor((color1_json[i].b + color2_json[i].b + Math.round(Math.floor(Math.random() * 256)) % 255) % 255);
				new_color[i].a = 255;
			}
			else if (rdm == 2) { // 1/3 확률로 blue centered pastel color 생성
				new_color[i].r = convertToPastelColor((color1_json[i].r + color2_json[i].r + Math.round(Math.floor(Math.random() * 256)) % 255) % 255);
				new_color[i].g = convertToPastelColor((color1_json[i].g + color2_json[i].g + Math.round(Math.floor(Math.random() * 256)) % 255) % 255);
				new_color[i].b = convertToPastelColor(244 + Math.floor(Math.random() * 10));
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

exports.changeColor = async function (color, animal_type) {
	color_json = JSON.parse(color);
	let new_color;
	while (true) {
		new_color = COLOR_OBJ;
		for (let i = 0; i < COLOR_LENGTH; i++) {
			if (i == COLOR_LENGTH - 1) {
				new_color[i] = setEyeColor(new_color[i]);
				console.log("NC:", new_color[i]);
				break;
			}
			rdm = Math.round(Math.random() * 100) % 3;
			if (rdm == 0) { // 1/3 확률로 red centered pastel color로 변경
				new_color[i].r = convertToPastelColor(244 + Math.floor(Math.random() * 10));
				new_color[i].g = convertToPastelColor((color_json[i].g + Math.round(Math.floor(Math.random() * 256)) % 255) % 255);
				new_color[i].b = convertToPastelColor((color_json[i].b + Math.round(Math.floor(Math.random() * 256)) % 255) % 255);
				new_color[i].a = 255;
			}
			else if (rdm == 1) { // 1/3 확률로 green centered pastel color로 변경
				new_color[i].r = convertToPastelColor((color_json[i].r + Math.round(Math.floor(Math.random() * 256)) % 255) % 255);
				new_color[i].g = convertToPastelColor(244 + Math.floor(Math.random() * 10));
				new_color[i].b = convertToPastelColor((color_json[i].b + Math.round(Math.floor(Math.random() * 256)) % 255) % 255);
				new_color[i].a = 255;
			}
			else if (rdm == 2) { // 1/3 확률로 blue centered pastel color로 변경
				new_color[i].r = convertToPastelColor((color_json[i].r + Math.round(Math.floor(Math.random() * 256)) % 255) % 255);
				new_color[i].g = convertToPastelColor((color_json[i].g + Math.round(Math.floor(Math.random() * 256)) % 255) % 255);
				new_color[i].b = convertToPastelColor(244 + Math.floor(Math.random() * 10));
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

convertToPastelColor = function (color) {
	return (PASTEL_MIN + Math.round((255 - PASTEL_MIN) * (Number(color) / 255)));
}

setEyeColor = function (colorSet) {
	colorSet.r = EYE_COLOR;
	colorSet.g = EYE_COLOR;
	colorSet.b = EYE_COLOR;
	colorSet.a = 255;
	return colorSet;
}