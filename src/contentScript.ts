'use strict';

import { Message } from './interfaces';

window.onload = function () {
  const promptTextArea = document.getElementById(
    'prompt-textarea'
  ) as HTMLTextAreaElement;

  // Function to adjust the height of the textarea
  function adjustTextareaHeight() {
    promptTextArea.style.height = 'auto'; // Reset the height to auto
    promptTextArea.style.height = promptTextArea.scrollHeight + 'px'; // Set the height to the scroll height
  }

  console.log('UP!');

  chrome.runtime.onMessage.addListener((message: Message, _, sendResponse) => {
    console.log(message);

    if (message.event === 'insert-content') {
      if (promptTextArea.value) {
        promptTextArea.value = promptTextArea.value + `/n${message.payload}`;
      } else {
        promptTextArea.value = message.payload;
      }

      adjustTextareaHeight();
    }
  });
};
