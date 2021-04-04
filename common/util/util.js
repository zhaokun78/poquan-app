const util = {
	/**
	 * 处理富文本里的图片宽度自适应
	 * 1.查找img标签有无style属性，如果没有，加上style
	 * 2.所有标签style后追加 max-width:100% !important;
	 * 4.去掉<br/>标签
	 * @param html
	 * @returns {void|string|*}
	 */
	formatRichTextImgWidth(html) {
		let newContent = html.replace(/<img[^>]*>/gi, function(match, capture) {
			//console.log(match.search(/style=/gi));

			if (match.search(/style=/gi) == -1) {
				match = match.replace(/\<img/gi, '<img style=""');
			}
			return match;
		});

		newContent = newContent.replace(/style="/gi, '$& width:100% !important; height:100% !important; ');
		newContent = newContent.replace(/<br[^>]*\/>/gi, '');
		return newContent;
	},

	//查询是否关注作者
	async queryHadFollowSomeOne(http, userId) {
		let res = await http.get('/showme/showmeFollow/hadFollowSomeOne?userId=' + userId);
		if (res.data.success) {
			if (res.data.result > 0) {
				return true;
			}
		}

		return false;
	}

}

export default util;
