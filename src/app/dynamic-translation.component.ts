import {
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  Input,
  QueryList,
} from '@angular/core';
import { combineLatest, map, ReplaySubject } from 'rxjs';
import { DynamicTranslationSlotDirective } from './dynamic-translation-slot.directive';
import { DynamicTranslationPart, SlotTemplateMapping } from './dynamic-translation.types';

@Component({
  selector: '[appDynamicTranslation]',
  template: `
    <ng-container *ngIf="parts$ | async as parts">
      <ng-container *ngFor="let part of parts">
        <ng-container *ngIf="part.type === 'text'">
          <span>{{ part.text }}</span>
        </ng-container>
        <ng-container *ngIf="part.type === 'slot'">
          <ng-container
            *ngTemplateOutlet="part.template; context: part.context"
          ></ng-container>
        </ng-container>
      </ng-container>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicTranslationComponent {
  @Input('appDynamicTranslation')
  set text(text: string) {
    this.text$.next(text);
  }

  @ContentChildren(DynamicTranslationSlotDirective)
  set slots(slots: QueryList<DynamicTranslationSlotDirective>) {
    const slotTemplates = slots.reduce<SlotTemplateMapping>((mapping, slot) => {
      mapping[slot.getSlotName()] = slot.getTemplate();
      return mapping;
    }, {});

    this.slotTemplates$.next(slotTemplates);
  }

  private text$ = new ReplaySubject<string>(1);
  private slotTemplates$ = new ReplaySubject<SlotTemplateMapping>(1);
  parts$ = combineLatest([this.text$, this.slotTemplates$]).pipe(
    map(([text, slotTemplates]) => {
      const slotNames = Object.keys(slotTemplates);
      const slotSelector = new RegExp(
        `\\[\\[(${slotNames.join('|')})(?::(.+?))?\\]\\]`,
        'g'
      );
      const parts: DynamicTranslationPart[] = [];

      let match;
      let lastIndex = 0;

      while ((match = slotSelector.exec(text)) !== null) {
        const [, slotName, slotText] = match;

        const textBeforeSlot = text.substring(lastIndex, match.index);
        if (textBeforeSlot) {
          parts.push({ type: 'text', text: textBeforeSlot });
        }

        const slotTemplate = slotTemplates[slotName];
        const slotContext = { $implicit: slotText };
        parts.push({
          type: 'slot',
          template: slotTemplate,
          context: slotContext,
        });

        lastIndex = match.index + match[0].length;
      }

      const textAfterLastSlot = text.substring(lastIndex);
      if (textAfterLastSlot) {
        parts.push({ type: 'text', text: textAfterLastSlot });
      }

      return parts;
    })
  );
}
