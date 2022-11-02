exports.getRandomHat = function (old_item_id, total_head_item_cnt) {
	//item_id == 1 means no hat
	const bluehat_id = 53;
	var flagCnt = 0;
	while (true && flagCnt < 1) {
		let new_item_id = Math.floor(Math.random() * total_head_item_cnt + 1);
		if (new_item_id == bluehat_id && flagCnt < 1) {
			flagCnt++;
			continue;
		}
		if (new_item_id != old_item_id && new_item_id != 1) {
			return new_item_id;
		}
	}
}