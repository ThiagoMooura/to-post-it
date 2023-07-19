import { Component, OnInit } from '@angular/core';

interface PostIt {
  id: number;
  texto: string;
  cor: string;
  posicao: string;
  concluido: boolean;
  editavel: boolean;
  alterarCor: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  text: string = '';
  newText: string = '';
  id: number = 0;
  array: PostIt[] = [];
  ultimaCor: string | any = null;
  penultimaCor: string | any = null;
  mover: boolean = false;
  idMover: any
  objMover: any

  ngOnInit(): void {
    const stringArray = localStorage.getItem('postIt');
    if (stringArray !== null) {
      const meuArrayRecuperado = JSON.parse(stringArray);
      this.array = meuArrayRecuperado;
      this.id = this.encontrarMaiorId(this.array)
    }
    this.ultimaCor = localStorage.getItem('ultimaCor');
    this.penultimaCor = localStorage.getItem('penultimaCor');

  }

  encontrarMaiorId(array: any) {
    if (array.length === 0) {
      return 0; // retorna null se o array estiver vazio
    }

    let maiorId = array[0].id; // considera o primeiro objeto como o maior
    for (let i = 1; i < array.length; i++) {
      if (array[i].id > maiorId) {
        maiorId = array[i].id; // atualiza o maiorId se um valor maior for encontrado
      }
    }
    console.log('maiorId', maiorId)
    return maiorId;
  }

  add() {
    if (this.text.length == 1) {
      this.text = '';
      return;
    }

    const cores = [
      '#FFFF00', // Amarelo
      '#7BED7B', // Verde
      '#FFA500', // Laranja
      '#BC83E6', // Roxo
      '#40E0D0', // Turquesa
    ];
    
    let indice;
    let cor;
    do {
      indice = Math.floor(Math.random() * cores.length);
      cor = cores[indice];
    } while (cor === this.ultimaCor || cor === this.penultimaCor);
    this.penultimaCor = this.ultimaCor;
    this.ultimaCor = cor;
    const posicao = Math.floor(Math.random() * 11) - 5;
    this.id = this.id+1
    const postIt: PostIt = {
      id: this.id,
      texto: this.text,
      cor: cores[indice],
      posicao: 'rotate(' + posicao + 'deg)',
      concluido: false,
      editavel: false,
      alterarCor: false,
    };
    this.array.push(postIt);
    this.text = '';
    localStorage.setItem('postIt', JSON.stringify(this.array));
    localStorage.setItem('ultimaCor', this.ultimaCor);
    localStorage.setItem('penultimaCor', this.penultimaCor);
  }

  concluir(id: number) {
    this.array.map((el: any) => {
      if (el.id === id) {
        el.concluido = true;
      }
    });
    let index = this.array.findIndex((objeto) => objeto.id === id);
    let selecionado = this.array[index];
    this.delete(id);
    this.array.unshift(selecionado);
    localStorage.setItem('postIt', JSON.stringify(this.array));
    const set = this.array.length - 1;
    this.ultimaCor = this.array[set].cor;
  }

  desfazer(id: number) {
    this.array.map((el: any) => {
      if (el.id === id) {
        el.concluido = false;
      }
    });
    localStorage.setItem('postIt', JSON.stringify(this.array));
  }

  delete(id: number) {
    const index = this.array.findIndex((objeto) => objeto.id === id);
    if (index !== -1) {
      this.array.splice(index, 1);
    }

    localStorage.setItem('postIt', JSON.stringify(this.array));
    const set = this.array.length - 1;
    this.ultimaCor = this.array[set]?.cor;
  }

  editar(id: number) {
    this.array.map((el: any) => {
      if (el.id === id) {
        el.editavel = !el.editavel;
      }
    });
  }

  novoTexto(texto: any) {
    const textoRecebido = texto?.value;
    this.newText = textoRecebido;
  }

  mudaTexto(id: number) {
    if (this.newText === '') {
      return;
    }
    this.array.map((el: any) => {
      if (el.id === id) {
        el.texto = this.newText;
      }
    });
    this.editar(id);
    this.newText = '';
    localStorage.setItem('postIt', JSON.stringify(this.array));
    console.log(this.array);
  }

  setAlterarCor(id: number) {
    this.array.map((el: any) => {
      if (el.id === id) {
        el.alterarCor = !el.alterarCor;
      }
    });
  }

  alteraCor(id: number, cor: string) {
    this.array.map((el: any) => {
      if (el.id === id) {
        el.cor = cor;
      }
    });
    this.setAlterarCor(id)
    localStorage.setItem('postIt', JSON.stringify(this.array));
  }

  toggleMover(){
    this.mover = !this.mover
  }

  getMoverData(id: number, obj: PostIt){
    this.idMover = id
    this.objMover = obj
    console.log('id a ser movido:', this.idMover)
    console.log('obj a ser movidor:',this.objMover)
    console.log('array',this.array)
  }

  moverItem(id:number){
    const selecionado = this.array.findIndex(obj => obj.id === id)
    this.delete(this.idMover)
    this.array.splice(selecionado,0,this.objMover)
    console.log('selecionado',selecionado)
    this.toggleMover()
    localStorage.setItem('postIt', JSON.stringify(this.array));
    console.log('array',this.array)
  }
}
