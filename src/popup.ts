'use strict';

import { Message } from './interfaces';
import './popup.css';

//https://example.com

(function () {
  document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('search-btn');
    const searchBox = document.getElementById('search-box') as HTMLInputElement;
    const fileInput = document.getElementById(
      'file-picker'
    ) as HTMLInputElement;

    searchBtn?.addEventListener('click', () => {
      try {
        const url = new URL(searchBox?.value);

        send_url('https://corsproxy.io/?' + url.toString());
      } catch (error: any) {
        alert(error.message);
      }
    });

    fileInput.addEventListener('change', (event) => {
      const selectedFile = (event.target as HTMLInputElement).files![0];

      // Example: Log the file name to the console
      console.log('Selected file:', selectedFile?.name);

      let reader = new FileReader();

      reader.readAsText(selectedFile);

      reader.onload = function () {
        console.log(reader.result);
        send_file_content(reader.result as string);
      };

      reader.onerror = function () {
        alert(reader.error);
      };
    });
  });
})();

const send_file_content = (content: string) => {
  chrome.tabs.query(
    {
      active: true,
      currentWindow: true,
    },
    function (tabs) {
      chrome.runtime.sendMessage<Message>(
        {
          event: 'insert-content',
          payload: {
            tabId: tabs[0].id,
            content,
          },
        },
        function (response) {
          console.log(response);
        }
      );
    }
  );
};

const send_url = (url: string) => {
  chrome.tabs.query(
    {
      active: true,
      currentWindow: true,
    },
    function (tabs) {
      chrome.runtime.sendMessage<Message>(
        {
          event: 'content-url',
          payload: {
            tabId: tabs[0].id,
            url,
          },
        },
        function (response) {
          console.log(response);
        }
      );
    }
  );
};
