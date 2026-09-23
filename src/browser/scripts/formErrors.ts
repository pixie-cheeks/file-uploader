import * as z from 'https://esm.sh/zod@4';

const errorDataDom = document.querySelector('#error-data');
if (!errorDataDom) throw new Error('Could not find the error data element.');

const givenDataDom = document.querySelector('#given-data');
if (!givenDataDom) throw new Error('Could not find the given data element.');

const errorSchema = z
  .object({
    path: z.array(z.string()).min(1).max(1),
  })
  .array();
const givenBodySchema = z.record(z.string(), z.string().or(z.number().array()));

const errorData = errorSchema.parse(JSON.parse(errorDataDom.getHTML()));
const givenData = givenBodySchema.parse(JSON.parse(givenDataDom.getHTML()));

for (const error of errorData) {
  const [propertyName] = error.path;

  document
    .querySelector(`[name="${CSS.escape(propertyName)}"]`)
    ?.classList.add('error');
}

const setMultiselectData = (
  selectDom: HTMLElement,
  optionData: number[],
): void => {
  for (const optionId of optionData) {
    const option = selectDom.querySelector<HTMLOptionElement>(
      `option[value="${CSS.escape(optionId.toString())}"]`,
    );
    if (option) option.selected = true;
  }
};

for (const [fieldName, fieldValue] of Object.entries(givenData)) {
  const fieldDom = document.querySelector<HTMLFormElement>(
    `[name="${CSS.escape(fieldName)}"]`,
  );

  if (!fieldDom) continue;

  if (typeof fieldValue === 'string') {
    fieldDom.value = fieldValue;
  } else if (fieldDom.matches('select[multiple]')) {
    setMultiselectData(fieldDom, fieldValue);
  }
}
