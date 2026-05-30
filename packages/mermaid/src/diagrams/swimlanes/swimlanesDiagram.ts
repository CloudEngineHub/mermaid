import { createFlowDiagram } from '../flowchart/flowDiagram.js';
import swimlanesStyles from './styles.js';

export const diagram = createFlowDiagram({ defaultLayout: 'swimlanes', styles: swimlanesStyles });
