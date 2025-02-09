export interface QuestionElement {
    id: string;
    text: string;
}

export enum MessageType {
    GET_QUESTIONS = 'getQuestions',
    SCROLL_TO_QUESTION = 'scrollToQuestion'
}