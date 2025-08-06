import { GlobalWorkerOptions } from 'pdfjs-dist';
import worker from 'pdfjs-dist/build/pdf.worker?worker';

GlobalWorkerOptions.workerSrc = worker;
