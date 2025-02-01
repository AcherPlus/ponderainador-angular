import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-nota-individual',
  standalone: true,
  imports: [],
  templateUrl: './nota-individual.component.html',
  styleUrl: './nota-individual.component.css',
})
export class NotaIndividualComponent implements OnInit {
  @ViewChild('nota1') nota1?: ElementRef;
  @ViewChild('nota2') nota2?: ElementRef;
  @ViewChild('tituloEva1') tituloEva1?: ElementRef;
  @ViewChild('tituloEva2') tituloEva2?: ElementRef;
  @ViewChild('notaEscogida') notaEscogida?: ElementRef;
  @ViewChild('mensajeModal') mensajeModal?: ElementRef;
  @ViewChild('resultadoParrafo') resultadoParrafo?: ElementRef;

  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
    setTimeout(() => this.selectNota());
  }

  selectNota = () => {
    const valorSelec1 = this.notaEscogida?.nativeElement.value;
    const evaluaciones: Record<string, [string, string]> = {
      EP: ['Evaluación Continua', 'Examen Final'],
      EC: ['Examen Parcial', 'Examen Final'],
      EF: ['Examen Parcial', 'Evaluación Continua'],
    };

    this.setText(this.tituloEva1, evaluaciones[valorSelec1]?.[0] || '');
    this.setText(this.tituloEva2, evaluaciones[valorSelec1]?.[1] || '');
  };

  private setText(element: ElementRef | undefined, text: string): void {
    if (element?.nativeElement) {
      this.renderer.setProperty(element.nativeElement, 'innerHTML', text);
    }
  }

  hallarPonderadoIndividual(nota1: number, nota2: number): number[] {
    let notaMinima = 0,
      notaMaxima = 0;
    const valorSelec1 = this.notaEscogida?.nativeElement.value;

    const calculos: Record<string, () => void> = {
      EP: () => {
        notaMinima = (106 - 4 * nota1) / 3 - nota2;
        notaMaxima = 0.3 * (20 + nota2) + 0.4 * nota1;
      },
      EC: () => {
        notaMinima = (106 - 3 * (nota1 + nota2)) / 4;
        notaMaxima = 0.3 * (nota1 + nota2) + 0.4 * 20;
      },
      EF: () => {
        notaMinima = (106 - 4 * nota2) / 3 - nota1;
        notaMaxima = 0.3 * (nota1 + 20) + 0.4 * nota2;
      },
    };
    calculos[valorSelec1]?.();

    return [Math.round(notaMinima * 10) / 10, Math.round(notaMaxima * 10) / 10];
  }

  botonResultadoIndividual(): void {
    const nota1 = parseFloat(this.nota1?.nativeElement.value);
    const nota2 = parseFloat(this.nota2?.nativeElement.value);

    if (
      !this.resultadoParrafo?.nativeElement ||
      isNaN(nota1) ||
      isNaN(nota2) ||
      nota1 < 0 ||
      nota1 > 20 ||
      nota2 < 0 ||
      nota2 > 20
    ) {
      this.setText(
        this.resultadoParrafo,
        'Resultado no válido, ingrese valores entre 0 y 20.'
      );
      return;
    }

    const [notaMinima, notaMaxima] = this.hallarPonderadoIndividual(
      nota1,
      nota2
    );
    const resultado =
      notaMinima <= 20 && notaMaxima <= 20
        ? `Nota mínima: <b>${notaMinima}</b> <br> Nota máxima: <b>${notaMaxima}</b>`
        : 'Resultado no válido, ingrese valores entre 0 y 20.';

    this.setText(this.resultadoParrafo, resultado);
  }
}
