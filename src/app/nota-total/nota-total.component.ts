import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-nota-total',
  standalone: true,
  imports: [],
  templateUrl: './nota-total.component.html',
  styleUrl: './nota-total.component.css'
})

export class NotaTotalComponent implements OnInit{

  @ViewChild('nota1') nota1?: ElementRef;
  @ViewChild('nota2') nota2?: ElementRef;
  @ViewChild('nota3') nota3?: ElementRef;
  @ViewChild('mensajeModal') mensajeModal?: ElementRef;
  @ViewChild('resultadoParrafo') resultadoParrafo?: ElementRef;

  constructor(private rendered2: Renderer2) { }

  ngOnInit(): void {
  }

  hallarPonderadoTotal(nota1:number, nota2:number, nota3:number): number{
    let total = 0.3*(nota1+nota3) + 0.4*(nota2);

    if (total >= 0 && total <= 20) {
        return Math.round(total * 10) / 10;
    } else {
        return NaN;
    }
  }

  botonResultadoTotal(){
    
    //Para las notas
    const nota1 = parseFloat(this.nota1?.nativeElement.value);
    const nota2 = parseFloat(this.nota2?.nativeElement.value);
    const nota3 = parseFloat(this.nota3?.nativeElement.value);

    //Para el modal
    const mensajeModal = this.mensajeModal?.nativeElement;
    const resultadoParrafo = this.resultadoParrafo?.nativeElement;

    let resultado = this.hallarPonderadoTotal(nota1,nota2,nota3);

    //Para evitar que se muestre los mensajes más de una vez
    while (mensajeModal.firstChild && resultadoParrafo.firstChild) {
      mensajeModal.removeChild(mensajeModal.firstChild);
      resultadoParrafo.removeChild(resultadoParrafo.firstChild);
    }

    if(!isNaN(resultado)){
  
      if(resultado > 15){
        this.rendered2.appendChild(mensajeModal, this.rendered2.createText('Felicidades'));
        this.rendered2.setStyle(mensajeModal, 'color', 'green');
      }
      else if(resultado > 10 && resultado <=15){
        this.rendered2.appendChild(mensajeModal, this.rendered2.createText('A seguir mejorando'));
        this.rendered2.setStyle(mensajeModal, 'color', '#B8860B');
      }
      else if(resultado >= 0 && resultado <10){
        this.rendered2.appendChild(mensajeModal, this.rendered2.createText('Reprobaste'));
        this.rendered2.setStyle(mensajeModal, 'color', 'red');
      }else{
          mensajeModal.textContent = `CUIDADO`;
          mensajeModal.style.color = "red";
      }

    resultadoParrafo.innerHTML = `Haz obtenido un puntaje de <b>${resultado}</b>`;
    }
    else{
      //Texto h1
      this.rendered2.appendChild(mensajeModal, this.rendered2.createText('¡AVISO!'));
      this.rendered2.setStyle(mensajeModal, 'color', 'red');

      //Texto p
      this.rendered2.appendChild(resultadoParrafo, this.rendered2.createText('Resultado no válido, ingrese valores entre 0 y 20.'));
      this.rendered2.setStyle(resultadoParrafo, 'color', 'red');
    }
  }
}
