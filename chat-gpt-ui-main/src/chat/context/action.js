import { fetchStream } from "../service";
import { fetchResponseFromHuggingFace } from "./fetchResponseFromHuggingFace";

export default function action(state, dispatch) {
  const setState = (payload = {}) =>
      dispatch({
        type: "SET_STATE",
        payload: { ...payload },
      });

  const sendMessage = async () => {
    const { typeingMessage, options, chat, is, currentChat } = state;
    if (typeingMessage?.content) {
      const newMessage = {
        ...typeingMessage,
        sentTime: Date.now(),
        id: Date.now(), // Ensure unique ID for the new message
      };
      const messages = [...chat[currentChat].messages, newMessage];
      let newChat = [...chat];
      newChat[currentChat] = { ...chat[currentChat], messages };

      setState({
        is: { ...is, thinking: true },
        typeingMessage: {},
        chat: newChat,
      });

      // Fetch AI response
      try {
        const aiResponse = await fetchResponseFromHuggingFace(typeingMessage.content);
        const aiMessage = {
          content: aiResponse,
          role: "assistant",
          sentTime: Date.now(),
          id: Date.now(), // Unique ID for the AI response
        };

        // Add AI response to messages
        newChat[currentChat].messages.push(aiMessage);

        // Update state with new messages
        setState({ chat: newChat, is: { ...is, thinking: false } });
      } catch (error) {
        console.error('Error getting AI response:', error);
        // Handle error (e.g., update state to reflect error)
        setState({ is: { ...is, thinking: false } });
      }
    }
  };

  // Other actions...

  return {
    setState,
    sendMessage, // Include sendMessage in the returned actions
    clearTypeing() {
      console.log("clear");
      setState({ typeingMessage: {} });
    },
    // ... other actions


    newChat() {
      const { chat } = state;
      const chatList = [
        ...chat,
        {
          title: "This is a New Conversations",
          id: Date.now(),
          messages: [],
          ct: Date.now(),
          icon: [2, "files"],
        },
      ];
      setState({ chat: chatList, currentChat: chatList.length - 1 });
    },

    modifyChat(arg, index) {
      const chat = [...state.chat];
      chat.splice(index, 1, { ...chat[index], ...arg });
      setState({ chat, currentEditor: null });
    },

    editChat(index, title) {
      const chat = [...state.chat];
      chat.splice(index, 1, [...chat[index], title]);
      setState({
        chat,
      });
    },
    removeChat(index) {
      const chat = [...state.chat];
      chat.splice(index, 1);
      const payload =
        state.currentChat === index
          ? { chat, currentChat: index - 1 }
          : { chat };
      setState({
        ...payload,
      });
    },

    setMessage(content) {
      const typeingMessage =
        content === ""
          ? {}
          : {
              role: "user",
              content,
              id: Date.now(),
            };
      setState({ is: { ...state.is, typeing: true }, typeingMessage });
    },

    clearMessage() {
      const chat = [...state.chat];
      chat[state.currentChat].messages = [];
      setState({
        chat,
      });
    },

    removeMessage(index) {
      const messages = state.chat[state.currentChat].messages;
      const chat = [...state.chat];
      messages.splice(index, 1);
      chat[state.currentChat].messages = messages;
      setState({
        chat,
      });
    },

    setOptions({ type, data = {} }) {
      console.log(type, data);
      let options = { ...state.options };
      options[type] = { ...options[type], ...data };
      setState({ options });
    },

    setIs(arg) {
      const { is } = state;
      setState({ is: { ...is, ...arg } });
    },

    currentList() {
      return state.chat[state.currentChat];
    },

    stopResonse() {
      setState({
        is: { ...state.is, thinking: false },
      });
    },
  };
}
export const datas = {
  id: "chatcmpl-7AEK9Dlw96m5TejBKIKUgjyUHVTCa",
  object: "chat.completion",
  created: 1682672697,
  model: "gpt-3.5-turbo-0301",
  usage: {
    prompt_tokens: 34,
    completion_tokens: 303,
    total_tokens: 337,
  },
  choices: [
    {
      message: {
        role: "assistant",
        content:
          'useKeyboard hooks。\n\n```jsx\nimport { useState, useEffect } from "react"; \n\nexport default function useKeyboard(targetKey) { \n  const [keyPressed, setKeyPressed] = useState(false); \n  \n  const downHandler = ({ key }) => {\n    if (key === targetKey) {\n      setKeyPressed(true); \n    } \n  }; \n  \n  const upHandler = ({ key }) => { \n    if (key === targetKey) { \n      setKeyPressed(false); \n    } \n  }; \n\n  useEffect(() => { \n    window.addEventListener("keydown", downHandler); \n    window.addEventListener("keyup", upHandler); \n    \n    return () => { \n      window.removeEventListener("keydown", downHandler); \n      window.removeEventListener("keyup", upHandler); \n    }; \n  }, []); \n\n  return keyPressed; \n}\n```\n\n(keyPressed)true。false。',
      },
      finish_reason: "stop",
      index: 0,
    },
  ],
};
