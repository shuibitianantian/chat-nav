import type { PlasmoCSConfig } from "~node_modules/plasmo/dist/type";
import { MessageType } from "~typing";

export const config: PlasmoCSConfig = {
    matches: ["https://chatgpt.com/*"],
}

const ID_TAG = 'data-message-id';

chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
    if (request.name === MessageType.GET_QUESTIONS) {
        const questions = [
            ...document.querySelectorAll('[data-message-author-role="user"]')
        ] as HTMLElement[]
        sendResponse({
            questions: questions.map(el => ({
                id: el.getAttribute(ID_TAG),
                text: el.innerText
            }))
        });
    }
});

chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
    if (request.name === MessageType.SCROLL_TO_QUESTION) {
        const target = document.querySelector(`[${ID_TAG}="${request.id}"]`);
        target.scrollIntoView({ behavior: 'smooth' });
        sendResponse(true)
    }
});