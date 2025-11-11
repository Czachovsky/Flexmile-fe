import {AfterViewInit, Component, ElementRef, QueryList, ViewChildren} from '@angular/core';
import {FaqObject, FaqTypes} from '@models/faq.types';
import {NgClass, NgStyle} from '@angular/common';

@Component({
  selector: 'flexmile-faq',
  imports: [
    NgClass,
    NgStyle
  ],
  templateUrl: './faq.html',
  styleUrl: './faq.scss',
})
export class Faq implements AfterViewInit {
  public faqObject: FaqTypes[] = FaqObject;
  @ViewChildren('questionAnswer') questionAnswers!: QueryList<ElementRef>;

  ngAfterViewInit() {
    setTimeout(() => {
      this.updateContentHeights();
    }, 1000)
  }

  updateContentHeights() {
    this.questionAnswers.toArray().forEach((answer, index) => {
      this.faqObject[index].contentHeight = answer.nativeElement.scrollHeight;
    });
  }


  changeExpandState(index: number, target: EventTarget | null) {
    this.faqObject.forEach((e, i) => {
      if (i !== index) {
        e.isExpanded = false;
      }
    });
    this.faqObject[index].isExpanded = !this.faqObject[index].isExpanded;
    setTimeout(() => this.updateContentHeights(), 300);
  }
}
