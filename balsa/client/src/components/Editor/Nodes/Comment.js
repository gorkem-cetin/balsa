import { Mark } from 'tiptap';
import { toggleMark} from 'tiptap-commands';
import Conversation from "../Plugins/Conversation/index";
import uuidv4 from 'uuid/v4';

export default class Heading extends Mark {
  get name() {
    return 'comment';
  }

  get schema() {
    return {
      attrs: {
        guid: {
          default: '',
        }
      },

      toDOM: node => {
        return ['span', {class: 'comment-bg', 'data-conversation-id': node.attrs.guid}, 0];
      },
    };
  }

  commands({type}) {
    return {
      openConversationBox: () => {
        const guid = uuidv4();
        this.options.createConversation(guid);
        return toggleMark(type, { guid });
      }
    }
  }

  get plugins() {
    return [
      Conversation({
        createConversation: this.options.createConversation,
        showConversationBox: this.options.showConversationBox,
        hideConversationBox: this.options.hideConversationBox,
      })
    ]
  }

}
