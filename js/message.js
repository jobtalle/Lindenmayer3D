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
	
	setText(text) {
		this.getElement().style.transition = "0s";
		this.getElement().style.background = this.COLOR_MESSAGE;
		
		this.getText().innerHTML = text;
		
		setTimeout(function() {
			document.getElementById("message-bar").style.transition = "0.7s";
			document.getElementById("message-bar").style.background = "white";
		}, 1);
	}
}