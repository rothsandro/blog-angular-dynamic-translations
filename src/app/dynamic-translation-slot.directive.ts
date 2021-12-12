import { Directive, Input, TemplateRef } from '@angular/core';
import { DynamicTranslationTemplateContext } from './dynamic-translation.types';

@Directive({
  selector: '[appDynamicTranslationSlot]',
})
export class DynamicTranslationSlotDirective {
  static  readonly NAME_PATTERN = /^[a-z0-9]+$/i;

  @Input('appDynamicTranslationSlot')
  slotName?: string;

  constructor(private templateRef: TemplateRef<DynamicTranslationTemplateContext>) {}

  getSlotName() {
    if (!this.slotName) throw new Error('Missing slot name');
    if (!DynamicTranslationSlotDirective.NAME_PATTERN.test(this.slotName)) throw new Error('Invalid slot name ' + this.slotName);
    return this.slotName;
  }

  getTemplate() {
    return this.templateRef;
  }
}
