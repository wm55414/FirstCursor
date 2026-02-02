import { Component, Input, signal } from '@angular/core';

export interface TypeTextContent {
  fullText: string[];
  rollbackInterval: number;
  textTypeInterval: number;
  lineTypeInterval: number;
  needRollback: boolean;
}

@Component({
  selector: 'app-type-text',
  imports: [],
  templateUrl: './type-text.html',
  styleUrl: './type-text.css',
})
export class TypeText {
  @Input() typeText! : TypeTextContent;

  text = signal("");
  displayFinished = signal(false);

  ngOnInit() {
    this.typeLineAndRollback();
  }

  private delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  async typeLine(){
    for (let line of this.typeText.fullText) {
      for (let char of line) {
        this.text.set(this.text() + char);
        await this.delay(this.typeText.textTypeInterval);
      }
      this.text.set(this.text() + "\n");
      await this.delay(this.typeText.lineTypeInterval);
    }
  }

  async typeLineAndRollback(){
    for (let line of this.typeText.fullText) {
      for (let char of line) {
        this.text.set(this.text() + char);
        // if(char != ' ')
          await this.delay(this.typeText.textTypeInterval);
      }
      await this.delay(this.typeText.lineTypeInterval);
      for (let i = 0; i < line.length; i++) {
        this.text.set(this.text().slice(0, -1));
        await this.delay(this.typeText.rollbackInterval);
      }
    }
  }
}
