<template>
	<view>
		<view class="container">
			<view class='wrapper'>
				<view class="editor-wrapper">
					<view class="cu-bar tabbar bg-white" @tap="format" style="margin-top: 20rpx !important;">
						<view class="action">
							<view :class="formats.bold ? 'ql-active' : ''" class="iconfont icon-zitijiacu"
								data-name="bold">
							</view>
						</view>
						<view class="action">
							<view :class="formats.italic ? 'ql-active' : ''" class="iconfont icon-zitixieti"
								data-name="italic">
							</view>
						</view>
						<view class="action">
							<view :class="formats.underline ? 'ql-active' : ''" class="iconfont icon-zitixiahuaxian"
								data-name="underline">
							</view>
						</view>
						<view class="action">
							<view :class="formats.align === 'left' ? 'ql-active' : ''" class="iconfont icon-zuoduiqi"
								data-name="align" data-value="left">
							</view>
						</view>
						<view class="action">
							<view :class="formats.align === 'center' ? 'ql-active' : ''"
								class="iconfont icon-juzhongduiqi" data-name="align" data-value="center">
							</view>
						</view>
						<view class="action">
							<view :class="formats.align === 'right' ? 'ql-active' : ''" class="iconfont icon-youduiqi"
								data-name="align" data-value="right">
							</view>
						</view>
						<view class="action">
							<view :class="formats.align === 'justify' ? 'ql-active' : ''"
								class="iconfont icon-zuoyouduiqi" data-name="align" data-value="justify">
							</view>
						</view>
						<view class="action">
							<view :class="formats.list === 'ordered' ? 'ql-active' : ''"
								class="iconfont icon-youxupailie" data-name="list" data-value="ordered">
							</view>
						</view>
						<view class="action">
							<view :class="formats.list === 'bullet' ? 'ql-active' : ''" class="iconfont icon-wuxupailie"
								data-name="list" data-value="bullet">
							</view>
						</view>
						<view class="action">
							<view class="iconfont icon-charutupian" @tap="insertImage">
							</view>
						</view>
					</view>
					<editor :id="editorId" class="ql-container" :placeholder="placeholder" showImgSize showImgToolbar
						showImgResize @input="onInput" @statuschange="onStatusChange" :read-only="readOnly"
						@ready="onEditorReady">
					</editor>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "rich-text-editor",
		props: {
			id: undefined,
			content: '',
			placeholder: ''
		},
		computed: {
			editorId() {
				return 'editor_' + this.id
			}
		},
		data() {
			return {
				readOnly: false,
				formats: {}
			};
		},
		methods: {
			onInput(e) {
				console.log(e)
				this.$emit('update:content', e.detail.html)
			},
			readOnlyChange() {
				this.readOnly = !this.readOnly
			},
			onEditorReady() {
				let that = this
				uni.createSelectorQuery().select('#' + this.editorId).context((res) => {
					this.editorCtx = res.context
					that.editorCtx.setContents({
						html: that.content
					});
				}).exec()
			},
			undo() {
				this.editorCtx.undo()
			},
			redo() {
				this.editorCtx.redo()
			},
			format(e) {
				let {
					name,
					value
				} = e.target.dataset
				if (!name) return
				console.log('format', name, value)
				this.editorCtx.format(name, value)

			},
			onStatusChange(e) {
				const formats = e.detail
				this.formats = formats
			},
			insertDivider() {
				this.editorCtx.insertDivider({
					success: function() {
						console.log('insert divider success')
					}
				})
			},
			clear() {
				this.editorCtx.clear({
					success: function(res) {
						console.log("clear success")
					}
				})
			},
			removeFormat() {
				this.editorCtx.removeFormat()
			},
			insertDate() {
				const date = new Date()
				const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
				this.editorCtx.insertText({
					text: formatDate
				})
			},
			insertImage() {
				let that = this
				uni.chooseImage({
					count: 1,
					success: async (res) => {
						console.log(res)
						if (res.tempFilePaths.length > 0) {
							//上传图片
							const result = await that.$http.upload(
								'/sys/common/upload', {
									filePath: res.tempFilePaths[0],
									name: 'file'
								})

							if (result.data.success) {
								this.editorCtx.insertImage({
									src: that.$config.staticDomainURL + '/' +
										result.data.message,
									alt: '图像',
									success: function() {
										console.log('insert image success')
									}
								})
							}
						}
					}
				})
			},
			insertVideo() {
				this.$tip.toast('敬请期待！');
			},
			startLiveShow() {
				this.$tip.toast('敬请期待！');
			}
		}
	}
</script>

<style>
	@import "./editor-icon.css";

	.page-body {
		height: calc(100vh - var(--window-top) - var(--status-bar-height));
	}

	.wrapper {
		height: 80%;
	}

	.editor-wrapper {
		height: calc(100vh - var(--window-top) - var(--status-bar-height) - 300px);
		background: #fff;
	}

	.iconfont {
		display: inline-block;
		padding: 8px 8px;
		width: 24px;
		height: 24px;
		cursor: pointer;
		font-size: 20px;
	}

	.toolbar {
		box-sizing: border-box;
		border-bottom: 0;
		font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
	}


	.ql-container {
		box-sizing: border-box;
		padding: 12px 15px;
		width: 100%;
		min-height: 30vh;
		height: 100%;
		font-size: 16px;
		line-height: 1.5;
	}

	.ql-active {
		color: #06c;
	}
</style>
