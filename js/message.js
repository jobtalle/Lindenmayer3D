function Message() {
	
}

Message.prototype = {
	COLOR_MESSAGE: "#33FF33",
	
	getElement() {
		return document.getElementById("message-bar");
	},
	
	getText() {
		return document.getElementById("message-text");
	},
	
	setText(text, color = this.COLOR_MESSAGE) {
		this.getElement().style.transition = "0s";
		this.getElement().style.background = color;
		
		this.getText().innerHTML = text;
		
		setTimeout(function() {
			document.getElementById("message-bar").style.transition = "1s";
			document.getElementById("message-bar").style.background = "white";
		}, 500);
	}
}