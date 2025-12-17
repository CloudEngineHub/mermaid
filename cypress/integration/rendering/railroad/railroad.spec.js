import { imgSnapshotTest } from '../../../helpers/util';

describe('railroad diagram', () => {
  it('should render an expression grammar', () => {
    imgSnapshotTest(
      `railroad-diagram
        title "Expression Grammar"

        expression = term ( ( "+" | "-" ) term )* ;
        term = factor ( ( "*" | "/" ) factor )* ;
        factor = number | "(" expression ")" ;
        number = digit+ ;
        digit = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" ;
      `
    );
  });
});
