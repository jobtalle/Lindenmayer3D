function Message() {
	
}

Message.prototype = {
	COLOR_ERROR: "#FF3333",
	COLOR_MESSAGE: "#33FF33",
	
	getElement() {
		return document.getElementById("message-bar");
	},
	
	getText() {
		return document.getElementById("message-text");
	},
	
	setText(text, error) {
		this.getElement().style.transition = "0s";
		
		if(error)
			this.getElement().style.background = this.COLOR_ERROR;
		else
			this.getElement().style.background = this.COLOR_MESSAGE;
		
		this.getText().innerHTML = text;
		
		setTimeout(function() {
			document.getElementById("message-bar").style.transition = "0.7s";
			document.getElementById("message-bar").style.background = "white";
		}, 1);
	}
}