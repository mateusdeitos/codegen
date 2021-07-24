const Events = require("events");

const eventsEnum = {
	ROOT_DIR_NOT_FOUND: "ROOT_DIR_NOT_FOUND",
	NO_SCRIPTS_FOUND: "NO_SCRIPTS_FOUND",
	CHOOSE_SCRIPT: "CHOOSE_SCRIPT",
	SCRIPTS_LOADED: "SCRIPTS_LOADED",
}

module.exports = {
	Events: new Events(),
	eventsEnum
}
