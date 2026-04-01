import { Component, Input, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TypeText, TypeTextContent } from '../type-text/type-text';

@Component({
  selector: 'app-admire',
  imports: [CommonModule, TypeText],
  templateUrl: './admire.html',
  styleUrl: './admire.css',
})
export class Admire implements AfterViewInit {
  @Input() person: string = '';
  @ViewChild(TypeText) typeTextComponent!: TypeText;

  imageSrc: string = 'assets/images/tea time.jpg';

  typeText: TypeTextContent = {
    fullText: ['Loading...'],
    rollbackInterval: 0,
    textTypeInterval: 20,
    lineTypeInterval: 600,
  };

  delay = (ms: number) => new Promise(res => setTimeout(res, ms));

  ngOnInit() {
    this.setupContent();
  }

  setupContent() {
    if (this.person.includes('Eric')) {
      this.imageSrc = 'assets/images/tea time.jpg';
      this.typeText.fullText = [
        "Eric Barone, also known as ConcernedApe.",
        "",
        "He is the creator of Stardew Valley, a beloved game that",
        "brought joy and relaxation to millions of players.",
        "",
        "What I admire most is his unmatched dedication:",
        "he developed the entire game by himself over four years.",
        "That includes the pixel art, the music, the story, and the engine.",
        "",
        "His work is a pure testament to the power of passion and perseverance."
      ];
    } else if (this.person.includes('Linus')) {
      this.imageSrc = 'assets/images/login-head.jpeg';
      this.typeText.fullText = [
        "Linus Torvalds.",
        "",
        "The principal developer of the Linux kernel.",
        "His creation has profoundly changed the world of software,",
        "powering everything from smartphones and smart appliances",
        "to the supercomputers and servers that run the internet.",
        "",
        "He also created Git, the version control system",
        "we developers rely on every single day.",
        "",
        "His open-source contributions have shaped modern computing."
      ];
    } else {
      this.imageSrc = 'assets/images/tea time.jpg';
      this.typeText.fullText = [
        "A person worthy of admiration.",
        "",
        "They have made a significant impact.",
        "Their work inspires others to achieve greatness."
      ];
    }
  }

  async ngAfterViewInit() {
    await this.delay(500);
    if (this.typeTextComponent) {
      this.typeTextComponent.type(false);
    }
  }

  onTypeFinished() {
    // Optionally trigger an animation or show a badge
  }
}
