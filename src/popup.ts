'use strict';

import { Message } from './interfaces';
import './popup.css';

//https://example.com

(function () {
  document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('search-btn');
    const searchBox = document.getElementById('search-box') as HTMLInputElement;

    searchBtn?.addEventListener('click', async () => {
      const url =
        'https://corsproxy.io/?https://parabank.parasoft.com/parabank/index.htm'; //searchBox?.value;

      send_url(url);
    });
  });
})();

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
