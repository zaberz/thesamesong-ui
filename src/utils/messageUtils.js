const messageType = {
  NOTICE: "NOTICE",
  ONLINE: "ONLINE",
  CHAT: "CHAT",
  PICK: "PICK",
  MUSIC: "MUSIC",
  SETTING_NAME: "SETTING_NAME",
  AUTH: "AUTH",
  AUTH_ROOT: "AUTH_ROOT",
  AUTH_ADMIN: "AUTH_ADMIN",
  SEARCH: "SEARCH",
  SEARCH_PICTURE: "SEARCH_PICTURE",
  VOLUMN: "VOLUMN",
  GOODMODEL: "GOODMODEL",
  SEARCH_HOUSE: "SEARCH_HOUSE",
  ENTER_HOUSE: "ENTER_HOUSE",
  ENTER_HOUSE_START: "ENTER_HOUSE_START",
  ADD_HOUSE: "ADD_HOUSE",
  ADD_HOUSE_START: "ADD_HOUSE_START",
  SEARCH_SONGLIST: "SEARCH_SONGLIST",
  SEARCH_USER: "SEARCH_USER",
  ANNOUNCEMENT: "ANNOUNCEMENT",
  HOUSE_USER: "HOUSE_USER"
};
export default {
  messageType,
  isKnowMessageType: function(source) {
    if (source === null || source === "" || source.length === 0) {
      return "";
    }
    let strings = source.split("\n"),
      type = strings.length > 0 ? strings[0] : "";
    return type === "" ? false : Object.keys(messageType).includes(type);
  },

  parseMessageType: source => {
    if (source === null || source === "" || source.length === 0) {
      return "";
    }
    let strings = source.split("\n");
    return strings.length > 0 ? strings[0] : "";
  },
  parseMessageContent: source => {
    if (source === null || source === "" || source.length === 0) {
      return "";
    }
    let strings = source.split("\n");
    return strings.length > 0 ? JSON.parse(strings[strings.length - 1]) : "";
  }
};
