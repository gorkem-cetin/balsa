import {Plugin, PluginKey} from 'prosemirror-state'
import {ConversationState} from "./state";

class Conversation {
  constructor({editorView, options, key}) {
    this.options = options;
    this.editorView = editorView;
    this.key = key;
  }

  update(view, lastState) {
    const prev = this.key.getState(lastState);
    const next = this.key.getState(view.state);
    if (next.active) {
      this.options.showConversationBox(next.selectedConversationId)
    } else {
      if (prev.active && prev.selectedConversationId && !next.selectedConversationId) {
        this.options.hideConversationBox(prev.selectedConversationId)
      }
    }
  }

  hide(event) {
  }

  destroy() {
  }

}

export default function (options) {
  return new Plugin({
    key: new PluginKey('conversation'),
    view(editorView) {
      return new Conversation({editorView, options, key: this.key})
    },
    state: new ConversationState({options: options}),
  })
}
