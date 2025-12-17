import type { DiagramMetadata } from '../types.js';

export default {
  id: 'railroad',
  name: 'Railroad Diagram',
  description: 'Grammar visualization using railroad notation',
  examples: [
    {
      title: 'Expression Grammar',
      isDefault: true,
      code: `railroad-diagram
  title "Expression Grammar"

  expression = term ( ( "+" | "-" ) term )* ;
  term = factor ( ( "*" | "/" ) factor )* ;
  factor = number | "(" expression ")" ;
  number = digit+ ;
  digit = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" ;
`,
    },
  ],
} satisfies DiagramMetadata;
