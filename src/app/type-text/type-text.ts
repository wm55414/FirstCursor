import { Component, EventEmitter, Input, Output, signal } from '@angular/core';

export interface TypeTextContent {
  fullText: string[];
  rollbackInterval: number;
  textTypeInterval: number;
  lineTypeInterval: number;
}

@Component({
  selector: 'app-type-text',
  imports: [],
  templateUrl: './type-text.html',
  styleUrl: './type-text.css',
})
export class TypeText {
  @Input() typeText! : TypeTextContent;
  @Input() needCursor!: boolean;
  @Output() displayFinished = new EventEmitter<void>();

  text = signal("");

  private delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  async type(needRollback: boolean){
    if(needRollback){
      await this.typeLineAndRollback();
    }
    else{
      await this.typeLine();
    }
    this.displayFinished.emit();
  }

  // Type text without rollback
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

  // Rollback each line after typing it.
  async typeLineAndRollback(){
    for (let line of this.typeText.fullText) {
      for (let char of line) {
        this.text.set(this.text() + char);
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
