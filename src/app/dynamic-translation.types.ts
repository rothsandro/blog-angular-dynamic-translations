import { TemplateRef } from '@angular/core';

/**
 * The template context for a slot.
 */
export interface DynamicTranslationTemplateContext {
  /**
   * The slot text.
   * Provided as the implicit value of the context.
   */
  $implicit: string;
}

/**
 * A map of the slot names to their template references.
 */
export type SlotTemplateMapping = Record<
  string,
  TemplateRef<DynamicTranslationTemplateContext>
>;

export type DynamicTranslationPart =
  | DynamicTranslationTextPart
  | DynamicTranslationSlotPart;

export interface DynamicTranslationTextPart {
  type: 'text';
  text: string;
}

export interface DynamicTranslationSlotPart {
  type: 'slot';
  template: TemplateRef<DynamicTranslationTemplateContext>;
  context: DynamicTranslationTemplateContext;
}
