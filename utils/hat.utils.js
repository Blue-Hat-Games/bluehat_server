exports.getRandomHat = function (old_item_id, total_head_item_cnt) {
	//item_id == 1 means no hat
	while (true) {
		let new_item_id = Math.floor(Math.random() * total_head_item_cnt + 1);
		if (new_item_id != old_item_id && new_item_id != 1) {
			return new_item_id;
		}
	}
}