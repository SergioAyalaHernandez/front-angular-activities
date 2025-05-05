import {Component, OnInit} from '@angular/core';
import {ChatbotService} from "../../../../services/chatbot.service";

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements OnInit {
  isOpen = false;
  questions: { menu_text: string; response_text: string; id: string }[] = [];
  messages: { text: string; sender: 'bot' | 'user' }[] = [];
  showOptions = false;

  constructor(private chatbotService: ChatbotService) {}

  ngOnInit(): void {
    // precarga preguntas si deseas
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) this.startChat();
  }

  startChat() {
    this.messages = [];
    this.showOptions = false;

    // Simula tiempos
    this.addBotMessage('Hola, ¿en qué te puedo ayudar?', 500);
    setTimeout(() => {
      this.chatbotService.getQuestions().subscribe((questions) => {
        this.questions = questions;
        this.showOptions = true;
      });
    }, 1000);
  }

  handleUserChoice(q: any) {
    this.messages.push({ text: q.menu_text, sender: 'user' });
    this.showOptions = false;

    setTimeout(() => {
      // Podemos mostrar directamente la respuesta que ya viene en el objeto
      this.addBotMessage(q.response_text);

      setTimeout(() => {
        this.showOptions = true;
      }, 500);
    }, 800);
  }


  addBotMessage(text: string, delay = 0) {
    setTimeout(() => {
      this.messages.push({ text, sender: 'bot' });
    }, delay);
  }
}
