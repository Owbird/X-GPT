'use strict';

import { Message } from './interfaces';

import { load } from 'cheerio';

async function get_content(url: string): Promise<string> {
  console.log('Fetching');

  const res = await fetch(url);

  console.log('Fetched');

  const html = await res.text();

  const $ = load(html);

  // Remove text from script tags
  $('script').each((_, element) => {
    $(element).text('');
  });

  const content = $('body').text().replace(/\n\t/g, '');

  console.log(content);

  return content;
}

console.log('HI');

chrome.runtime.onMessage.addListener((message: Message, _, sendResponse) => {
  console.log(message);

  sendResponse();

  if (message.event === 'content-url') {
    console.log(message.payload);

    get_content(message.payload.url).then((content) => {
      chrome.tabs.sendMessage<Message>(message.payload.tabId, {
        event: 'insert-content',
        payload: {
          content,
        },
      });
    });
  } else {
    //Forward request to contentScript
    chrome.tabs.sendMessage<Message>(message.payload.tabId, message);
  }
});
