'use strict';

import { Message } from './interfaces';
import './popup.css';

(function () {
  document.addEventListener('DOMContentLoaded', () => {
    // Import btn
    const importBtn = document.getElementById('import-btn') as HTMLInputElement;

    // URL search Box
    const urlBox = document.getElementById('url-box') as HTMLInputElement;

    // File input
    const fileBox = document.getElementById('file-box') as HTMLInputElement;

    importBtn?.addEventListener('click', () => {
      if (urlBox?.value) {
        handle_url_import(urlBox.value);
      }

      if (fileBox?.files?.length! > 0) {
        handle_file_import(fileBox?.files![0]);
      }
    });
  });
})();

/**
 * Handles the import of a file by reading its contents as text and sending it to
 * `send_file_content` function.
 *
 * @param {File} file - the file to be imported
 * @return {void} This function does not return anything
 */
const handle_file_import = (file: File): void => {
  let reader = new FileReader();

  reader.readAsText(file);

  reader.onload = function () {
    send_file_content(reader.result as string);
  };

  reader.onerror = function () {
    alert(reader.error);
  };
};

/**
 * Handles importing a URL by sending it through a CORS proxy.
 *
 * @param {string} value - the URL to import
 * @return {void} nothing is returned
 */
const handle_url_import = (value: string): void => {
  try {
    const url = new URL(value);

    send_url('https://corsproxy.io/?' + url.toString());
  } catch (error: any) {
    alert(error.message);
  }
};

/**
 * Sends the content of a file to the active tab in the current window of the Chrome browser.
 *
 * @param {string} content - the content of the file to be sent
 * @return {void} This function does not return anything.
 */
const send_file_content = (content: string): void => {
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

/**
 * Sends the given URL to the background script.
 *
 * @param {string} url - The URL to be sent.
 * @return {void} This function does not return anything.
 */
const send_url = (url: string): void => {
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
